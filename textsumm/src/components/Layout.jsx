import React, { useState } from "react";
import "./Layout.css";
import { Sidebar } from "./Sidebar";
import image from "./back.png";
import axios from "axios";
import shape1 from "./shape1.png";
import { TypeAnimation } from "react-type-animation";

export const Layout = () => {
  const [title, setTitle] = useState(true);
  const [loader, setLoader] = useState(false);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [file, setFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("en");

  const GetResult = async () => {
    setLoader(true);
    setError("");
    setSummary("");

    if (!summaryLength) {
      setError("Please select the summary length.");
      setLoader(false);
      return;
    }

    // Check if the text contains at least 20 words
    if (text.trim().split(/\s+/).length < 20 && !file) {
      setError("Please write at least 20 words or upload a PDF file.");
      setLoader(false);
      return;
    }

    const formData = new FormData(); // Create a new FormData object
    formData.append("summaryLength", summaryLength);
    formData.append("language", targetLanguage); // Add target language to form data

    if (file) {
      formData.append("file", file); // Append the file if uploaded
    } else if (text) {
      formData.append("text", text);
    } else {
      setError("Please write a text or upload a PDF file.");
      setLoader(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/summarize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res);
      setLoader(false);

      setSummary(res.data.summary);
      setTitle(false); // Show summary after first generation

      // Reset inputs after success
      setFile(null);
    } catch (error) {
      setLoader(false);
      console.error(error);
      setError("An error occurred while processing your request.");
    }
  };

  const clear = () => {
    setFile(null);
    document.getElementById("upload").value = "";
    setSummary("");
  };

  return (
    <div className="container">
      <Sidebar
        setSummaryLength={setSummaryLength}
        setTargetLanguage={setTargetLanguage}
      />
      <div className="main-body">
        <div className="promt-section">
          <div className="output">
            {title && (
              <>
                <h2>Text Summarizer</h2>
                <img src={image} alt="image" />
              </>
            )}
            {!title && (
              <p>
                <TypeAnimation
                  sequence={[summary]}
                  cursor={true}
                  speed={75}
                  key={summary}
                />
              </p>
            )}
            {loader && <div className="loader"></div>}
          </div>

          <div className="shape-2">
            <img src={shape1} alt="Shape" />
          </div>

          {file && (
            <>
              <div className="file-status">
                File uploaded
                <button className="clear" id="clear" onClick={clear}>
                  x
                </button>
              </div>
            </>
          )}

          {error && <p className="error">{error}</p>}

          <div className="input">
            <input
              type="text"
              placeholder="Enter Your Prompt Here"
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
            />

            <input
              type="file"
              id="upload"
              accept=".pdf"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setText("");
                setError("");
              }}
              disabled={file}
              hidden
            />

            <label htmlFor="upload">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(75, 40, 109, 1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-paperclip size-4"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </label>

            <button onClick={() => GetResult()}>&#8593;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
