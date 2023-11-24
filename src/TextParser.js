const camelize = function camelize(str) {
  return str.replace(/\W+(.)/g, function(match, chr)
  {
    return chr.toUpperCase();
  });
}

const filterLinesNotNeeded = l => {
  const exclusions = ["Order Details", "S.No | ITEM NAME | QTY", "Have a Nice Day", ''];

  return !exclusions.includes(l) || l.includes(":");
}

function extractOrderDetail(itemString) {
  const regex = /^(\d+)\) (.+?)\s+\|\s+(\d+)([^|]+)/;
  const match = itemString.match(regex);

  if (!match) {
    console.log("Unable to process order detail: " + itemString);
    return {
      index: "-1",
      name: "****Name Error****",
      qty: "#QTY Error",
      unit: "^Unit Error^",
    };
  }

  const [, index, name, qty, unitPart] = match;

  // Extract unit from unitPart by taking everything before the first comma and trimming
  const unit = unitPart.split(',')[0].trim();

  return {
    index: parseInt(index, 10),
    name: name.trim(),
    qty: parseInt(qty, 10),
    unit: unit,
  };
}

const processToJSON = (ocrResult) => {
  const lines = ocrResult.split('\n').filter(filterLinesNotNeeded);
  const processedJSON = {};
  processedJSON["orderItems"] = [];

  lines.forEach((line) => {
    const colonSplit = line.split(':')
    const numberOfColons = colonSplit.length;

    if (numberOfColons === 2 && !line.includes("|")) {
      const capitalKey = camelize(colonSplit[0]).trim();
      const key = capitalKey[0].toLowerCase() + capitalKey.slice(1)
      processedJSON[key] = colonSplit[1].trim();
    }

    if(line.includes("Date")){
      const colonSplit = line.split(':')
      const key = "date";
      processedJSON[key] = colonSplit[1] + ":" + colonSplit[2] + ":" + colonSplit[3]
    }

    if (line.includes("|")) {
      const orderDetail = extractOrderDetail(line);
      processedJSON["orderItems"].push(orderDetail)
    }
  })
  return processedJSON;
}

module.exports = {
  processToJSON
}
