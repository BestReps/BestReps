import gspread
from google.oauth2.service_account import Credentials

# Path to your JSON credentials file
SERVICE_ACCOUNT_FILE = "service_account.json"

# Define the scope
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Authenticate using the service account
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# Connect to Google Sheets
client = gspread.authorize(creds)

# Open the Google Sheet by ID
SHEET_ID = "16A8HiDzblYg6WEaFaTlc04Qw6F4_MXnoW9o8Ju4FQk8"
sheet = client.open_by_key(SHEET_ID)

# Select the first worksheet
worksheet = sheet.get_worksheet(0)

# Get all values
data = worksheet.get_all_values()

# Print data
for row in data:
    print(row)
