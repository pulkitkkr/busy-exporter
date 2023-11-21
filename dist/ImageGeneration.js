"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var path = require("path");
var PDFImage = require('pdf-image').PDFImage;
var pdf2img = require('pdf-img-convert');
var fs = require('fs');
var getOutputPath = function getOutputPath(pdfPath) {
  return path.join(path.dirname(pdfPath), "images");
};
var convertPDFToImagesUsingWindows = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pdfPath) {
    var images, base, outputPaths, i, imgPath;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log("Converting ==> ".concat(pdfPath));
          _context.next = 3;
          return pdf2img.convert(pdfPath);
        case 3:
          images = _context.sent;
          base = getOutputPath(pdfPath);
          outputPaths = [];
          i = 0;
        case 7:
          if (!(i < images.length)) {
            _context.next = 16;
            break;
          }
          imgPath = path.join(path.dirname(base), "output" + i + ".png");
          console.log("Saving Image at ===> ".concat(imgPath));
          outputPaths.push(imgPath);
          fs.writeFile(imgPath, images[i], function (error) {
            if (error) {
              console.error("Error: " + error);
            }
          }); //writeFile
          return _context.abrupt("return", outputPaths);
        case 13:
          i++;
          _context.next = 7;
          break;
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function convertPDFToImagesUsingWindows(_x) {
    return _ref.apply(this, arguments);
  };
}();
var convertPDFToImages = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(pdfPath) {
    var OUTPUT_PATH, pdfImage;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
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
          _context2.next = 6;
          return pdfImage.convertFile();
        case 6:
          return _context2.abrupt("return", _context2.sent);
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Error converting PDF to images:', _context2.t0.message);
          throw _context2.t0;
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return function convertPDFToImages(_x2) {
    return _ref2.apply(this, arguments);
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
  deleteCorrespondingImages: deleteCorrespondingImages,
  convertPDFToImagesUsingWindows: convertPDFToImagesUsingWindows
};