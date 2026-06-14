import React, { useMemo } from "react";
import { useState } from "react";
import Header from "./Header";
import { GoogleGenAI } from "@google/genai";
import { MdOutlineTextsms } from "react-icons/md";
import { BsCopy } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import Footer from "./Footer";
import { MdOutlineSummarize } from "react-icons/md";
import Loading from "./Loading";

const App = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const countWordds = useMemo(() => {
    return (words) => {
      return words
        .trim()
        .split(/\s+/)
        .filter((words) => words.length > 0).length;
    };
  }, []); //"Hello world" => ["Hello", "world"] => 2

  const sentenceCount = useMemo(() => {
    return (sentences) => {
      return sentences
        .trim()
        .split(/[.!?/n]+/)
        .filter((sentence) => sentence.length > 0).length;
    };
  }, []); //"hello.how are you?" => ["hello", "how are you"] => 2

  const PasteText = async () => {
    try {
      const navigatorText = await navigator.clipboard.readText(); //Browser API to read text from clipboard
      setText(navigatorText);
    } catch (err) {
      console.log("Failed to read clipboard contents: ", err);
      setError("Failed to read clipboard contents. Please allow clipboard access and try again.");
    }
  };

  const summarizeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      setTimeout(() => {
        setError(null);
      }, 2000);

      return;
    }
    if (text.length < 50) {
      setError("Text is too short to summarize. Please enter more text.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Summarize the following text while preserving all important information.
                  Write a clear and well-structured summary in simple English.
                  Do not add any new information.
                  Text:${text}`,
      });
      const resoponseText = response.text.trim();
      setSummary(resoponseText);
      console.log(response.text);
    } catch (err) {
      console.log("Error generating summary: ", err);
      setError("An error occurred while generating the summary. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const copiedText = async () => {
    try {
      if (!summary.trim()) {
        setCopyStatus("empty");
        setTimeout(() => {
          setCopyStatus(" ");
        }, 2000);
        return;
      }
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText === summary) {
        setCopyStatus("already");
        setTimeout(() => {
          setCopyStatus(" ");
        }, 2000);
        return;
      }

      await navigator.clipboard.writeText(summary);
      setCopyStatus("success");
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setCopyStatus(" ");
      }, 2000);
    } catch (err) {
      console.log("Failed to copy text: ", err);
      setError("Failed to copy text. Please allow clipboard access and try again.");
    }
  };

  const clearText = () => {
    setText("");
    setError("");
    setSummary("");
    setCopied(false);
  };

  return (
    <>
      <div className="completeBody min-h-screen mx-auto overflow-x-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-200 flex flex-col ">
        <div className="headerSection p-1">
          <Header />
        </div>
        <div className="inputArea flex flex-col  w-full mx-auto  border-2 border-gray-300 shadow-2xl rounded-lg my-4 px-4 md:max-w-3xl sm:max-w-lg ">
          <div className="badge h-fit mb-2 bg-transparent mt-2 w-full  ">
            <div className="cover flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full  ">
              <div className="box flex items-center gap-2 p-2 bg-red-200 rounded-xl font-semibold">
                <MdOutlineTextsms />
                <p>Enter your text</p>
              </div>
              <div className="tooldata  flex items-center gap-4 justify-between">
                <div className="tooltip" data-tip={`${text.length}`}>
                  <p>{`${countWordds(text)} words . ${sentenceCount(text)} sentences`}</p>
                </div>
                {/*paste button*/}
                <button className="btn btn-primary btn-sm sm:btn-md" onClick={PasteText}>
                  Paste
                </button>
              </div>
            </div>
          </div>
          <textarea
            placeholder="Enter your words or sentence to make summarize"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="
    textarea
    overflow-y-auto
    w-full
    h-40
    mb-3
    rounded-xl
    border border-purple-200
    shadow-md
    resize-none
    focus:outline-none
    focus:ring-2
    focus:ring-purple-400
    placeholder:text-gray-500
  "
          />
          <div className="clean-summarize flex justify-end gap-3 mb-2 mr-4">
            <button className="btn btn-secondary w-min btn-sm sm:btn-md" disabled={loading} onClick={clearText}>
              Clear
            </button>
            <button className="btn  btn-neutral btn-sm sm:btn-md" disabled={loading} onClick={summarizeText}>
              {loading ? <div>Summarizing...</div> : <div>Summarize</div>}
            </button>
          </div>

          {loading && (
            <div className="w-full ">
              <Loading />
            </div>
          )}

          {summary && <hr className="mt-3"></hr>}
          {summary && (
            <div>
              <div className="WrapperClass flex flex-col justify-between items-center sm:flex-row ">
                <div className="badge badge-primary badge-soft font-semibold gap-2 my-3 h-10 w-full text-sm  md:text lg:text-md lg:max-w-fit  ">
                  <MdOutlineSummarize />
                  Summarize Text
                </div>
                <div className="toolData flex items-center gap-3">
                  <div className="tooltip" data-tip={`${text.length}`}>
                    <p>{`${countWordds(summary)} words . ${sentenceCount(summary)} sentences`}</p>
                  </div>
                  <button className="btn btn-primary " onClick={copiedText}>
                    {copied ? "copying" : "copy"}
                  </button>
                </div>
              </div>
              <div className="card w-full bg-base-100 card-md shadow-sm my-3 h-40">
                <div className="card-body overflow-y-auto">
                  <p>{summary}</p>
                  <div className="justify-end card-actions"></div>
                </div>
              </div>
            </div>
          )}
          {/*Copy text notification */}
          <div className="Copy_information mb-3">
            {copyStatus === "empty" ? (
              <div className="alert alert-warning w-fit mx-auto">
                <span>No text has been entered</span>
              </div>
            ) : copyStatus === "already" ? (
              <div className="alert alert-info w-fit mx-auto">
                <span>You already copied this text</span>
              </div>
            ) : copyStatus === "success" ? (
              <div className="alert alert-success w-fit mx-auto">
                <span>Text copied successfully</span>
              </div>
            ) : null}
          </div>
          {error && (
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
        <p className="mx-auto text-sm"> Build with React,Tailwind CSS,DaisyUI and Google API </p>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
