const path = require('path');
const fs = require('fs');
const {excelSheetName} = require("./ExcelSheetGenerator");

const BILLS_DIR = path.join(__dirname, "..", "bills");

function getBillCollections() {
  const billDirectories = fs.readdirSync(BILLS_DIR);

  // Process each bill directory
  return billDirectories.map(billDir => {
    const billDirPath = path.join(BILLS_DIR, billDir);
    const excelFilePath = path.join(billDirPath, excelSheetName);

    const pdfPaths = fs.readdirSync(billDirPath)
        .filter(file => file.endsWith('.pdf'))
        .map(pdfFile => path.join(billDirPath, pdfFile));

    const hasExcelSheet = fs.existsSync(excelFilePath);

    // Extract billStartNumber and year from the directory name
    const [billStartNumber, year] = billDir.split('_');

    return {
      directory: billDirPath,
      hasExcelSheet,
      pdfPaths,
      billStartNumber: parseInt(billStartNumber, 10),
      year,
    };
  });
}

const hasExcelSheetFilter = collection => !collection.hasExcelSheet;

module.exports = {
  getBillCollections,
  hasExcelSheetFilter
}
