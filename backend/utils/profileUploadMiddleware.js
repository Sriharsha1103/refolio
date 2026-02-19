const multer = require("multer");
const { upload } = require("../lib/uploadUtils");

const profileUploadMiddleware = (req, res, next) => {

  upload.any()(req, res, (err) => {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size too large. Max allowed is 1MB",
        });
      }
    }

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }

    console.log("FILES RECEIVED:", req.files);

    next();
  });
};

module.exports = { profileUploadMiddleware };
