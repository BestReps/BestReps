import re
import gspread
from google.oauth2.service_account import Credentials

# Authenticate using the service account
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SERVICE_ACCOUNT_FILE = r"C:\Users\roans\Desktop\BestReps\web\service_account.json"

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
    match = re.search(r'HYPERLINK\("([^"]+)"', cell_value)
    return match.group(1) if match else cell_value

# Print data with actual links
for row in data:
    name, link_text, price_yen, price_usd = row
    cell = worksheet.find(link_text)  # Locate the cell containing the link text
    formula = worksheet.cell(cell.row, cell.col, value_render_option='FORMULA').value  # Get formula
    link = extract_url(formula)  # Extract actual URL from formula
    print([name, link, price_yen, price_usd])
