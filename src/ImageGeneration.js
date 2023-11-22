const path = require("path");
const fs = require('fs');

function getImagesPaths(subdirectoryPath) {
  const imagesPath = path.join(subdirectoryPath, 'images');
  const imagePaths = [];

  // Check if the 'images' directory exists
  if (!fs.existsSync(imagesPath)) {
    console.error(`Images directory does not exist in ${subdirectoryPath}`);
    return imagePaths;
  }

  // Get a list of image files in the 'images' directory
  const imageFiles = fs.readdirSync(imagesPath)
      .filter(file => fs.statSync(path.join(imagesPath, file)).isFile());

  // Group image paths based on the part of the file name before the last hyphen
  const groupedPaths = imageFiles.reduce((acc, file) => {
    const fileName = path.parse(file).name;
    const lastHyphenIndex = fileName.lastIndexOf('-');
    const prefix = lastHyphenIndex !== -1 ? fileName.slice(0, lastHyphenIndex) : fileName;
    const filePath = path.join(imagesPath, file);

    if (!acc[prefix]) {
      acc[prefix] = [];
    }

    acc[prefix].push(filePath);
    return acc;
  }, {});

  // Convert the grouped paths object to an array of arrays
  for (const prefix in groupedPaths) {
    if (Object.hasOwnProperty.call(groupedPaths, prefix)) {
      imagePaths.push(groupedPaths[prefix]);
    }
  }

  return imagePaths;
}

module.exports = {
  getImagesPaths
}
