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
function getImagesPaths(subdirectoryPath) {
  var imagesPath = path.join(subdirectoryPath, 'images');
  var imagePaths = [];

  // Check if the 'images' directory exists
  if (!fs.existsSync(imagesPath)) {
    console.error("Images directory does not exist in ".concat(subdirectoryPath));
    return imagePaths;
  }

  // Get a list of image files in the 'images' directory
  var imageFiles = fs.readdirSync(imagesPath).filter(function (file) {
    return fs.statSync(path.join(imagesPath, file)).isFile();
  });

  // Group image paths based on the part of the file name before the last hyphen
  var groupedPaths = imageFiles.reduce(function (acc, file) {
    var fileName = path.parse(file).name;
    var lastHyphenIndex = fileName.lastIndexOf('-');
    var prefix = lastHyphenIndex !== -1 ? fileName.slice(0, lastHyphenIndex) : fileName;
    var filePath = path.join(imagesPath, file);
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(filePath);
    return acc;
  }, {});

  // Convert the grouped paths object to an array of arrays
  for (var prefix in groupedPaths) {
    if (Object.hasOwnProperty.call(groupedPaths, prefix)) {
      imagePaths.push(groupedPaths[prefix]);
    }
  }
  return imagePaths;
}
var convertPDFToImages = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pdfPath) {
    var OUTPUT_PATH, pdfImage;
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
          return _context.abrupt("return", _context.sent);
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Error converting PDF to images:', _context.t0.message);
          throw _context.t0;
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
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
  deleteCorrespondingImages: deleteCorrespondingImages,
  getImagesPaths: getImagesPaths
};