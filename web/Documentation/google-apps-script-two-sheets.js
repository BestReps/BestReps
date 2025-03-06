/**
 * Reorganizes data from two source spreadsheets into a new sheet
 * Extracts name (column A), price (column D), link (column J)
 * Creates image placeholders instead of copying images directly
 */
function reorganizeSheetData() {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get both source sheets
    const sourceSheet1 = ss.getSheetByName("spreadsheet 1"); // Replace with your first sheet name
    const sourceSheet2 = ss.getSheetByName("spreadsheet 2"); // Replace with your second sheet name
    
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
    newSheet.getRange(1, 1, 1, 5).setValues([["Source", "Name", "Price", "Link", "Image Reference"]]);
    newSheet.getRange(1, 1, 1, 5).setFontWeight("bold");
    
    // Get all data at once (no images)
    const data1 = sourceSheet1.getRange(1, 1, sourceSheet1.getLastRow(), 10).getValues();
    const data2 = sourceSheet2.getRange(1, 1, sourceSheet2.getLastRow(), 10).getValues();
    
    // Prepare data for batch writing
    let combinedData = [];
    
    // Process Sheet1 data
    for (let i = 0; i < data1.length; i++) {
      const row = data1[i];
      const name = row[0];   // Column A
      const price = row[3];  // Column D
      const link = row[9];   // Column J
      
      // Skip rows with empty name AND price
      if (!name && !price) continue;
      
      // Create a reference to the original image
      const imageReference = `See original in Sheet1 row ${i+1}`;
      
      // Add to our combined data array
      combinedData.push(["Sheet1", name, price, link, imageReference]);
    }
    
    // Process Sheet2 data
    for (let i = 0; i < data2.length; i++) {
      const row = data2[i];
      const name = row[0];   // Column A
      const price = row[3];  // Column D
      const link = row[9];   // Column J
      
      // Skip rows with empty name AND price
      if (!name && !price) continue;
      
      // Create a reference to the original image
      const imageReference = `See original in Sheet2 row ${i+1}`;
      
      // Add to our combined data array
      combinedData.push(["Sheet2", name, price, link, imageReference]);
    }
    
    // Write all data at once
    if (combinedData.length > 0) {
      newSheet.getRange(2, 1, combinedData.length, 5).setValues(combinedData);
    }
    
    // Now go back and set the hyperlinks for all rows
    for (let i = 0; i < combinedData.length; i++) {
      const rowIndex = i + 2; // +2 because we start at row 2 (after header)
      const link = combinedData[i][3];
      
      if (link && link.toString().trim() !== "") {
        try {
          newSheet.getRange(rowIndex, 4).setFormula(`=HYPERLINK("${link}", "Link")`);
        } catch (e) {
          Logger.log(`Error setting hyperlink in row ${rowIndex}: ${e.message}`);
        }
      }
    }
    
    // Format the price column as currency
    if (combinedData.length > 0) {
      newSheet.getRange(2, 3, combinedData.length, 1).setNumberFormat("$#,##0.00");
    }
    
    // Auto-resize columns for better readability
    newSheet.autoResizeColumns(1, 5);
    
    // Add some basic styling
    newSheet.getRange(1, 1, 1, 5).setBackground("#f3f3f3");
    if (combinedData.length > 0) {
      newSheet.getRange(1, 1, combinedData.length + 1, 5).setBorder(true, true, true, true, true, true);
    }
    
    // Activate the new sheet
    newSheet.activate();
    
    // Add an instruction note at the top
    if (combinedData.length > 0) {
      newSheet.insertRowBefore(1);
      newSheet.getRange(1, 1, 1, 5).merge();
      newSheet.getRange(1, 1).setValue("NOTE: Images could not be copied directly. The 'Image Reference' column shows where to find the original image.");
      newSheet.getRange(1, 1).setFontWeight("bold");
      newSheet.getRange(1, 1).setBackground("#FFF2CC");
    }
    
    // Add summary information
    return `Data combined successfully! Processed ${combinedData.length} total rows. Images are referenced but not copied due to API limitations.`;
  } catch (error) {
    return "Error: " + error.message + "\n\nStack trace: " + error.stack;
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