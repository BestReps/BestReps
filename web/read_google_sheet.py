import gspread
import json
import os
from google.oauth2.service_account import Credentials

# Get the user's home directory
home_dir = os.path.expanduser("~")

# Path to your JSON credentials file
SERVICE_ACCOUNT_FILE = os.path.join(home_dir, "Desktop", "BestReps", "web", "bestreps-c66264362c6d.json")

# Define the scope
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

# Try to get all the data from the worksheet starting from row 6
try:
    data = worksheet.get_all_values()[5:]  # Skip the first 5 rows
    print(f"Data retrieved: {len(data)} rows")
except Exception as e:
    print(f"Error retrieving data from the sheet: {e}")
    exit()

# Collect data with actual links (ensure that columns exist)
output_data = []
for row in data:
    if len(row) < 10:
        continue  # Skip rows that don't have enough columns
    name, price_usd, link_text = row[0], row[3], row[9]  # Adjust to get link_text from column J

    output_data.append([name, price_usd, link_text])

    if len(output_data) >= 5:
        break  # Stop after retrieving 5 rows

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
    print(f"Name: {item[0]}, Price: {item[1]}, Link: {item[2]}")
