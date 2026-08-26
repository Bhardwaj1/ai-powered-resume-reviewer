const express = require("express");
const { reviewResume } = require("../controllers/review.controller");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    reviewResume(req, res, next);
  });
});

module.exports = router;