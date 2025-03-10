import json
from bs4 import BeautifulSoup
from collections import defaultdict

# Step 1: Parse a single HTML file
def parse_html_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            soup = BeautifulSoup(file, "html.parser")
        
        # Extract data from the HTML table
        products = []
        table = soup.find("table", class_="waffle")  # Find the table
        if not table:
            print(f"No table found in the HTML file: {file_path}")
            return products
        
        # Iterate through rows (skip the header row)
        for row in table.find_all("tr")[1:]:
            cells = row.find_all("td")
            if len(cells) >= 10:  # Ensure there are enough cells
                name = cells[0].text.strip()  # Product name
                price_usd = cells[3].text.strip()  # Price in USD
                image_tag = cells[4].find("img")  # Image URL
                image_url = image_tag["src"] if image_tag else ""
                link_tag = cells[1].find("a")  # Product link
                link = link_tag["href"] if link_tag else ""
                
                # Add the product data to the list
                products.append({
                    "name": name,
                    "price_usd": price_usd,
                    "image_url": image_url,
                    "link": link
                })
        
        return products
    
    except Exception as e:
        print(f"An error occurred while parsing the HTML file {file_path}: {e}")
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

# Step 6: Save the parsed data to a JSON file
def save_to_json(data, output_file):
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Data saved to {output_file}")
    except Exception as e:
        print(f"An error occurred while saving the JSON file: {e}")

# Main function
def main():
    # List of HTML files to parse
    file_paths = [
        r"pics\spreadsheet 1.html",  # First file
        r"pics\spreadsheet 2.html"   # Second file
    ]
    
    # Parse all HTML files and combine the data
    all_products = []
    for file_path in file_paths:
        print(f"Parsing HTML file: {file_path}")
        data = parse_html_file(file_path)
        if data:
            all_products.extend(data)  # Add parsed data to the combined list
    
    if not all_products:
        print("No data parsed from any file. Exiting.")
        return
    
    # Step 2: Analyze terms
    term_frequency = analyze_terms(all_products)
    
    # Step 3: Suggest categories
    suggested_categories = suggest_categories(term_frequency)
    
    # Step 4: Define custom categories
    categories = define_categories(suggested_categories)
    
    # Step 5: Categorize the data
    categorized_data, processed_count = categorize_data(all_products, categories)
    
    # Save the categorized data to a JSON file
    output_file = "data_cat.json"
    save_to_json(categorized_data, output_file)
    
    print(f"\nSuccess! Processed {processed_count} items.")
    print(f"Categorized data saved to '{output_file}'.")

if __name__ == "__main__":
    main()