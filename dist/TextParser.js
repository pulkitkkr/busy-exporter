"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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

  var _match = _slicedToArray(match, 5),
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