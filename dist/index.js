"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
require('@babel/polyfill');
require('core-js/features/promise');
var _require = require("./ImageGeneration"),
  convertPDFToImages = _require.convertPDFToImages,
  deleteCorrespondingImages = _require.deleteCorrespondingImages,
  convertPDFToImagesUsingWindows = _require.convertPDFToImagesUsingWindows,
  getImagesPaths = _require.getImagesPaths;
var _require2 = require("./OCR"),
  performOCR = _require2.performOCR;
var _require3 = require("./TextParser"),
  processToJSON = _require3.processToJSON;
var path = require('path');
var fs = require('fs');
var _require4 = require("./ExcelSheetGenerator"),
  exportExcelForBills = _require4.exportExcelForBills;
var _require5 = require("./BillCollections"),
  getBillCollections = _require5.getBillCollections,
  hasExcelSheetFilter = _require5.hasExcelSheetFilter;
var processPDF = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(billCollection) {
    var Bills;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log("\n++++++++++++ Processing Directory ++++++++++++\n");
          console.log("Directory: ".concat(billCollection.directory));
          console.log("getImagesPaths => ");
          console.log(getImagesPaths(billCollection.directory));
          Bills = []; // Use map to create an array of promises
          // const processingPromises = billCollection.pdfPaths.map(async pdfPath => {
          //   try {
          //     console.log(`Processing Bill at Path: ${pdfPath}`);
          //     const imagePaths = await convertPDFToImages(pdfPath);
          //     let data = {};
          //     // Perform OCR on each image
          //     for (const imagePath of imagePaths) {
          //       try {
          //         console.log(`Start OCR on ${imagePath}`);
          //         data = await performOCR(imagePath);
          //       } catch (e) {
          //         console.log("Error in running OCR ")
          //         console.log(e)
          //       }
          //     }
          //     const JSONData = processToJSON(data);
          //     console.log(`Successfully Parsed Bill for ${JSONData.clientName} with ${JSONData.orderItems.length} item(s)`)
          //     Bills.push(JSONData);
          //     deleteCorrespondingImages(pdfPath);
          //   } catch (error) {
          //     console.error(`Error processing PDF: ${pdfPath}`, error.message);
          //   }
          // });
          // // Wait for all promises to resolve
          // console.log(processingPromises);
          // const p = await Promise.all(processingPromises);
          // console.log(p);
          // // Once all PDFs are processed, export the Excel file
          // exportExcelForBills(Bills, billCollection.directory, billCollection.billStartNumber, billCollection.year)
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function processPDF(_x) {
    return _ref.apply(this, arguments);
  };
}();
var delay = function delay(ms) {
  return new Promise(function (res) {
    return setTimeout(res, ms);
  });
};
var main = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var BillCollections, BillCollectionsWithoutExcelFile;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          BillCollections = getBillCollections();
          BillCollectionsWithoutExcelFile = BillCollections.filter(hasExcelSheetFilter);
          console.log("++++++++++++ Busy Exporter ++++++++++++");
          console.log("Number of Collections in Bills Directory: ".concat(BillCollections.length));
          console.log("Number of Collections Without Excel Files: ".concat(BillCollectionsWithoutExcelFile.length));
          console.log("----------------------------------------\n\n");
          BillCollectionsWithoutExcelFile.forEach(processPDF);
          _context2.next = 9;
          return delay(5000);
        case 9:
          console.log("Waited 5s");
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function main() {
    return _ref2.apply(this, arguments);
  };
}();
main()["catch"](function (e) {
  return console.error(e);
});