import React, { useState } from "react";
import Loader from "./custom elements/loader";
import "./custom elements/loader.css"; // Import the CSS file for styling

const SearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const fetchSuggestions = async (input) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api_tts/querySuggest/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", JSON.stringify(data, null, 2));

      if (typeof data.questions === "object") {
        const questions = Object.values(data.questions);
        setSuggestions(questions);
      } else {
        console.error("Unexpected data format", data);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
  
    if (typingTimeout) clearTimeout(typingTimeout);
  
    if (value.trim() === "") {
      setLoading(false);
      setSuggestions([]); // Clear suggestions when input is empty
      return; // Exit the function early to prevent fetching
    }
  
    setLoading(true);
    setTypingTimeout(setTimeout(() => {
      fetchSuggestions(value.trim());
    }, 3000)); // 3-second delay
  };
  

  return (
    <div className="search-container">
      <div className="input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="search-input"
        />
        {loading && <div className="loader-container"><Loader /></div>}
      </div>

      {suggestions.length > 0 && !loading && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => setQuery(query + " " + suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchSuggestions;
