"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var path = require("path");
var PDFImage = require('pdf-image').PDFImage;
var fs = require('fs');
var getOutputPath = function getOutputPath(pdfPath) {
  return path.dirname(pdfPath) + "/images";
};
var convertPDFToImages = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pdfPath) {
    var OUTPUT_PATH, pdfImage, imagePaths;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          OUTPUT_PATH = getOutputPath(pdfPath);
          if (!fs.existsSync(OUTPUT_PATH)) {
            fs.mkdirSync(OUTPUT_PATH, {
              recursive: true
            });
          }
          pdfImage = new PDFImage(pdfPath, {
            convertOptions: {
              '-quality': '100',
              // Image quality (adjust as needed)
              '-density': '300',
              // Image density (adjust as needed)
              '-trim': '' // Trim white spaces
            },

            outputDirectory: OUTPUT_PATH
          });
          _context.next = 6;
          return pdfImage.convertFile();
        case 6:
          imagePaths = _context.sent;
          return _context.abrupt("return", imagePaths);
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Error converting PDF to images:', _context.t0.message);
          throw _context.t0;
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 10]]);
  }));
  return function convertPDFToImages(_x) {
    return _ref.apply(this, arguments);
  };
}();
var deleteCorrespondingImages = function deleteCorrespondingImages(pdfPath) {
  var OUTPUT_PATH = getOutputPath(pdfPath);
  fs.rmSync(OUTPUT_PATH, {
    recursive: true,
    force: true
  });
};
module.exports = {
  convertPDFToImages: convertPDFToImages,
  deleteCorrespondingImages: deleteCorrespondingImages
};