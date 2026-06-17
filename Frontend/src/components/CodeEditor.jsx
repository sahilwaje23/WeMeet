import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const defaultCppCode = `#include <bits/stdc++.h>

using namespace std;

int main() {

    cout << "Hello WeMeet";

    return 0;
}`;

const LANGUAGES = [
  {
    name: "C++",
    value: "cpp",
    judge0Id: 54,
  },
  {
    name: "Python",
    value: "python",
    judge0Id: 71,
  },
  {
    name: "JavaScript",
    value: "javascript",
    judge0Id: 63,
  },
];

const DEFAULT_CODES = {
  cpp: `#include <bits/stdc++.h>

using namespace std;

int main() {

    cout << "Hello WeMeet";

    return 0;
}`,

  python: `print("Hello WeMeet")`,

  javascript: `console.log("Hello WeMeet");`,
};

export default function CodeEditor({ onClose, socket, roomId }) {
  //STATES
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_CODES.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  //USEEFFECTS
  useEffect(() => {
  socket.emit("get-code", roomId);

  socket.on("code-history", (data) => {
    setLanguage(data.language);

    if (data.code) {
      setCode(data.code);
    }
  });

  socket.on("code-change", (data) => {
    setCode(data.code);
  });

  socket.on("language-change", (data) => {
    setLanguage(data.language);
    setCode(data.code);
  });

  return () => {
    socket.off("code-history");
    socket.off("code-change");
    socket.off("language-change");
  };
}, []);

  //FUNCTIONS
  const handleRun = async () => {
    try {
      setOutput("Running...");

      const response = await fetch("https://wemeet-backend-b4ct.onrender.com/api/code/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
          input,
        }),
      });

      const data = await response.json();

      setOutput(data.output);
    } catch (error) {
      console.error(error);

      setOutput("Execution Failed");
    }
  };

  const handleSave = () => {
    console.log("Saving code...");
  };

//   const handleLanguageChange = (e) => {
//   const newLanguage = e.target.value;

//   setLanguage(newLanguage);

//   setCode(DEFAULT_CODES[newLanguage]);

//   // socket.emit("language-change",{
//   //   roomId,
//   //   language:newLanguage,
//   //   code:DEFAULT_CODES[newLanguage],
//   // })

//   socket.emit("code-change", {
//   roomId,
//   language,
//   code: newCode,
// });

 
// };
const handleLanguageChange = (e) => {
  const newLanguage = e.target.value;

  setLanguage(newLanguage);

  setCode(DEFAULT_CODES[newLanguage]);

  socket.emit("language-change", {
    roomId,
    language: newLanguage,
    code: DEFAULT_CODES[newLanguage],
  });
};
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="w-[95vw] md:w-[90vw] h-[90vh] md:h-[85vh] bg-[#111111] rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        {/* <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4"> */}
        <div className="border-b border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between p-3 gap-2">
          {/* <div className="flex items-center gap-3"> */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e)}
              className="bg-[#1A1A2E] text-white px-3 py-2 rounded"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleRun}
              className="bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400"
            >
              Run
            </button>

            <button
              onClick={handleSave}
              className="bg-[#00D4FF] text-black px-4 py-2 rounded font-semibold hover:opacity-90"
            >
              Save
            </button>
          </div>

          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
           onChange={(value) => {
  const newCode = value || "";

  setCode(newCode);

  socket.emit("code-change", {
    roomId,
    language,
    code: newCode,
  });
}}
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 15,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Input Output Section */}
        {/* <div className="h-48 border-t border-gray-800 flex"> */}
        <div className="h-64 md:h-48 border-t border-gray-800 flex flex-col md:flex-row">
          {/* Input */}
          {/* <div className="w-1/2 border-r border-gray-800 flex flex-col"> */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col">
            <div className="bg-[#1A1A2E] text-white px-3 py-2 font-semibold">
              Input
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // onChange={(value)=>setInput(value)}
              placeholder="Enter input here..."
              className="flex-1 bg-[#111111] text-white p-3 outline-none resize-none"
            />
          </div>

          {/* Output */}
          {/* <div className="w-1/2 flex flex-col">
           */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="bg-[#1A1A2E] text-white px-3 py-2 font-semibold">
              Output
            </div>

            <div className="flex-1 bg-[#111111] text-green-400 p-3 overflow-auto whitespace-pre-wrap">
              {output}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
