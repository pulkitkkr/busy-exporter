"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
      _billDir$split2 = _slicedToArray(_billDir$split, 2),
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