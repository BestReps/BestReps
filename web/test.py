import gspread
from google.oauth2.service_account import Credentials

# Path to your service account JSON key file
SERVICE_ACCOUNT_FILE = r"C:\Users\roans\Desktop\BestReps\web\bestreps-c66264362c6d.json"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# Authenticate using service account credentials
try:
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    print("✅ Credentials loaded successfully.")
except Exception as e:
    print(f"❌ Error loading credentials: {e}")
    exit()

# Create a client to interact with Google Sheets API
try:
    client = gspread.authorize(creds)
    print("✅ gspread authorized successfully.")
except Exception as e:
    print(f"❌ Error authorizing gspread: {e}")
    exit()

# Google Sheet ID (use the ID from your link)
SHEET_ID = "1XIRn91wPyQQ1yi3alOE5BxG99ZNZ9UgloilsX9ploJc"

# Attempt to open the sheet by ID
try:
    sheet = client.open_by_key(SHEET_ID)
    print(f"✅ Successfully connected to the sheet: {sheet.title}")
except Exception as e:
    print(f"❌ Error accessing the sheet: {e}")
    exit()
