import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def main():
    try:
        # Get the user's home directory
        home_dir = os.path.expanduser("~")
        
        # Path to your service account credentials file
        credentials_path = os.path.join(home_dir, "Desktop", "BestReps", "web", "bestreps-c66264362c6d.json")
        
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
        spreadsheet_id = '1fx62SSDpk3aajq8wiatD6nOdl2-X2xA0TS-_2lC425k'
        range_name = 'Sheet1!A6:J'  # Start from row 6 and include all columns up to J
        
        # Make the API request
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        
        # Extract values from the response
        rows = result.get('values', [])
        
        if not rows:
            print('No data found in the spreadsheet.')
            return
        
        # Process data
        processed_data = []
        
        for row in rows:
            # Handle rows with missing data
            name = row[0] if len(row) > 0 else ""
            price = row[3] if len(row) > 3 else ""
            link = row[9] if len(row) > 9 else ""
            
            processed_data.append({
                "name": name,
                "price": price,
                "link": link
            })
        
        # Write data to JSON file
        output_path = os.path.join(home_dir, "Desktop", "BestReps", "web", "data.json")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)
        
        print(f"Success! Processed {len(processed_data)} rows of data.")
        print(f"Data saved to {output_path}")
        
    except HttpError as error:
        print(f"An error occurred with the Google Sheets API: {error}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    main()