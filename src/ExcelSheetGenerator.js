// polyfills required by exceljs
require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
const ExcelJS = require('exceljs/dist/es5');
const path = require('path');
const excelSheetName = "output.xlsx"

const DealerToNewNameMap = require("../config/dealer.json");
const UnitToNewUnitMap = require("../config/unit.json");
const ItemToNewItemMap = require("../config/item.json");

let excelOutputPath = (saveDirectory) => path.join(saveDirectory, excelSheetName);


let workbook = null;
let worksheet = null;
let companyName = "National Stores"
let companyAddress = "O-35/A-2 Dilshad Garden, Delhi"
let sheetTitle = "List of Sales Vouchers"
let sheetVoucherSeries = "Voucher Series : Main"
let dateToPrint = ""
// Column Headers
let columnTitleA5 = "Date"
let columnTitleB5 = "Vch/Bill No"
let columnTitleC5 = "Particulars"
let columnTitleD5 = "Item Details"
let columnTitleE5 = "Qty."
let columnTitleF5 = "Unit"
let columnTitleG5 = "Price"
let columnTitleH5 = "Amount"

const setCompanyName = (name) => {
  companyName = name;
}

const setCompanyAddress = (address) => {
  companyAddress = address;
}

const setSheetTitle = (title) => {
  sheetTitle = title;
}

const createWorkbook = () => {
  workbook = new ExcelJS.Workbook();
  workbook.creator = 'National Store Busy Exporter';
  workbook.lastModifiedBy = 'Gulshan Kakkar';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.properties.date1904 = true;
  workbook.calcProperties.fullCalcOnLoad = true;
}

const saveWorkbook = (saveDirectory) => {
  workbook.xlsx.writeFile(excelOutputPath(saveDirectory))
      .then(() => {
        console.log('Excel file saved successfully in :', excelOutputPath(saveDirectory));
      })
      .catch((error) => {
        console.error('Error saving Excel file:', error);
      });
}

const createWorksheetWithHeaders = () => {
  worksheet = workbook.addWorksheet('Sheet1');
  worksheet.addRow([companyName])
  worksheet.mergeCells('A1:H1');

  worksheet.addRow([companyAddress])
  worksheet.mergeCells('A2:H2');

  worksheet.addRow([sheetTitle])
  worksheet.mergeCells('A3:H3');

  worksheet.addRow([sheetVoucherSeries, dateToPrint])
  worksheet.mergeCells('A4:D4');
  worksheet.mergeCells('E4:H4');

  worksheet.addRow([columnTitleA5, columnTitleB5, columnTitleC5, columnTitleD5, columnTitleE5, columnTitleF5, columnTitleG5, columnTitleH5]);
}

function formatDate(inputDate) {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

}

const addBillEntry = (jsonData, billNumber, year) => {
const date = formatDate(jsonData.date);
const voucherNumber = `${billNumber}/${year}`;
const updatedDealerName = DealerToNewNameMap[jsonData.clientName] || jsonData.clientName;

const [firstItem, ...otherItems] = jsonData.orderItems;
if(!firstItem) return;

const updatedFirstItemUnit = UnitToNewUnitMap[firstItem?.unit] || firstItem?.unit;
const updatedFirstItemName = ItemToNewItemMap[firstItem?.name] || firstItem?.name;

worksheet.addRow([date, voucherNumber, updatedDealerName, updatedFirstItemName, firstItem?.qty, updatedFirstItemUnit, 0 , 0]);

if(!otherItems || otherItems.length === 0) return;

otherItems.forEach(item => {
  const updatedUnit = UnitToNewUnitMap[item?.unit] || item?.unit;
  const updatedItemName = ItemToNewItemMap[item?.name] || item?.name;

  worksheet.addRow(["", "", "", updatedItemName, item?.qty, updatedUnit, 0,0]);
})
}

const exportExcelForBills = (Bills, saveDirectory, billStartNumber, year) => {
  createWorkbook()
  createWorksheetWithHeaders()
  let counter = 0;
  Bills.forEach(billJsonData => {
    addBillEntry(billJsonData, billStartNumber+counter, year);
    counter++;
  })

  saveWorkbook(saveDirectory);
}

module.exports = {
  setCompanyName,
  setCompanyAddress,
  setSheetTitle,
  exportExcelForBills,
  excelSheetName
}
