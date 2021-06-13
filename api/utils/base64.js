const fs = require("fs");

exports.encodeBase64 = function (file) {
  return fs.readFileSync(file, { encoding: "base64" });
};
