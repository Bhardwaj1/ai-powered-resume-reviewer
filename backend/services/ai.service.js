const ai = require("../config/gemini");

const {
  buildResumeReviewPrompt,
} = require("./prompts/resume.prompt");

const validateResponse = (response) => {
  if (!response || typeof response !== "object") {
    throw new Error("AI response must be an object");
  }

  if (typeof response.score !== "number") {
    throw new Error("AI response score must be a number");
  }

  if (response.score < 0 || response.score > 100) {
    throw new Error(
      "AI response score must be between 0 and 100"
    );
  }

  if (
    typeof response.scoreBreakdown !== "object" ||
    response.scoreBreakdown === null ||
    Array.isArray(response.scoreBreakdown)
  ) {
    throw new Error(
      "AI response scoreBreakdown must be an object"
    );
  }

  const scoreLimits = {
    contactInformation: 10,
    professionalSummary: 10,
    skills: 20,
    workExperience: 25,
    projects: 15,
    education: 10,
    atsFormatting: 10,
  };

  Object.entries(scoreLimits).forEach(([field, maxScore]) => {
    const value = response.scoreBreakdown[field];

    if (typeof value !== "number") {
      throw new Error(
        `AI response scoreBreakdown.${field} must be a number`
      );
    }

    if (value < 0) {
      throw new Error(
        `AI response scoreBreakdown.${field} cannot be negative`
      );
    }

    if (value > maxScore) {
      throw new Error(
        `AI response scoreBreakdown.${field} cannot exceed ${maxScore}`
      );
    }
  });

  const totalScore = Object.keys(scoreLimits).reduce(
    (total, field) => {
      return total + response.scoreBreakdown[field];
    },
    0
  );

  if (totalScore !== response.score) {
    throw new Error(
      `AI response score ${response.score} does not match scoreBreakdown total ${totalScore}`
    );
  }

  if (typeof response.summary !== "string") {
    throw new Error(
      "AI response summary must be a string"
    );
  }

  if (!Array.isArray(response.strengths)) {
    throw new Error(
      "AI response strengths must be an array"
    );
  }

  if (!Array.isArray(response.weaknesses)) {
    throw new Error(
      "AI response weaknesses must be an array"
    );
  }

  if (!Array.isArray(response.suggestions)) {
    throw new Error(
      "AI response suggestions must be an array"
    );
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

    const text =
      response.candidates[0].content.parts[0].text;

    const result = JSON.parse(text);

    validateResponse(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  reviewResumeService,
};