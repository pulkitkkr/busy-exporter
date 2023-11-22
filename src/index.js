require('@babel/polyfill');
require('core-js/features/promise');

const {convertPDFToImages, deleteCorrespondingImages, convertPDFToImagesUsingWindows, getImagesPaths} = require("./ImageGeneration");
const {performOCR} = require("./OCR");
const {processToJSON} = require("./TextParser");
const path = require('path');
const fs = require('fs');
const {exportExcelForBills} = require("./ExcelSheetGenerator");
const {getBillCollections, hasExcelSheetFilter} = require("./BillCollections");

const processPDF = async (billCollection) => {
  console.log(`\n++++++++++++ Processing Directory ++++++++++++\n`);
  console.log(`Directory: ${billCollection.directory}`);
  const BillImages = getImagesPaths(billCollection.directory);

  const Bills = [];
  const processingPromises = BillImages.map(async individualBillImages => {
    let data = {};
    for (const imagePath of individualBillImages) {
      try {
        data = await performOCR(imagePath);
        const JSONData = processToJSON(data);
        console.log(`Successfully Parsed Bill for ${JSONData.clientName} with ${JSONData.orderItems.length} item(s)`)
        Bills.push(JSONData);
      } catch (e) {
        console.log("Error in running OCR ")
        console.log(e)
      }
    }
  });
  // Wait for all promises to resolve
  const p = await Promise.all(processingPromises);
  // Once all PDFs are processed, export the Excel file
  exportExcelForBills(Bills, billCollection.directory, billCollection.billStartNumber, billCollection.year)
};

const main = async () => {
  const BillCollections = getBillCollections();
  const BillCollectionsWithoutExcelFile =  BillCollections.filter(hasExcelSheetFilter);
  console.log(`++++++++++++ Busy Exporter ++++++++++++`);
  console.log(`Number of Collections in Bills Directory: ${BillCollections.length}`);
  console.log(`Number of Collections Without Excel Files: ${BillCollectionsWithoutExcelFile.length}`);
  console.log(`----------------------------------------\n\n`)
  BillCollectionsWithoutExcelFile.forEach(processPDF)
}

main().catch(e => console.error(e));
