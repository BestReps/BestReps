from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load credentials from the service account file
credentials = service_account.Credentials.from_service_account_file(
    'path/to/credentials.json',
    scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
)

# The ID and range of the spreadsheet
SPREADSHEET_ID = '18ZoM78uknCQEf6S89joP_XJDXEaW5_FJOpspCabLnO4'
RANGE_NAME = 'Sheet1!A1:E'  # Adjust the range as needed

# Build the service
service = build('sheets', 'v4', credentials=credentials)

# Call the Sheets API
sheet = service.spreadsheets()
result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=RANGE_NAME).execute()
values = result.get('values', [])

if not values:
    print('No data found.')
else:
    for row in values:
        print(row)
