const ai = require("../config/gemini");
const { buildResumeReviewPrompt } = require("./prompts/resume.prompt");

const validateResponse = (response) => {
  if (typeof response.score != "number") {
    throw new Error(`AI response score must be a number`);
  }

  if (typeof response.summary != "string") {
    throw new Error("AI response summary must be a string");
  }
  if (!Array.isArray(response.strengths)) {
    throw new Error("AI response strengths must be an array");
  }

  if (!Array.isArray(response.weaknesses)) {
    throw new Error("AI response weaknesses must be an array");
  }

  if (!Array.isArray(response.suggestions)) {
    throw new Error("AI response suggestions must be an array");
  }

  return true;
};
const reviewResumeService = async (resume) => {
  try {
    const prompt = buildResumeReviewPrompt(resume);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.candidates[0].content.parts[0].text;

    const result = JSON.parse(text);
    validateResponse(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { reviewResumeService };
