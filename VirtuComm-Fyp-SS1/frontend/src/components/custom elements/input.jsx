import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import Loader from "./loader.jsx"; // Loader component
import "./loader.css"; // Import loader styles

const BASE_URL = "https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HAOQUA9D0bUIZEQB1CDFuw4AlFPADGnAUNGtNOhUqZtOwDlsPwwKNc2acAvv0HCRNnQFpiQ8VqI+CiEYCaKWsyEEJyRofBEKKwcALwcfloArvQhYBQA5ihgAKKIKDmhAEIAngCSxAAUno5hAJQRUTEcgk6pVjZ2Dk4NcWAJhEnthD15hiRJDYoc6kZ51pp2peW5i4TLyxraeQDKYKz4OgCyzKRoS-uEmYiId3v7hzoU67YoWxVgDSkU2WU1aIAwUhkZBgdDMqg+YDQHEsmVQpx+SNRv1gsBQOg4rj0Hi8YQA3IoOtFOAAVaqMFDHTL5QoxfCdPoNVqpAB8yPucS6AG0iIxMmBqeRERxUGBaoRReLJQBdPpY9F2JoiVrkt4CziCwwQFjRFASshSmUaI2dU3K1VosYakRanX3LHFHF4gGcnl8t7LPX8IpaAAWjOZKFZ7LS8Ag1UIWg4PpSvOA932HHwsCTAEIRWKzXkzgxOVy0-6M9KilbjahC5rtenK4YwJlWIQdZWCRSK8sztU-V2A51OIbayg+vAAO4JXTBkO7If7AAGIbAYEYEGg4nEVGnM+IAEYAEwAZgALN4wHSGUyWWA2dEKCHYBQjdoUOJGIZiBcwAB+OxzRSAASYAQkiUgAFU1FqABhIRjR2fNFXNVpnGXJsM0bXt9kDYhbHgScZ3wUdI3HCggIBbUOB3DhijIekdCIfIOEYRBxg4Ki3H0AAjbQAGsQmIHslwFZgygoRBmHyJprlIRAVmtE1oBEJECLGGi6IAGRkrjmCsToJJQLD9ktcibXrDT4C08QOGOIpumnboLJNfTpRDZgpw4XiUGk7yUNM1wtFsUMkySQRWDLUzh2iYyKAitgmgAMQSMpiHc3EwDCiA70jB9OlUpFEqizsh3M5S60lJpilYSKg2ykMWJcyqUAoF0gqbZxXQrfCUF45hMgTU0GBQQbODSGVqVG8aGiy0Nw3vR8ICRU8AAY1pwjMWzbPZk15QJNFYaaclm0gBqGrQRtOsUtoJJFhXlAtlRw+4dvbJMmwAHl-TBpWvMoUmASwp3wYgwBDaBRHPDbGDkJF6HgVh8iIKGRGPQxhHgMVmDU-gojAVL6HwRBqjRrhziQEQCWcblTK+wLcL7G8UnkcBJTZmK2I4q7PMQUhWFZkBaXpaUhCKJrCHyCgZc5pmOEwJBMhQIGUMLZwuaiOCQ3gKWVeABoUC5FMq1lJ7UIBNqxmRooKEVxBlfQrmYmqQHgY4UHwch0RDw2gBSPHGHgYhfyltG1ooABWTG8dgAnjnwAAvFA0cPGOadM8Q6dw4Ax0syUOAAMkLz75a+78Jxdt3yyXZZEeRohqWYRhU5j15a7Y4PQ-yVvyjUrnln4rQBPyQQhuIBDpNYNGAGJYAATgXhf+-lwe2AF1O4bFoIMpnrR95XjuBtYAW1GD-BUTRyO4cP2upyauxjiDq60Yr7wp1YeBGFvrtnFpgfkR5xNOrLmX0vyGGzl2J2FYwG-UgRwHC3UezkBUJwUgCAng0hvItfKy0dTghAFXNqWgIC0AoLxMAewa741CN4CAScU4cAxuUHUzgQB-yAA";

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
