import React, { useState } from "react";
import "./input.css";
import Loader from "./loader.jsx"; // Loader component
import "./loader.css"; // Import loader styles

const SearchInput = ({ value, onChange }) => {
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
                setSuggestions(Object.values(data.questions));
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
        const newValue = event.target.value;
        onChange(newValue);

        if (typingTimeout) clearTimeout(typingTimeout);

        if (newValue.trim() === "") {
            setLoading(false);
            setSuggestions([]); // Clear suggestions if input is empty
            return;
        }

        setLoading(true);
        setTypingTimeout(setTimeout(() => {
            fetchSuggestions(newValue.trim());
        }, 3000)); // 3-second delay
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

            {suggestions.length > 0 && !loading && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="suggestion-item"
                            onClick={() => onChange(value + " " + suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchInput;
