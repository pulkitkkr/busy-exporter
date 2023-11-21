"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var path = require('path');
var fs = require('fs');
var _require = require("./ExcelSheetGenerator"),
  excelSheetName = _require.excelSheetName;
var BILLS_DIR = path.join(__dirname, "..", "bills");
function getBillCollections() {
  var billDirectories = fs.readdirSync(BILLS_DIR);

  // Process each bill directory
  return billDirectories.map(function (billDir) {
    var billDirPath = path.join(BILLS_DIR, billDir);
    var excelFilePath = path.join(billDirPath, excelSheetName);
    var pdfPaths = fs.readdirSync(billDirPath).filter(function (file) {
      return file.endsWith('.pdf');
    }).map(function (pdfFile) {
      return path.join(billDirPath, pdfFile);
    });
    var hasExcelSheet = fs.existsSync(excelFilePath);

    // Extract billStartNumber and year from the directory name
    var _billDir$split = billDir.split('_'),
      _billDir$split2 = (0, _slicedToArray2["default"])(_billDir$split, 2),
      billStartNumber = _billDir$split2[0],
      year = _billDir$split2[1];
    return {
      directory: billDirPath,
      hasExcelSheet: hasExcelSheet,
      pdfPaths: pdfPaths,
      billStartNumber: parseInt(billStartNumber, 10),
      year: year
    };
  });
}
var hasExcelSheetFilter = function hasExcelSheetFilter(collection) {
  return !collection.hasExcelSheet;
};
module.exports = {
  getBillCollections: getBillCollections,
  hasExcelSheetFilter: hasExcelSheetFilter
};