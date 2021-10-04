const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  // eslint-disable-next-line no-console
  // console.log("proses delete", filePath);
  // eslint-disable-next-line no-console
  // eslint-disable-next-line no-param-reassign
  path.join(__dirname, "../../../public/uploads/movie", filePath);
  // eslint-disable-next-line no-console
  fs.unlink(filePath, (err) => console.log(err));
  // menggunakan fs.exsistsync
  // fs.unlink
};

module.exports = deleteFile;
