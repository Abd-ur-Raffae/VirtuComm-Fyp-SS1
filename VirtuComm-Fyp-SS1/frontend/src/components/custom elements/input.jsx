import React from "react";
import "./input.css";

const SearchInput = ({ value, onChange }) => {
    return (
        <form className="form" onSubmit={(e) => e.preventDefault()}>
            <input
                className="input"
                placeholder="Type your text"
                required
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                className="reset"
                type="button"
                onClick={() => onChange("")}
                style={{ opacity: value ? 1 : 0, visibility: value ? "visible" : "hidden" }}
            >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </button>
        </form>
    );
};

export default SearchInput;
