"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var camelize = function camelize(str) {
  return str.replace(/\W+(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
};
var filterLinesNotNeeded = function filterLinesNotNeeded(l) {
  var exclusions = ["Order Details", "S.No | ITEM NAME | QTY", "Have a Nice Day", ''];
  return !exclusions.includes(l) || l.includes(":");
};
function extractOrderDetail(itemString) {
  var regex = /^(\d+)\) (.+?)\s+\|\s+(\d+)\s+(\w+)/;
  var match = itemString.match(regex);
  if (!match) {
    console.log("Unable to process order detail: " + itemString);
    return null; // Return null if the input doesn't match the expected pattern
  }

  var _match = (0, _slicedToArray2["default"])(match, 5),
    index = _match[1],
    name = _match[2],
    qty = _match[3],
    unit = _match[4];
  return {
    index: parseInt(index, 10),
    name: name.trim(),
    qty: parseInt(qty, 10),
    unit: unit.trim()
  };
}
var processToJSON = function processToJSON(ocrResult) {
  var lines = ocrResult.split('\n').filter(filterLinesNotNeeded);
  var processedJSON = {};
  processedJSON["orderItems"] = [];
  lines.forEach(function (line) {
    var colonSplit = line.split(':');
    var numberOfColons = colonSplit.length;
    if (numberOfColons === 2 && !line.includes("|")) {
      var capitalKey = camelize(colonSplit[0]).trim();
      var key = capitalKey[0].toLowerCase() + capitalKey.slice(1);
      processedJSON[key] = colonSplit[1].trim();
    }
    if (line.includes("Date")) {
      var _colonSplit = line.split(':');
      var _key = "date";
      processedJSON[_key] = _colonSplit[1] + ":" + _colonSplit[2] + ":" + _colonSplit[3];
    }
    if (line.includes("|")) {
      var orderDetail = extractOrderDetail(line);
      processedJSON["orderItems"].push(orderDetail);
    }
  });
  return processedJSON;
};
module.exports = {
  processToJSON: processToJSON
};