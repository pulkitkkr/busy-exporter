const path = require("path");
const PDFImage = require('pdf-image').PDFImage;
const fs = require('fs');

const getOutputPath = pdfPath => path.dirname(pdfPath)+"/images";

const convertPDFToImages = async (pdfPath) => {
  try {
    const OUTPUT_PATH = getOutputPath(pdfPath)

    if (!fs.existsSync(OUTPUT_PATH)){
      fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    }

    const pdfImage = new PDFImage(pdfPath, {
      convertOptions: {
        '-quality': '100', // Image quality (adjust as needed)
        '-density': '300', // Image density (adjust as needed)
        '-trim': '', // Trim white spaces
      },
      outputDirectory: OUTPUT_PATH,
    });

    return await pdfImage.convertFile();
  } catch (error) {
    console.error('Error converting PDF to images:', error.message);
    throw error;
  }
}

const deleteCorrespondingImages = pdfPath => {
  const OUTPUT_PATH = getOutputPath(pdfPath)
  fs.rmSync(OUTPUT_PATH, { recursive: true, force: true });
}

module.exports = {
  convertPDFToImages,
  deleteCorrespondingImages
}
