import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './footer';
import SearchInput from "./custom elements/input.jsx";

export const User_tts = () => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false); // To trigger the fade-out animation

    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    const handleChange = (value) => {
        setFormData((prevData) => ({ ...prevData, text: value }));
    };

    const handleDouble = async (e) => {
        e.preventDefault();
        setError('');
        setFadeOut(true); // Trigger fade-out animation
        setLoading(true); // Show loading screen
        try {
            console.log('Submitting form data:', formData);
            const response = await axios.post('http://localhost:8000/api_tts/podcast/', formData, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            console.log('Response:', response);
            if (response.status === 201) {
                setSuccess('Text converted to audio successfully!');
            } else {
                console.error('Unexpected response status:', response.status);
                setError('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submit Error:', error.response || error.message);
            setError('An error occurred while submitting the form.');
        } finally {
            setTimeout(() => setLoading(false));
        }
    };

    return (
        <div className="container">
            <link rel="stylesheet" href="/css/User_tts.css" />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {!loading && (
                <form className={fadeOut ? "fade-out" : ""} onSubmit={handleDouble}>
                    <div className="inputContainer">
                        <SearchInput value={formData.text} onChange={handleChange} /> {/* Using modified handleChange */}
                    </div>
                    <button type="submit" className="button2" disabled={!formData.text.trim()}>Submit</button>
                </form>
            )}
            {loading && <div className="loading-circle"></div>}
        </div>
    );
};


export const Interview = () => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false); // To trigger the fade-out animation

    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    const handleChange = (value) => {
        setFormData((prevData) => ({ ...prevData, text: value }));
    };

    const handleDouble = async (e) => {
        e.preventDefault();
        setError('');
        setFadeOut(true); // Trigger fade-out animation
        setLoading(true); // Show loading screen
        try {
            console.log('Submitting form data:', formData);
            const response = await axios.post('http://localhost:8000/api_tts/interview/', formData, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            console.log('Response:', response);
            if (response.status === 201) {
                setSuccess('Text converted to audio successfully!');
            } else {
                console.error('Unexpected response status:', response.status);
                setError('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submit Error:', error.response || error.message);
            setError('An error occurred while submitting the form.');
        } finally {
            setTimeout(() => setLoading(false));
        }
    };

    return (
        <div className="container">
            <link rel="stylesheet" href="/css/User_tts.css" />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {!loading && (
                <form className={fadeOut ? "fade-out" : ""} onSubmit={handleDouble}>
                    <div className="inputContainer">
                        <SearchInput value={formData.text} onChange={handleChange} /> {/* Using modified handleChange */}
                    </div>
                    <button type="submit" className="button2" disabled={!formData.text.trim()}>Submit</button>
                </form>
            )}
            {loading && <div className="loading-circle"></div>}
        </div>
    );
};


export const StudentTeacher = () => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false); // To trigger the fade-out animation

    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    const handleChange = (value) => {
        setFormData((prevData) => ({ ...prevData, text: value }));
    };

    const handleDouble = async (e) => {
        e.preventDefault();
        setError('');
        setFadeOut(true); // Trigger fade-out animation
        setLoading(true); // Show loading screen
        try {
            console.log('Submitting form data:', formData);
            const response = await axios.post('http://localhost:8000/api_tts/TextToAudio/', formData, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            console.log('Response:', response);
            if (response.status === 201) {
                setSuccess('Text converted to audio successfully!');
            } else {
                console.error('Unexpected response status:', response.status);
                setError('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submit Error:', error.response || error.message);
            setError('An error occurred while submitting the form.');
        } finally {
            setTimeout(() => setLoading(false));
        }
    };

    return (
        <div className="container">
            <link rel="stylesheet" href="/css/User_tts.css" />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {!loading && (
                <form className={fadeOut ? "fade-out" : ""} onSubmit={handleDouble}>
                    <div className="inputContainer">
                        <SearchInput value={formData.text} onChange={handleChange} /> {/* Using modified handleChange */}
                    </div>
                    <button type="submit" className="button2" disabled={!formData.text.trim()}>Submit</button>
                </form>
            )}
            {loading && <div className="loading-circle"></div>}
        </div>
    );
};


export const Single_user_tts = () => {
    const [formData, setFormData] = useState({ text: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [csrfToken, setCsrfToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/csrf-token/", { withCredentials: true });
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token:", error);
            }
        };

        fetchCsrfToken();
    }, []);

    const handleChange = (value) => {
        setFormData({ text: value }); // Update text input
    };

    const handleSingle = async (e) => {
        e.preventDefault();
        setError("");
        setFadeOut(true);
        setLoading(true);

        try {
            console.log("Submitting form data:", formData);
            const response = await axios.post("http://localhost:8000/api_tts/single/", formData, {
                withCredentials: true,
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            });

            console.log("Response:", response);
            if (response.status === 201) {
                setSuccess("Text converted to audio successfully!");
            } else {
                console.error("Unexpected response status:", response.status);
                setError("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submit Error:", error.response || error.message);
            setError("An error occurred while submitting the form.");
        } finally {
            setTimeout(() => setLoading(false));
        }
    };

    return (
        <div className="container">
            <link rel="stylesheet" href="/css/User_tts.css" />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {!loading && (
                <form className={fadeOut ? "fade-out" : ""} onSubmit={handleSingle}>
                    {/* <label htmlFor="text">Text:</label> */}
                    <div class={"inputContainer"}>
                        <SearchInput value={formData.text} onChange={handleChange} /> {/* Using custom input */}
                    </div>
                    <button type="submit" className="button2" disabled={!formData.text.trim()}>Submit</button>
                </form>
            )}
            {loading && <div className="loading-circle"></div>}
        </div>
    );
};
