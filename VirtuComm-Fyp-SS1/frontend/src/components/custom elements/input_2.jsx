import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import Loader from "./loader.jsx";
import "./loader.css";

const TypeSuggestions = () => {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!inputText.trim()) {
      setResponseText([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timeout = setTimeout(() => {
      fetch(
        `https://jawwad1234-typeSuggestions.hf.space/suggest?q=${encodeURIComponent(inputText)}`,
        { signal: controller.signal }
      )
        .then((res) => res.json())
        .then((data) => {
          setResponseText(data || []);
          setHighlightIndex(-1);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Failed to fetch suggestions:", err);
            setResponseText(["Error fetching response."]);
            setLoading(false);
          }
        });
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [inputText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setResponseText([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setResponseText([]);
  };

  const handleKeyDown = (e) => {
    if (!responseText.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % responseText.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + responseText.length) % responseText.length);
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      setInputText(responseText[highlightIndex]);
      setResponseText([]);
    }
  };

  const highlightMatch = (text) => {
    const idx = text.toLowerCase().indexOf(inputText.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong>{text.slice(idx, idx + inputText.length)}</strong>
        {text.slice(idx + inputText.length)}
      </>
    );
  };

  return (
    <div className="search-container" ref={containerRef}>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <input
          className="input"
          placeholder="Type your text"
          required
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {loading && <div className="loader-overlay"><Loader /></div>}
        <button
          className="reset"
          type="button"
          onClick={() => setInputText("")}
          style={{ opacity: inputText ? 1 : 0, visibility: inputText ? "visible" : "hidden" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </button>
      </form>

      {Array.isArray(responseText) && responseText.length > 0 && (
        <ul className="suggestions-list">
          {responseText.map((suggestion, index) => (
            <li
              key={index}
              className={`suggestion-item ${highlightIndex === index ? "highlighted" : ""}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {highlightMatch(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TypeSuggestions;
