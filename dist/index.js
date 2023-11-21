"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
require('@babel/polyfill');
require('core-js/features/promise');
var _require = require("./ImageGeneration"),
  convertPDFToImages = _require.convertPDFToImages,
  deleteCorrespondingImages = _require.deleteCorrespondingImages;
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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(billCollection) {
    var Bills, processingPromises, p;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log("\n++++++++++++ Processing Directory ++++++++++++\n");
          console.log("Directory: ".concat(billCollection.directory));
          Bills = []; // Use map to create an array of promises
          processingPromises = billCollection.pdfPaths.map( /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pdfPath) {
              var imagePaths, data, _iterator, _step, imagePath, JSONData;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    console.log("Processing Bill at Path: ".concat(pdfPath));
                    _context.next = 4;
                    return convertPDFToImages(pdfPath);
                  case 4:
                    imagePaths = _context.sent;
                    data = {}; // Perform OCR on each image
                    _iterator = _createForOfIteratorHelper(imagePaths);
                    _context.prev = 7;
                    _iterator.s();
                  case 9:
                    if ((_step = _iterator.n()).done) {
                      _context.next = 24;
                      break;
                    }
                    imagePath = _step.value;
                    _context.prev = 11;
                    console.log("Start OCR on ".concat(imagePath));
                    _context.next = 15;
                    return performOCR(imagePath);
                  case 15:
                    data = _context.sent;
                    _context.next = 22;
                    break;
                  case 18:
                    _context.prev = 18;
                    _context.t0 = _context["catch"](11);
                    console.log("Error in running OCR ");
                    console.log(_context.t0);
                  case 22:
                    _context.next = 9;
                    break;
                  case 24:
                    _context.next = 29;
                    break;
                  case 26:
                    _context.prev = 26;
                    _context.t1 = _context["catch"](7);
                    _iterator.e(_context.t1);
                  case 29:
                    _context.prev = 29;
                    _iterator.f();
                    return _context.finish(29);
                  case 32:
                    JSONData = processToJSON(data);
                    console.log("Successfully Parsed Bill for ".concat(JSONData.clientName, " with ").concat(JSONData.orderItems.length, " item(s)"));
                    Bills.push(JSONData);
                    deleteCorrespondingImages(pdfPath);
                    _context.next = 41;
                    break;
                  case 38:
                    _context.prev = 38;
                    _context.t2 = _context["catch"](0);
                    console.error("Error processing PDF: ".concat(pdfPath), _context.t2.message);
                  case 41:
                  case "end":
                    return _context.stop();
                }
              }, _callee, null, [[0, 38], [7, 26, 29, 32], [11, 18]]);
            }));
            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }()); // Wait for all promises to resolve
          console.log(processingPromises);
          _context2.next = 7;
          return Promise.all(processingPromises);
        case 7:
          p = _context2.sent;
          console.log(p);
          // Once all PDFs are processed, export the Excel file
          exportExcelForBills(Bills, billCollection.directory, billCollection.billStartNumber, billCollection.year);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function processPDF(_x) {
    return _ref.apply(this, arguments);
  };
}();
var main = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var BillCollections, BillCollectionsWithoutExcelFile;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          BillCollections = getBillCollections();
          BillCollectionsWithoutExcelFile = BillCollections.filter(hasExcelSheetFilter);
          console.log("++++++++++++ Busy Exporter ++++++++++++");
          console.log("Number of Collections in Bills Directory: ".concat(BillCollections.length));
          console.log("Number of Collections Without Excel Files: ".concat(BillCollectionsWithoutExcelFile.length));
          console.log("----------------------------------------\n\n");
          BillCollectionsWithoutExcelFile.forEach(processPDF);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function main() {
    return _ref3.apply(this, arguments);
  };
}();
main()["catch"](function (e) {
  return console.error(e);
});