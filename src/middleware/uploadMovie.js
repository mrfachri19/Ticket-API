const multer = require("multer");
const helperWrapper = require("../helper/wrapper/index");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/movie");
  },
  filename(req, file, cb) {
    // console.log(new Date().toISOString());
    // console.log(file);
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const uploadFile = multer({
//   storage: storage,
//   limits: {
//     fieldSize: 1024 * 1024 * 3,
//   },
// });
const upload = multer({ storage, fileFilter }).single("image");

// single : untuk mengupload file tapi yang di upload hanya 1 file saja
// array : untuk mengupload file tapi yang di upload lebih dari 1 file
// fields : untuk mengupload file di lebih dari 1 field

const uploadFilter = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(res, 401, err.message, null);
    }
    if (err) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(res, 401, err.message, null);
    }
    // Everything went fine.
    next();
  });
};

module.exports = uploadFilter;
