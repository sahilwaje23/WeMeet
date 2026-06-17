const axios = require("axios");

const runCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language,
        version: "*",
        files: [
          {
            content: code,
          },
        ],
        stdin: input,
      }
    );

    res.json({
      success: true,
      output: response.data.run.output,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      output: "Execution Failed",
    });
  }
};

module.exports = {
  runCode,
};