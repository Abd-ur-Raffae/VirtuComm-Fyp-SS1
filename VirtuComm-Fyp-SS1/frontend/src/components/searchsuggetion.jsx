import React, { useState, useEffect } from "react";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Fetched Data:", JSON.stringify(data, null, 2));
  
      if (typeof data.questions === "string") {
        const questions = data.questions
          .split("\n")
          .map((q) => q.trim())
          .filter(Boolean);
  
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

    // Clear any existing timeout when user types
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to fetch suggestions after 3 seconds of inactivity
    setTypingTimeout(setTimeout(() => {
      if (value.trim()) {
        fetchSuggestions(value.trim());
      }
    }, 3000)); // 3-second delay
  };

  return (
    <div style={{ width: "300px", margin: "20px auto", position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      {loading && <div style={{ position: "absolute", right: "10px", top: "10px" }}>⏳</div>}
      {suggestions.length > 0 && !loading && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "5px 0 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            position: "absolute",
            width: "100%",
            background: "white",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
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
