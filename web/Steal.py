import re
import gspread
import json
import os
from google.oauth2.service_account import Credentials

# Get the user's home directory
home_dir = os.path.expanduser("~")

# Path to your JSON credentials file
SERVICE_ACCOUNT_FILE = os.path.join(home_dir, "Desktop", "BestReps", "web", "service_account.json")

# Define the scope
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# Authenticate using the service account
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
client = gspread.authorize(creds)

# Open the Google Sheet by ID
SHEET_ID = "16A8HiDzblYg6WEaFaTlc04Qw6F4_MXnoW9o8Ju4FQk8"
sheet = client.open_by_key(SHEET_ID)

# Select the first worksheet
worksheet = sheet.get_worksheet(0)

# Get all values
data = worksheet.get_all_values()

# Function to extract the actual URL from a hyperlink formula
def extract_url(cell_value):
    """Extract URL from a HYPERLINK formula in Google Sheets"""
    match = re.search(r'HYPERLINK\("([^"]+)",\s*".*?"\)', cell_value)
    return match.group(1) if match else cell_value  # Return URL if found, else return original value

# Collect data with actual links
output_data = []
for row in data:
    name, link_text, price_yen, price_usd = row
    
    # Find the cell containing the hyperlink text
    cell = worksheet.find(link_text)
    
    # Get the cell formula (raw value including hyperlink)
    formula = worksheet.cell(cell.row, cell.col, value_render_option='FORMULA').value  
    
    # Extract actual URL if it's a hyperlink formula
    link = extract_url(formula)  

    output_data.append([name, link, price_yen, price_usd])

# Save data to JSON file
output_path = os.path.join(home_dir, "Desktop", "BestReps", "web", "data.json")
with open(output_path, "w", encoding="utf-8") as json_file:
    json.dump(output_data, json_file, indent=4, ensure_ascii=False)

print(f"✅ Data successfully saved to {output_path}")
