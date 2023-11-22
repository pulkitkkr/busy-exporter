const Tesseract = require('tesseract.js');

const performOCR = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(
        imagePath,
        'eng', // Language code for English
        { } // Optional logger
    );
    return result.data.text;
  } catch (error) {
    console.error('Error performing OCR:', error.message);
    throw error;
  }
};

module.exports = {
  performOCR
}
