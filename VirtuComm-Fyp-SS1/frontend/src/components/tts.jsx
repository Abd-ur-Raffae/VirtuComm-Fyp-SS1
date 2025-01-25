import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        setTimeout(() => setLoading(false), 20000); // Simulate 20 seconds of loading
    }
};


    return (
        <div className="container">
            <link rel="stylesheet" href="/css/User_tts.css" />
            <h2>Text-to-Speech</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {!loading && (
                <form className={fadeOut ? 'fade-out' : ''} onSubmit={handleDouble}>
                    <label htmlFor="text">Text:</label>
                    <input
                        type="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Single</button>
                </form>
            )}
            {loading && (
                <div className="loading-circle"></div>
            )}
        </div>
    );
};


export const Single_user_tts = () => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSingle = async (e) => {
    e.preventDefault();
    setError('');
    setFadeOut(true); // Trigger fade-out animation
    setLoading(true); // Show loading screen
    try {
        console.log('Submitting form data:', formData);
        const response = await axios.post('http://localhost:8000/api_tts/single/', formData, {
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
        setTimeout(() => setLoading(false), 20000); // Simulate 20 seconds of loading
    }
};


    return (
        <div className="container">
            <link rel="stylesheet" href="/css/User_tts.css" />
            <h2>Text-to-Speech</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {!loading && (
                <form className={fadeOut ? 'fade-out' : ''} onSubmit={handleSingle}>
                    <label htmlFor="text">Text:</label>
                    <input
                        type="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Single</button>
                </form>
            )}
            {loading && (
                <div className="loading-circle"></div>
            )}
        </div>
    );
};