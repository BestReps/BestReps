/**
 * Reorganizes data from two source spreadsheets into a new sheet
 * Extracts name (column A), price (column D), and link (column J)
 */
function reorganizeSheetData() {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get both source sheets
    const sourceSheet1 = ss.getSheetByName("Sheet1"); // Replace with your first sheet name
    const sourceSheet2 = ss.getSheetByName("Sheet2"); // Replace with your second sheet name
    
    if (!sourceSheet1 || !sourceSheet2) {
      throw new Error("One or both source sheets not found. Please check sheet names.");
    }
    
    // Create new sheet for the reorganized data
    let newSheetName = "Combined Data";
    let newSheet = ss.getSheetByName(newSheetName);
    
    // If sheet already exists, delete it and create a new one
    if (newSheet) {
      ss.deleteSheet(newSheet);
    }
    newSheet = ss.insertSheet(newSheetName);
    
    // Set up headers in the new sheet
    newSheet.getRange(1, 1, 1, 4).setValues([["Source", "Name", "Price", "Link"]]);
    newSheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    
    // Process data from first sheet
    const lastRow1 = sourceSheet1.getLastRow();
    const sourceData1 = sourceSheet1.getRange(1, 1, lastRow1, 10).getValues(); // Columns A-J
    
    // Process data from second sheet
    const lastRow2 = sourceSheet2.getLastRow();
    const sourceData2 = sourceSheet2.getRange(1, 1, lastRow2, 10).getValues(); // Columns A-J
    
    // Write data to the new sheet
    let newSheetRow = 2; // Start after header
    
    // Process Sheet1 data
    for (let i = 0; i < sourceData1.length; i++) {
      const row = sourceData1[i];
      const name = row[0];  // Column A
      const price = row[3]; // Column D
      const link = row[9];  // Column J
      
      // Skip rows with empty name and price
      if (!name && !price) continue;
      
      // Write data to new sheet
      newSheet.getRange(newSheetRow, 1, 1, 4).setValues([["Sheet1", name, price, link]]);
      
      // If cell contains a link, make it clickable
      if (link && link.trim() !== "") {
        newSheet.getRange(newSheetRow, 4).setFormula(`=HYPERLINK("${link}", "Link")`);
      }
      
      newSheetRow++;
    }
    
    // Process Sheet2 data
    for (let i = 0; i < sourceData2.length; i++) {
      const row = sourceData2[i];
      const name = row[0];  // Column A
      const price = row[3]; // Column D
      const link = row[9];  // Column J
      
      // Skip rows with empty name and price
      if (!name && !price) continue;
      
      // Write data to new sheet
      newSheet.getRange(newSheetRow, 1, 1, 4).setValues([["Sheet2", name, price, link]]);
      
      // If cell contains a link, make it clickable
      if (link && link.trim() !== "") {
        newSheet.getRange(newSheetRow, 4).setFormula(`=HYPERLINK("${link}", "Link")`);
      }
      
      newSheetRow++;
    }
    
    // Format the price column as currency
    newSheet.getRange(2, 3, newSheetRow - 2, 1).setNumberFormat("$#,##0.00");
    
    // Auto-resize columns for better readability
    newSheet.autoResizeColumns(1, 4);
    
    // Add some basic styling
    newSheet.getRange(1, 1, 1, 4).setBackground("#f3f3f3");
    newSheet.getRange(1, 1, newSheetRow - 1, 4).setBorder(true, true, true, true, true, true);
    
    // Activate the new sheet
    newSheet.activate();
    
    return "Data from both sheets reorganized successfully!";
  } catch (error) {
    return "Error: " + error.message;
  }
}

/**
 * Adds a menu item to run the script
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Data Tools')
    .addItem('Combine Sheet Data', 'reorganizeSheetData')
    .addToUi();
}
