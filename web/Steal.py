import json
import os
import gspread
from google.oauth2.service_account import Credentials

# Get the user's home directory
home_dir = os.path.expanduser("~")

# Path to your JSON credentials file
SERVICE_ACCOUNT_FILE = os.path.join(home_dir, "Desktop", "BestReps", "web", "service_account.json")

# Define the scope (read-only access to Google Sheets)
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# Authenticate using the service account
try:
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    client = gspread.authorize(creds)
    print("Successfully authenticated.")
except Exception as e:
    print(f"Error during authentication: {e}")
    exit()

# Google Sheet ID
SHEET_ID = "16A8HiDzblYg6WEaFaTlc04Qw6F4_MXnoW9o8Ju4FQk8"

# Try to open the sheet by ID
try:
    sheet = client.open_by_key(SHEET_ID)
    worksheet = sheet.get_worksheet(0)  # Open the first worksheet (index 0)
    print("Successfully accessed the worksheet.")
except Exception as e:
    print(f"Error accessing the sheet: {e}")
    exit()

# Try to get all the data from the worksheet
try:
    data = worksheet.get_all_values()
    print(f"Data retrieved: {len(data)} rows")
except Exception as e:
    print(f"Error retrieving data from the sheet: {e}")
    exit()

# Collect data with actual links (ensure that columns exist)
output_data = []
for row_idx, row in enumerate(data, start=6):  # Start from row 6 to match your sheet index
    print(f"Processing row {row_idx}: {row}")  # Debug: Show the content of the row being processed

    # Check if the row has at least 2 columns (for Link Text and Name)
    if len(row) < 2:
        print(f"Row {row_idx} has fewer than 2 columns. Skipping.")  # Debug: Row has insufficient columns
        continue  # Skip rows that don't have enough columns
    
    name = row[0]       # Column A: Name
    price_usd = row[2]  # Column C: Price (USD)
    link_text = row[1]  # Column B: Link Text ("LINK")

    # Get the cell in Column B (Link Text) for extracting the link
    cell = worksheet.cell(row_idx, 2)  # Column B is the 2nd column (1-indexed)
    print(f"Extracting link for cell at row {row_idx}, column 2...")  # Debug: Extracting link
    
    # Attempt to get the hyperlink using the cell's hyperlink method
    try:
        link_url = cell.hyperlink  # Directly get the hyperlink URL
        if not link_url:
            link_url = "No Link"
        print(f"Link extracted: {link_url}")  # Debug: Show the extracted link
    except Exception as e:
        print(f"Error extracting hyperlink from cell: {e}")
        link_url = "No Link"

    # Append the data to the output list
    output_data.append([name, link_url, price_usd])

# Save the data to a JSON file
output_path = os.path.join(home_dir, "Desktop", "BestReps", "web", "data.json")
try:
    with open(output_path, "w", encoding="utf-8") as json_file:
        json.dump(output_data, json_file, indent=4, ensure_ascii=False)
    print(f"✅ Data successfully saved to {output_path}")
except Exception as e:
    print(f"Error saving data to JSON: {e}")

# Display the output data in the terminal
print("Output Data:")
for item in output_data:
    print(item)
