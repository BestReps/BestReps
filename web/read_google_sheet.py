import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def main():
    try:
        # Path to your service account credentials file
        credentials_path = r'C:\Users\roans\Desktop\BestReps\web\bestreps-c66264362c6d.json'
        
        # Check if credentials file exists
        if not os.path.exists(credentials_path):
            print(f"Error: Credentials file '{credentials_path}' not found.")
            return
        
        # Authenticate with Google Sheets API
        credentials = service_account.Credentials.from_service_account_file(
            credentials_path, 
            scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
        )
        
        # Build the sheets service
        service = build('sheets', 'v4', credentials=credentials)
        
        # Spreadsheet ID and range
        # Replace with your actual spreadsheet ID
        spreadsheet_id = '1fx62SSDpk3aajq8wiatD6nOdl2-X2xA0TS-_2lC425k'
        range_name = 'Sheet1!A1:C11'  # First 10 rows plus header row
        
        # Make the API request
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        
        # Extract values from the response
        rows = result.get('values', [])
        
        if not rows:
            print('No data found in the spreadsheet.')
            return
        
        # Process data (assuming first row is header)
        processed_data = []
        
        # Skip header row if present
        data_rows = rows[1:11] if len(rows) > 1 else []
        
        for row in data_rows:
            # Handle rows with missing data
            name = row[0] if len(row) > 0 else ""
            price = row[1] if len(row) > 1 else ""
            link = row[2] if len(row) > 2 else ""
            
            processed_data.append({
                "name": name,
                "price": price,
                "link": link
            })
        
        # Write data to JSON file
        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)
        
        print(f"Success! Processed {len(processed_data)} rows of data.")
        print("Data saved to data.json")
        
    except HttpError as error:
        print(f"An error occurred with the Google Sheets API: {error}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    main()