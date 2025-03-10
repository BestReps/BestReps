function extractLinksFromColumnC() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow(); // Get the last row with data in the sheet
  var chunkSize = 50;  // Process 50 rows at a time
  var startRow = 1;  // Start at the first row
  
  while (startRow <= lastRow) {
    // Define the range of rows to process
    var range = sheet.getRange(startRow, 3, Math.min(chunkSize, lastRow - startRow + 1), 1); // Column C (3rd column)
    var values = range.getValues();  // Get values from column C
    var links = [];
    
    // Extract the links from the range
    for (var i = 0; i < values.length; i++) {
      var richTextValue = sheet.getRange(startRow + i, 3).getRichTextValue();  // Get rich text value of the cell
      var link = richTextValue ? richTextValue.getLinkUrl() : "";  // Extract the URL (handle null)
      links.push([link ? link : ""]);  // If there's no link, add an empty string
    }
    
    // Write the extracted links back to column C
    var outputRange = sheet.getRange(startRow, 3, links.length, 1);  // Column C is the 3rd column
    outputRange.setValues(links);  // Write the links back to column C
    
    // Move to the next chunk
    startRow += chunkSize;
    
    // Optional: Delay to prevent timeout
    Utilities.sleep(2000);  // Wait for 2 seconds before processing the next chunk
  }
  
  Logger.log("Finished extracting and replacing links in column C");
}