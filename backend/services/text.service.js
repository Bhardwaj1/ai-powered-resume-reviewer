const cleanResumeText = (text) => {
  return text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

module.exports = {
  cleanResumeText,
};
