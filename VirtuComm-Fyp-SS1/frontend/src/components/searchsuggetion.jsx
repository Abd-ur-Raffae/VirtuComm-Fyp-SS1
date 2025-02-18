import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";

const SearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (input) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://datasets-server.huggingface.co/rows?dataset=income%2Fquora-top-20-gen-queries&config=default&split=train&offset=0&length=100`
      );

      // Check response status
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('Fetched Data:', data);

      // Access the 'rows' array which contains the actual data
      const rows = data.rows;

      if (Array.isArray(rows)) {
        // Extract all queries into an array for fuzzy matching
        const queries = rows.flatMap((item) => item.row.queries);

        // Setup Fuse.js options for fuzzy matching
        const fuse = new Fuse(queries, {
          includeScore: true, // Include scores in results
          threshold: 0.4, // Lower threshold for better matches (0.0 is exact match)
          keys: ['queries'], // Search in the 'queries' array
        });

        // Perform the fuzzy search based on the input
        const result = fuse.search(input);

        // Filter out duplicates by using a Set to track already displayed suggestions
        const uniqueSuggestions = new Set();
        const filteredSuggestions = [];

        // Loop through the search results and add only unique suggestions
        result.forEach((resultItem) => {
          const suggestion = resultItem.item;
          if (!uniqueSuggestions.has(suggestion)) {
            uniqueSuggestions.add(suggestion);
            filteredSuggestions.push(suggestion);
          }
        });

        // Limit the number of suggestions to 5
        setSuggestions(filteredSuggestions.slice(0, 5));
      } else {
        console.error("Unexpected data format in 'rows'", rows);
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
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query); // Fetch data based on query
      } else {
        setSuggestions([]); // Clear suggestions if there's no query
      }
    }, 500);

    return () => clearTimeout(delayDebounce); // Clean up the timeout on query change
  }, [query]);

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
              onClick={() => setQuery(query + " " + suggestion)} // Adds selected suggestion to the query
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
