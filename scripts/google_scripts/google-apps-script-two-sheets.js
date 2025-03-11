function reorganizeSheetData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sourceSheet1 = ss.getSheetByName("spreadsheet 1");
    const sourceSheet2 = ss.getSheetByName("spreadsheet 2");

    if (!sourceSheet1 || !sourceSheet2) {
      throw new Error(
        "One or both source sheets not found. Please check sheet names."
      );
    }

    let newSheetName = "Combined Data";
    let newSheet = ss.getSheetByName(newSheetName);
    if (newSheet) {
      ss.deleteSheet(newSheet);
    }
    newSheet = ss.insertSheet(newSheetName);

    // Set up headers
    newSheet
      .getRange(1, 1, 1, 4)
      .setValues([["Source", "Name", "Price", "Link"]]);
    newSheet.getRange(1, 1, 1, 4).setFontWeight("bold");

    // Get data from both sheets
    const sourceData1 = sourceSheet1
      .getRange(1, 1, sourceSheet1.getLastRow(), 10)
      .getValues();
    const sourceData2 = sourceSheet2
      .getRange(1, 1, sourceSheet2.getLastRow(), 10)
      .getValues();

    let allData = [];

    // Process data from sheet 1
    for (let i = 0; i < sourceData1.length; i++) {
      const row = sourceData1[i];
      const name = row[0]; // Column A
      const price = row[3]; // Column D
      const link = row[9]; // Column J
      if (name && price) {
        allData.push(["Sheet1", name, price, link]);
      }
    }

    // Process data from sheet 2
    for (let i = 0; i < sourceData2.length; i++) {
      const row = sourceData2[i];
      const name = row[0]; // Column A
      const price = row[3]; // Column D
      const link = row[9]; // Column J
      if (name && price) {
        allData.push(["Sheet2", name, price, link]);
      }
    }

    // Write all data in one go
    if (allData.length > 0) {
      newSheet.getRange(2, 1, allData.length, 4).setValues(allData);
    }

    // Format the price column as currency
    newSheet.getRange(2, 3, allData.length, 1).setNumberFormat("$#,##0.00");

    // Add hyperlinks if necessary
    for (let i = 0; i < allData.length; i++) {
      const link = allData[i][3];
      if (link) {
        newSheet.getRange(i + 2, 4).setFormula(`=HYPERLINK("${link}", "Link")`);
      }
    }

    // Auto-resize columns and add styling
    newSheet.autoResizeColumns(1, 4);
    newSheet.getRange(1, 1, 1, 4).setBackground("#f3f3f3");
    newSheet
      .getRange(1, 1, allData.length + 1, 4)
      .setBorder(true, true, true, true, true, true);

    // Activate the new sheet
    newSheet.activate();

    return "Data from both sheets reorganized successfully!";
  } catch (error) {
    return "Error: " + error.message;
  }
}
