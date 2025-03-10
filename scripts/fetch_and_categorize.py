import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from collections import defaultdict

# Step 1: Load data from Google Sheets
def fetch_data_from_google_sheets():
    try:
        # Get the user's home directory
        home_dir = os.path.expanduser("~")
        
        # Path to your service account credentials file
        credentials_path = os.path.join("..", "web", "bestreps-c66264362c6d.json")
        
        # Check if credentials file exists
        if not os.path.exists(credentials_path):
            print(f"Error: Credentials file '{credentials_path}' not found.")
            return []
        
        # Authenticate with Google Sheets API
        credentials = service_account.Credentials.from_service_account_file(
            credentials_path, 
            scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
        )
        
        # Build the sheets service
        service = build('sheets', 'v4', credentials=credentials)
        
        # Spreadsheet ID and range - updated to include all data
        spreadsheet_id = '1fx62SSDpk3aajq8wiatD6nOdl2-X2xA0TS-_2lC425k'
        
        # Get spreadsheet info to determine the actual data range
        sheet_metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        sheets = sheet_metadata.get('sheets', [])
        
        if not sheets:
            print('No sheets found in the spreadsheet.')
            return []
            
        # Get the first sheet's properties
        first_sheet = sheets[0]
        sheet_title = first_sheet['properties']['title']
        
        # Make API request with pagination to handle large datasets
        all_rows = []
        batch_size = 1000  # Google Sheets API has limits on response size
        
        # First batch: get all columns but with a specified range of rows
        range_name = f"{sheet_title}!A1:Z1000"  # First 1000 rows with columns A through Z
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id, 
            range=range_name
        ).execute()
        
        rows = result.get('values', [])
        all_rows.extend(rows)
        
        # Second batch: get the next 1000 rows if needed
        if len(rows) == 1000:  # If we got 1000 rows, there might be more
            range_name = f"{sheet_title}!A1001:Z2000"  # Next 1000 rows
            result = service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id, 
                range=range_name
            ).execute()
            more_rows = result.get('values', [])
            all_rows.extend(more_rows)
            
            # Check if we need even more rows (beyond 2000)
            if len(more_rows) == 1000:
                print("Warning: There may be more than 2000 rows in the spreadsheet. Current extraction limited to 2000 rows.")
        
        if not all_rows:
            print('No data found in the spreadsheet.')
            return []
        
        # Process data (assuming first row is header)
        processed_data = []
        headers = all_rows[0] if all_rows else []
        
        # Skip header row
        data_rows = all_rows[1:] if len(all_rows) > 1 else []
        
        # Process each row, handling missing data
        for row in data_rows:
            row_data = {}
            
            # Get name, price, and link with proper error handling
            row_data["name"] = row[0] if len(row) > 0 else ""
            row_data["price"] = row[1] if len(row) > 1 else ""
            row_data["link"] = row[2] if len(row) > 2 else ""
            
            # Only add rows that have at least a name
            if row_data["name"]:
                processed_data.append(row_data)
        
        return processed_data
    
    except HttpError as error:
        print(f"An error occurred with the Google Sheets API: {error}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []

# Step 2: Analyze terms in the data
def analyze_terms(data):
    term_frequency = defaultdict(int)
    for item in data:
        name = item["name"].lower()
        terms = name.split()  # Split name into individual terms
        for term in terms:
            term_frequency[term] += 1
    return term_frequency

# Step 3: Suggest potential categories with unique keywords
def suggest_categories(term_frequency):
    print("Common terms found in the data:")
    for term, frequency in sorted(term_frequency.items(), key=lambda x: x[1], reverse=True):
        print(f"{term}: {frequency} occurrences")
    
    # Suggest categories with unique keywords
    suggestions = {
        "shoes": [
            "nike", "adidas", "jordan", "yeezy", "puma", "new balance", "converse", "vans",
            "reebok", "asics", "under armour", "skechers", "fila", "timberland", "clarks",
            "dr. martens", "birkenstock", "crocs", "salomon", "onitsuka tiger", "hoka",
            "balenciaga", "gucci", "prada", "louis vuitton", "common projects", "veja"
        ],
        "shirts": [
            "ralph lauren", "tommy hilfiger", "lacoste", "versace", "t shirt", "shirt", "polo",
            "henley", "button down", "oxford", "flannel", "champion", "supreme", "stone island",
            "off-white", "palace", "stussy", "carhartt", "uniqlo", "zara", "h&m", "calvin klein",
            "hugo boss", "burberry", "armani"
        ],
        "pants": [
            "levi's", "wrangler", "diesel", "calvin klein", "hugo boss", "tommy hilfiger",
            "jeans", "chinos", "cargos", "trousers", "sweatpants", "joggers", "khakis", "slacks",
            "dickies", "carhartt", "uniqlo", "zara", "h&m", "prada", "balenciaga", "off-white",
            "stone island", "supreme", "palace"
        ],
        "hoodies": [
            "champion", "supreme", "stone island", "off-white", "palace", "stussy", "carhartt",
            "uniqlo", "zara", "h&m", "calvin klein", "hugo boss", "gucci", "versace", "balenciaga",
            "prada", "fear of god", "essentials", "yeezy", "tommy hilfiger", "ralph lauren",
            "lacoste", "burberry", "armani"
        ]
    }
    
    print("\nSuggested categories and keywords (unique to each category):")
    for category, keywords in suggestions.items():
        print(f"{category}: {', '.join(keywords)}")
    
    return suggestions

# Step 4: Define custom categories
def define_categories(suggestions):
    categories = {}
    print("\nDefine your categories and keywords:")
    for category, keywords in suggestions.items():
        user_input = input(f"Enter keywords for '{category}' (comma-separated, or press Enter to use suggestions): ")
        if user_input.strip():
            categories[category] = [keyword.strip() for keyword in user_input.split(",")]
        else:
            categories[category] = keywords
    return categories

# Step 5: Categorize the data
def categorize_data(data, categories):
    categorized_data = []
    processed_count = 0  # Counter for processed items
    for item in data:
        name = item["name"].lower()
        category = "other"  # Default category
        for cat, keywords in categories.items():
            if any(keyword in name for keyword in keywords):
                category = cat
                break
        item["category"] = category
        categorized_data.append(item)
        processed_count += 1  # Increment counter
    return categorized_data, processed_count

# Main function
def main():
    # Step 1: Fetch data from Google Sheets
    print("Fetching data from Google Sheets...")
    data = fetch_data_from_google_sheets()
    if not data:
        print("No data fetched. Exiting.")
        return
    
    # Step 2: Analyze terms
    term_frequency = analyze_terms(data)
    
    # Step 3: Suggest categories
    suggested_categories = suggest_categories(term_frequency)
    
    # Step 4: Define custom categories
    categories = define_categories(suggested_categories)
    
    # Step 5: Categorize the data
    print("\nCategorizing data...")
    categorized_data, processed_count = categorize_data(data, categories)
    
    # Save categorized data to JSON file
    with open("../web/data_cat.json", "w", encoding="utf-8") as f:
        json.dump(categorized_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nSuccess! Processed {processed_count} items.")
    print("Categorized data saved to '../web/data_cat.json'.")

if __name__ == "__main__":
    main()