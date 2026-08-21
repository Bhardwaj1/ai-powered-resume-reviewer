const express = require("express");
const { reviewResume } = require("../controllers/review.controller");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only Pdf file are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", upload.single("resume"), reviewResume);

module.exports = router;
