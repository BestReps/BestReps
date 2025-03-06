import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def main():
    try:
        # Get the user's home directory
        home_dir = os.path.expanduser("~")
        
        # Path to your service account credentials file
        credentials_path = os.path.join(home_dir, "Desktop", "BestReps", "web", "bestreps-c66264362c6d.json")
        
        # Check if credentials file exists
        if not os.path.exists(credentials_path):
            print(f"Error: Credentials file '{credentials_path}' not found.")
            return
        
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
            return
            
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
            return
        
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
        
        # Write data to JSON file
        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)
        
        print(f"Success! Processed {len(processed_data)} rows of data.")
        print("Data saved to data.json")
        
    except HttpError as error:
        print(f"An error occurred with the Google Sheets API: {error}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    main()