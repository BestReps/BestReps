function extractLinksFromColumnB() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow(); // Get the last row with data in the sheet
  var chunkSize = 50;  // Process 50 rows at a time (You can try smaller batches if necessary)
  var startRow = 1;  // Start at the first row
  
  var allLinks = [];
  
  while (startRow <= lastRow) {
    // Define the range of rows to process
    var range = sheet.getRange(startRow, 2, Math.min(chunkSize, lastRow - startRow + 1), 1); // Column B
    var values = range.getValues();  // Get values from column B
    var links = [];
    
    // Extract the links from the range
    for (var i = 0; i < values.length; i++) {
      var cellValue = values[i][0];  // Cell value in column B
      var richTextValue = sheet.getRange(startRow + i, 2).getRichTextValue();  // Get rich text value of the cell
      var link = richTextValue.getLinkUrl();  // Extract the URL from the cell's rich text value
      links.push([link ? link : ""]);  // If there's no link, add an empty string
    }
    
    // Write the extracted links into column J
    var outputRange = sheet.getRange(startRow, 10, links.length, 1);  // Column J is the 10th column
    outputRange.setValues(links);  // Write the links to column J
    
    // Move to the next chunk
    startRow += chunkSize;
    
    // Optional: Delay to prevent timeout
    Utilities.sleep(2000);  // Wait for 2 seconds before processing the next chunk (adjust as needed)
  }
}
