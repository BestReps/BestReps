import gspread
from google.oauth2.service_account import Credentials

# Path to your service account JSON file
SERVICE_ACCOUNT_FILE = r'C:\Users\roans\Desktop\BestReps\web\service_account.json'  # Use raw string to avoid unicode escape issues

# Scopes for read-only access to Google Sheets
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# Google Sheet ID (Replace with your actual sheet ID)
SHEET_ID = '16A8HiDzblYg6WEaFaTlc04Qw6F4_MXnoW9o8Ju4FQk8'  # Replace with your actual Google Sheet ID

# Authenticate using the service account
try:
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    client = gspread.authorize(creds)
    print("Successfully authenticated.")
except Exception as e:
    print(f"Error during authentication: {e}")
    exit()

# Try to open the sheet by ID
try:
    sheet = client.open_by_key(SHEET_ID)
    worksheet = sheet.get_worksheet(0)  # Access the first sheet
    print("Successfully accessed the worksheet.")
    # Optionally, fetch some data
    data = worksheet.get_all_values()
    print(f"Data retrieved from the sheet: {len(data)} rows")
except Exception as e:
    print(f"Error accessing the sheet: {e}")
    exit()
