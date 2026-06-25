const axios = require("axios");

const runCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;

    // const languageMap = {
    //   cpp: "cpp17",
    //   python: "python3",
    //   javascript: "nodejs",
    // };

    const languageConfig = {
      cpp: {
        language: "cpp17",
        versionIndex: "0",
      },
      python: {
        language: "python3",
        versionIndex: "0",
      },
      javascript: {
        language: "nodejs",
        versionIndex: "0",
      },
      java: {
        language: "java",
        versionIndex: "0",
      },
    };

    // const jdoodleLanguage = languageConfig[language].language;

    const config = languageConfig[language];

if (!config) {
  return res.status(400).json({
    success: false,
    output: "Unsupported language",
  });
}

    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      // language: language,
      language: config.language,
      stdin: input,
      // versionIndex: "0",
      versionIndex: config.languageIndex,
    });

    res.json({
      success: true,
      output: response.data.output,
    });
  } catch (error) {
    console.log("FULL ERROR:");
    console.log(error.response?.data);
    console.log(error.message);

    res.status(500).json({
      success: false,
      output: error.response?.data?.error || "Execution Failed",
    });
  }
};

module.exports = { runCode };
