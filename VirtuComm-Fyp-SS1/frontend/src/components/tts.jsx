import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchInput from "./custom elements/input.jsx";

export const User_tts = () => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

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
        setFadeOut(true);
        setLoading(true);
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
        <div className="tts-form-container">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {!loading ? (
                <form className={`tts-form ${fadeOut ? "fade-out" : ""}`} onSubmit={handleDouble}>
                    <div className="input-wrapper">
                        <SearchInput value={formData.text} onChange={handleChange} />
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={!formData.text.trim()}
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Processing your request...</p>
                </div>
            )}

            <style jsx>{`
                .tts-form-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 15px;
                     align-items: center; 
                }

                .tts-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    width: 12%;
                    transition: opacity 0.3s ease;
                    align-items: center; 
                }

                .tts-form.fade-out {
                    opacity: 0.5;
                     align-items: center; 
                }

                .input-wrapper {
                    width: 100%;
                     align-items: center; 
                }

                .submit-button {
                    background-color: var(--light-accent, #0066cc);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 20px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    align-self: flex-end;
                    margin-top: 10px;
                     align-items: center; 
                }

                .dark-theme .submit-button {
                    background-color: var(--dark-accent, #0d84ff);
                }

                .submit-button:hover:not(:disabled) {
                    background-color: var(--light-accent-hover, #0055aa);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .dark-theme .submit-button:hover:not(:disabled) {
                    background-color: var(--dark-accent-hover, #3a9fff);
                }

                .submit-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .alert {
                    padding: 10px 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    font-size: 14px;
                    animation: fadeIn 0.3s ease;
                }

                .alert-error {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                    border: 1px solid rgba(220, 53, 69, 0.2);
                }

                .alert-success {
                    background-color: rgba(40, 167, 69, 0.1);
                    color: #28a745;
                    border: 1px solid rgba(40, 167, 69, 0.2);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    gap: 15px;
                    animation: fadeIn 0.3s ease;
                }

                .loading-container p {
                    color: var(--light-text-secondary, #666666);
                    font-size: 14px;
                }

                .dark-theme .loading-container p {
                    color: var(--dark-text-secondary, #cccccc);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (max-width: 768px) {
                    .tts-form-container {
                        padding: 12px;
                    }

                    .submit-button {
                        padding: 10px 16px;
                        font-size: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .tts-form-container {
                        padding: 10px;
                    }

                    .tts-form {
                        gap: 12px;
                    }

                    .submit-button {
                        padding: 8px 14px;
                        font-size: 14px;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export const Interview = () => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

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
        setFadeOut(true);
        setLoading(true);
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
        <div className="tts-form-container">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {!loading ? (
                <form className={`tts-form ${fadeOut ? "fade-out" : ""}`} onSubmit={handleDouble}>
                    <div className="input-wrapper">
                        <SearchInput value={formData.text} onChange={handleChange} />
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={!formData.text.trim()}
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Processing your request...</p>
                </div>
            )}

            <style jsx>{`
                .tts-form-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 15px;
                }

                .tts-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    width: 100%;
                    transition: opacity 0.3s ease;
                    align-items: center; /* Center the form contents */
                }

                .tts-form.fade-out {
                    opacity: 0.5;
                }

                .input-wrapper {
                    width: 100%;
                }

                .submit-button {
                    background-color: var(--light-accent, #0066cc);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 20px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    align-self: flex-end;
                    margin-top: 10px;
                }

                .dark-theme .submit-button {
                    background-color: var(--dark-accent, #0d84ff);
                }

                .submit-button:hover:not(:disabled) {
                    background-color: var(--light-accent-hover, #0055aa);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .dark-theme .submit-button:hover:not(:disabled) {
                    background-color: var(--dark-accent-hover, #3a9fff);
                }

                .submit-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .alert {
                    padding: 10px 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    font-size: 14px;
                    animation: fadeIn 0.3s ease;
                }

                .alert-error {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                    border: 1px solid rgba(220, 53, 69, 0.2);
                }

                .alert-success {
                    background-color: rgba(40, 167, 69, 0.1);
                    color: #28a745;
                    border: 1px solid rgba(40, 167, 69, 0.2);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    gap: 15px;
                    animation: fadeIn 0.3s ease;
                }

                .loading-container p {
                    color: var(--light-text-secondary, #666666);
                    font-size: 14px;
                }

                .dark-theme .loading-container p {
                    color: var(--dark-text-secondary, #cccccc);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (max-width: 768px) {
                    .tts-form-container {
                        padding: 12px;
                    }

                    .submit-button {
                        padding: 10px 16px;
                        font-size: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .tts-form-container {
                        padding: 10px;
                    }

                    .tts-form {
                        gap: 12px;
                    }

                    .submit-button {
                        padding: 8px 14px;
                        font-size: 14px;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};


export const StudentTeacher = () => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

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
        setFadeOut(true);
        setLoading(true);
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
        <div className="tts-form-container">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {!loading ? (
                <form className={`tts-form ${fadeOut ? "fade-out" : ""}`} onSubmit={handleDouble}>
                    <div className="input-wrapper">
                        <SearchInput value={formData.text} onChange={handleChange} />
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={!formData.text.trim()}
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Processing your request...</p>
                </div>
            )}

            <style jsx>{`
                .tts-form-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 15px;
                }

                .tts-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    width: 100%;
                    transition: opacity 0.3s ease;
                    align-items: center; /* Center the form contents */
                }

                .tts-form.fade-out {
                    opacity: 0.5;
                }

                .input-wrapper {
                    width: 100%;
                }

                .submit-button {
                    background-color: var(--light-accent, #0066cc);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 20px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    align-self: flex-end;
                    margin-top: 10px;
                }

                .dark-theme .submit-button {
                    background-color: var(--dark-accent, #0d84ff);
                }

                .submit-button:hover:not(:disabled) {
                    background-color: var(--light-accent-hover, #0055aa);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .dark-theme .submit-button:hover:not(:disabled) {
                    background-color: var(--dark-accent-hover, #3a9fff);
                }

                .submit-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .alert {
                    padding: 10px 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    font-size: 14px;
                    animation: fadeIn 0.3s ease;
                }

                .alert-error {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                    border: 1px solid rgba(220, 53, 69, 0.2);
                }

                .alert-success {
                    background-color: rgba(40, 167, 69, 0.1);
                    color: #28a745;
                    border: 1px solid rgba(40, 167, 69, 0.2);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    gap: 15px;
                    animation: fadeIn 0.3s ease;
                }

                .loading-container p {
                    color: var(--light-text-secondary, #666666);
                    font-size: 14px;
                }

                .dark-theme .loading-container p {
                    color: var(--dark-text-secondary, #cccccc);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (max-width: 768px) {
                    .tts-form-container {
                        padding: 12px;
                    }

                    .submit-button {
                        padding: 10px 16px;
                        font-size: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .tts-form-container {
                        padding: 10px;
                    }

                    .tts-form {
                        gap: 12px;
                    }

                    .submit-button {
                        padding: 8px 14px;
                        font-size: 14px;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};


