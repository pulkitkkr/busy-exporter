"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// polyfills required by exceljs
require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
var ExcelJS = require('exceljs/dist/es5');
var path = require('path');
var excelSheetName = "output.xlsx";
var DealerToNewNameMap = require("../config/dealer.json");
var UnitToNewUnitMap = require("../config/unit.json");
var ItemToNewItemMap = require("../config/item.json");
var excelOutputPath = function excelOutputPath(saveDirectory) {
  return path.join(saveDirectory, excelSheetName);
};
var workbook = null;
var worksheet = null;
var companyName = "National Stores";
var companyAddress = "O-35/A-2 Dilshad Garden, Delhi";
var sheetTitle = "List of Sales Vouchers";
var sheetVoucherSeries = "Voucher Series : Main";
var dateToPrint = "";
// Column Headers
var columnTitleA5 = "Date";
var columnTitleB5 = "Vch/Bill No";
var columnTitleC5 = "Particulars";
var columnTitleD5 = "Item Details";
var columnTitleE5 = "Qty.";
var columnTitleF5 = "Unit";
var columnTitleG5 = "Price";
var columnTitleH5 = "Amount";
var setCompanyName = function setCompanyName(name) {
  companyName = name;
};
var setCompanyAddress = function setCompanyAddress(address) {
  companyAddress = address;
};
var setSheetTitle = function setSheetTitle(title) {
  sheetTitle = title;
};
var createWorkbook = function createWorkbook() {
  workbook = new ExcelJS.Workbook();
  workbook.creator = 'National Store Busy Exporter';
  workbook.lastModifiedBy = 'Gulshan Kakkar';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.properties.date1904 = true;
  workbook.calcProperties.fullCalcOnLoad = true;
};
var saveWorkbook = function saveWorkbook(saveDirectory) {
  workbook.xlsx.writeFile(excelOutputPath(saveDirectory)).then(function () {
    console.log('Excel file saved successfully in :', excelOutputPath(saveDirectory));
  })["catch"](function (error) {
    console.error('Error saving Excel file:', error);
  });
};
var createWorksheetWithHeaders = function createWorksheetWithHeaders() {
  worksheet = workbook.addWorksheet('Sheet1');
  worksheet.addRow([companyName]);
  worksheet.mergeCells('A1:H1');
  worksheet.addRow([companyAddress]);
  worksheet.mergeCells('A2:H2');
  worksheet.addRow([sheetTitle]);
  worksheet.mergeCells('A3:H3');
  worksheet.addRow([sheetVoucherSeries, dateToPrint]);
  worksheet.mergeCells('A4:D4');
  worksheet.mergeCells('E4:H4');
  worksheet.addRow([columnTitleA5, columnTitleB5, columnTitleC5, columnTitleD5, columnTitleE5, columnTitleF5, columnTitleG5, columnTitleH5]);
};
function formatDate(inputDate) {
  var date = new Date(inputDate);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
var addBillEntry = function addBillEntry(jsonData, billNumber, year) {
  var date = formatDate(jsonData.date);
  var voucherNumber = "".concat(billNumber, "/").concat(year);
  var updatedDealerName = DealerToNewNameMap[jsonData.clientName] || jsonData.clientName;
  var _jsonData$orderItems = _toArray(jsonData.orderItems),
    firstItem = _jsonData$orderItems[0],
    otherItems = _jsonData$orderItems.slice(1);
  var updatedFirstItemUnit = UnitToNewUnitMap[firstItem.unit] || firstItem.unit;
  var updatedFirstItemName = ItemToNewItemMap[firstItem.name] || firstItem.name;
  worksheet.addRow([date, voucherNumber, updatedDealerName, updatedFirstItemName, firstItem.qty, updatedFirstItemUnit, 0, 0]);
  otherItems.forEach(function (item) {
    var updatedUnit = UnitToNewUnitMap[item.unit] || item.unit;
    var updatedItemName = ItemToNewItemMap[item.name] || item.name;
    worksheet.addRow(["", "", "", updatedItemName, item.qty, updatedUnit, 0, 0]);
  });
};
var exportExcelForBills = function exportExcelForBills(Bills, saveDirectory, billStartNumber, year) {
  createWorkbook();
  createWorksheetWithHeaders();
  var counter = 0;
  Bills.forEach(function (billJsonData) {
    addBillEntry(billJsonData, billStartNumber + counter, year);
    counter++;
  });
  saveWorkbook(saveDirectory);
};
module.exports = {
  setCompanyName: setCompanyName,
  setCompanyAddress: setCompanyAddress,
  setSheetTitle: setSheetTitle,
  exportExcelForBills: exportExcelForBills,
  excelSheetName: excelSheetName
};