import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import Loader from "./loader.jsx"; // Loader component
import "./loader.css"; // Import loader styles

const BASE_URL = "https://typegpt-webscout-api.hf.space";

const SearchInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      setSelectedIndex(-1);
      setLoading(false);
      return;
    }
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    setLoading(true);
    debounceTimeout.current = setTimeout(() => {
      fetch(`${BASE_URL}/api/suggestions?q=${encodeURIComponent(value)}`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => {
          setSuggestions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching suggestions:", err);
          setSuggestions([]);
          setLoading(false);
        });
    }, 500); // Fast 500ms debounce

    return () => clearTimeout(debounceTimeout.current);
  }, [value]);

  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        onChange(suggestions[selectedIndex].phrase);
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.phrase);
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <input
          className="input"
          placeholder="Type your text"
          required
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {loading && <div className="loader-overlay"><Loader /></div>}
        <button
          className="reset"
          type="button"
          onClick={() => onChange("")}
          style={{ opacity: value ? 1 : 0, visibility: value ? "visible" : "hidden" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((sugg, index) => (
            <li
              key={index}
              className={`suggestion-item ${selectedIndex === index ? "selected" : ""}`}
              onClick={() => handleSuggestionClick(sugg)}
            >
              {sugg.phrase}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
