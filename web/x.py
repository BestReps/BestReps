import json
from bs4 import BeautifulSoup

# Step 1: Parse the HTML file
def parse_html_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            soup = BeautifulSoup(file, "html.parser")
        
        # Extract data from the HTML table
        products = []
        table = soup.find("table", class_="waffle")  # Find the table
        if not table:
            print("No table found in the HTML file.")
            return products
        
        # Iterate through rows (skip the header row)
        for row in table.find_all("tr")[1:]:
            cells = row.find_all("td")
            if len(cells) >= 10:  # Ensure there are enough cells
                name = cells[0].text.strip()  # Product name
                price_cny = cells[2].text.strip()  # Price in CNY
                price_usd = cells[3].text.strip()  # Price in USD
                image_tag = cells[4].find("img")  # Image URL
                image_url = image_tag["src"] if image_tag else ""
                link_tag = cells[1].find("a")  # Product link
                link = link_tag["href"] if link_tag else ""
                
                # Add the product data to the list
                products.append({
                    "name": name,
                    "price_cny": price_cny,
                    "price_usd": price_usd,
                    "image_url": image_url,
                    "link": link
                })
        
        return products
    
    except Exception as e:
        print(f"An error occurred while parsing the HTML file: {e}")
        return []

# Step 2: Save the parsed data to a JSON file
def save_to_json(data, output_file):
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Data saved to {output_file}")
    except Exception as e:
        print(f"An error occurred while saving the JSON file: {e}")

# Main function
def main():
    # Path to the HTML file
    file_path = "path/to/your/file.html"  # Update this path to your HTML file
    
    # Parse the HTML file
    print("Parsing HTML file...")
    data = parse_html_file(file_path)
    
    if not data:
        print("No data parsed. Exiting.")
        return
    
    # Print the parsed data
    print("Parsed data:")
    for item in data:
        print(item)
    
    # Save the parsed data to a JSON file
    output_file = "parsed_data.json"
    save_to_json(data, output_file)

if __name__ == "__main__":
    main()