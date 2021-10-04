const fs = require("fs");

const deleteFile = (filePath) => {
  // eslint-disable-next-line no-console
  console.log("proses delete", filePath);
  // eslint-disable-next-line no-console
  fs.unlink(filePath, (err) => console.log(err));
  // menggunakan fs.exsistsync
  // fs.unlink
};

module.exports = deleteFile;
