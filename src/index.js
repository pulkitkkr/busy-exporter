const {convertPDFToImages, deleteCorrespondingImages} = require("./ImageGeneration");
const {performOCR} = require("./OCR");
const {processToJSON} = require("./TextParser");
const path = require('path');
const fs = require('fs');
const {exportExcelForBills} = require("./ExcelSheetGenerator");
const {getBillCollections, hasExcelSheetFilter} = require("./BillCollections");

const processPDF = async (billCollection) => {
  console.log(`\n++++++++++++ Processing Directory ++++++++++++\n`);
  console.log(`Directory: ${billCollection.directory}`);

  const Bills = [];
  // Use map to create an array of promises
  const processingPromises = billCollection.pdfPaths.map(async pdfPath => {
    try {
      console.log(`Processing Bill at Path: ${pdfPath}`);
      const imagePaths = await convertPDFToImages(pdfPath);
      let data = {};
      // Perform OCR on each image
      for (const imagePath of imagePaths) {
        try {
          console.log("Start OCR on ${imagePath}");
          data = await performOCR(imagePath);
        } catch (e) {
          console.log("Error in running OCR ")
          console.log(e)
        }
      }
      const JSONData = processToJSON(data);
      console.log(`Successfully Parsed Bill for ${JSONData.clientName} with ${JSONData.orderItems.length} item(s)`)
      Bills.push(JSONData);
      deleteCorrespondingImages(pdfPath);
    } catch (error) {
      console.error(`Error processing PDF: ${pdfPath}`, error.message);
    }
  });
  // Wait for all promises to resolve
  console.log(processingPromises);
  await Promise.all(processingPromises);
  // Once all PDFs are processed, export the Excel file
  exportExcelForBills(Bills, billCollection.directory, billCollection.billStartNumber, billCollection.year)

};

const BillCollections = getBillCollections();
const BillCollectionsWithoutExcelFile =  BillCollections.filter(hasExcelSheetFilter);
console.log(`++++++++++++ Busy Exporter ++++++++++++`);
console.log(`Number of Collections in Bills Directory: ${BillCollections.length}`);
console.log(`Number of Collections Without Excel Files: ${BillCollectionsWithoutExcelFile.length}`);
console.log(`----------------------------------------\n\n`)
BillCollectionsWithoutExcelFile.forEach(processPDF)
