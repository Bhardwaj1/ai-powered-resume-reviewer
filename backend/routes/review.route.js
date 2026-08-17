const express = require("express");
const { reviewResume } = require("../controllers/review.controller");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("resume"), reviewResume);

module.exports = router;
