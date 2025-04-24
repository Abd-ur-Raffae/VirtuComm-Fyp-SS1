import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import Loader from "./loader.jsx";
import "./loader.css";

const TypeSuggestions = () => {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!inputText.trim()) {
      setResponseText([]);
      setLoading(false);
      return;
    }
  
    setLoading(true);
    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://jawwad1234-typeSuggestions.hf.space/predict?text=${encodeURIComponent(inputText)}`
        );
        const data = await response.json();
        setResponseText(data.suggestions || []);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setResponseText(["Error fetching response."]);
      } finally {
        setLoading(false);
      }
    }, 300);
  
    return () => clearTimeout(debounceTimeout);
  }, [inputText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setResponseText('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <li key={index} className="suggestion-item">
        {suggestion}
      </li>
    ))}
  </ul>
)}
    </div>
  );
};

export default TypeSuggestions;
