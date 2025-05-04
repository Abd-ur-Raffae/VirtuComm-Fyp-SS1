import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import Loader from "./loader.jsx"; // Loader component
import "./loader.css"; // Import loader styles

const BASE_URL = "https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HAOQUA9D0bUIZEQB1CDFuw4AlFPADGnAUNGtNOhUqZtOwDlsPwwKNc2acAvv0HCRNnQFpiQ8VqI+CiEYCaKWsyEEJyRofBEKKwcALwcfloArvQhYBQA5ihgAKKIKDmhAEIAngCSxAAUno5hAJQRUTEcgk6pVjZ2Dk4NcWAJhEnthD15hiRJDYoc6kZ51pp2peW5i4TLyxraeQDKYKz4OgCyzKRoS-uEmYiId3v7hzoU67YoWxVgDSkU2WU1aIAwUhkZBgdDMqg+YDQHEsmVQpx+SNRv1gsBQOg4rj0wnkIC8YBJAG5FIpYJlCDp8FEOAAVaqMFDHTL5QoxRnRBqtZH3OJdADaAEdMklqkjUGAAIpS1jVAC6fSx6LsixAJNaVLeIs4oogXJ5YD5EFlRU53JQvM6arSGrGWtFKr11LeWOKOLxAIFqQAfEK3st8LAOA0AISS6WC4D3fYcOU2s0Whpuj2h-aGMCZViEfVJ5yepOGqxRM7MZ5JPoTADu3AARuYAMKVwQ11gCikccTiDhgZhWeD0lCIDjV4jdFCxmIQRMV6Kcc05ZiZThpOXMhgodf+wUpYMJ7PLXFgLQAC12SaTAANL2AwIwINB+1R4PX6-BiABGABMADMAAs3hgGyHKmna5qdBQl6wBQECMNoKDiCatoxAA-OKKQACTACEkSkAAqmotTtmYEyhA0sbKq0zh3q8t77JYED4PkhBINAS5Vl2iHsZxE4lqeHDAsxHAUGAl4hA0DSGBAh7BvJMhRAKYnMZJ0mELJxC2PAinJtaUH2vyuljK06m3l8thXrJSSsAZJ7ifs4aRvZFCcTkHBRikaQklwLbsMUrCCKwupLhA1YoBQ9lsA09lZs5ziJfszhIoBAAMGV6n2A6kC2dJaCg3AAAq1COzyljmRT5nsAZHiGzGjJ2ZSsBQ8CBQCKVlmU8CsDua4bg0q57hu3UEkWBJIhKSqqlm9y5rVkaLgAPMQ+CYFYiDwBAEAAHLwDkKQkvQ8BkN49bePQ070Od8AbsOjDeMBJKBouywrUQjAbu9+zgeyx3gOQ5I6iJyyYEgUopMAtHVMJzlRK2l6joU0PxQZcqKtK8WSX1hR5BDiBSvRv3LIw21FZeU5JID6KqP9RD5BQzMkqTW07fth0oIDl20s8HBPf+HCBaQySCHSpDEKzIniG9InAOhaawWUhD5FJHDBhlHAAGTa8tYMcCtTzs7tB1HSSIu1vQYDeEL4vzNOEDI349avWzywK8ZMHRBQp2MLJ6FIvgxBkAZN7OfsK1BBwADWKDVNDwdkK4gQc2b3MkoLwtsKL3hNhw20xNAlusHn3gZW7BvMZ7+TwxHH3iEEcv1xZdfMSt4hPM3t4k9mHfrZg3dZsJijkConCkAgTycKy7KptBFr6uCIAxNUZRfLtMIUE2YB7E5-CVt4bEAF4oNx-6GPQ+rOCAzjOEAA";

const SearchInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimeout = useRef(null);
  const containerRef = useRef(null); // For click outside detection
  // Fetch suggestions with debounce
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
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setSuggestions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching suggestions:", err);
          setSuggestions([]);
          setLoading(false);
        });
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimeout.current);
  }, [value]);

  // Handle input changes
  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        onChange(suggestions[selectedIndex].phrase);
        setSuggestions([]);
      }
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.phrase);
    setSuggestions([]);
  };

  // Click outside event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSuggestions([]);
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
