const multer = require("multer");
const path = require("path");
const fs = require("fs");

const BASE_UPLOAD_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(BASE_UPLOAD_DIR)) {
  fs.mkdirSync(BASE_UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    // ⭐ FIX HERE
    const branch = req.body.branch || "common";

    const uploadDir = path.join(BASE_UPLOAD_DIR, branch);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

module.exports = { upload };
