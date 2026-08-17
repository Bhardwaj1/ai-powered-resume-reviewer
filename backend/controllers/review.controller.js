const { extractTextFromPdf } = require("../services/pdf.service");
const { reviewResumeService } = require("../services/ai.service");
const { cleanResumeText } = require("../services/text.service");

const reviewResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required.",
      });
    }

    const extractedText = await extractTextFromPdf(req.file.buffer);
    console.log({extractedText})

    const resumeText = cleanResumeText(extractedText);

    console.log({resumeText})

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the PDF.",
      });
    }

    const result = await reviewResumeService(resumeText);

    return res.status(200).json({
      success: true,
      data: result,
      message: "Resume reviewed successfully",
    });
  } catch (error) {
    console.error("Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to review resume",
    });
  }
};

module.exports = {
  reviewResume,
};
