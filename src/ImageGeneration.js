const path = require("path");
const PDFImage = require('pdf-image').PDFImage;
const pdf2img = require('pdf-img-convert');
const fs = require('fs');

const getOutputPath = pdfPath => path.join(path.dirname(pdfPath), "images");

const convertPDFToImagesUsingWindows = async (pdfPath) => {
  console.log(`Converting ==> ${pdfPath}`)
  const images = await pdf2img.convert(pdfPath);

  const base = getOutputPath(pdfPath);
  const outputPaths = [];
  for (let i = 0; i < images.length; i++){
    const imgPath =  path.join(path.dirname(base), "output"+i+".png")
    console.log(`Saving Image at ===> ${imgPath}`);
    outputPaths.push(imgPath)
    fs.writeFile(imgPath, images[i], function (error) {
      if (error) { console.error("Error: " + error); }
    }); //writeFile

    return outputPaths
  }
}
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
  deleteCorrespondingImages,
  convertPDFToImagesUsingWindows
}
