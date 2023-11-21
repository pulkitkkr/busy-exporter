"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Tesseract = require('tesseract.js');
var performOCR = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(imagePath) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return Tesseract.recognize(imagePath, 'eng',
          // Language code for English
          {} // Optional logger
          );
        case 3:
          result = _context.sent;
          console.log("Tesseract ran on " + imagePath);
          return _context.abrupt("return", result.data.text);
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error('Error performing OCR:', _context.t0.message);
          throw _context.t0;
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function performOCR(_x) {
    return _ref.apply(this, arguments);
  };
}();
module.exports = {
  performOCR: performOCR
};