import React, { useState, useEffect, useRef } from 'react';

const BASE_URL = "https://typegpt-webscout-api.hf.space";

function TypeGPTSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimeout = useRef(null);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetch(`${BASE_URL}/api/suggestions?q=${encodeURIComponent(query)}`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setSuggestions(data))
        .catch((err) => {
          console.error("Error fetching suggestions:", err);
          setSuggestions([]);
        });
    }, 500);
    // Cleanup on unmount or query change
    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        setQuery(suggestions[selectedIndex].phrase);
        setSuggestions([]);
        // Call your search function here with the chosen suggestion
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.phrase);
    setSuggestions([]);
    // Trigger search with suggestion.phrase if needed
  };

  return (
    <div className="search-container" style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search the web"
        style={styles.input}
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul style={styles.suggestionsList}>
          {suggestions.map((sugg, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(sugg)}
              style={{
                ...styles.suggestionItem,
                backgroundColor: selectedIndex === index ? "#f0f0f0" : "#fff",
              }}
            >
              {sugg.phrase}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "24px",
    border: "2px solid #4285f4",
    fontSize: "16px",
    outline: "none",
  },
  suggestionsList: {
    listStyle: "none",
    padding: 0,
    margin: "8px 0 0 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
  suggestionItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
};

export default TypeGPTSearch;
