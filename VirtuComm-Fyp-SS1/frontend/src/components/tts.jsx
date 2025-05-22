import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchInput from "./custom elements/input.jsx";
import TypeSuggestions from './custom elements/input_2.jsx';

const TtsForm = ({ apiEndpoint }) => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef(null);

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
        setSuccess('');
        setProgress(0);
        setLoading(true);

        progressInterval.current = setInterval(() => {
            setProgress((prev) => {
                if (prev < 95) {
                    return prev + 2;
                } else {
                    return prev;
                }
            });
        }, 1000); // Progresses roughly over ~50 seconds

        try {
            const response = await axios.post(apiEndpoint, formData, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            if (response.status === 201) {
                setSuccess('Text converted to audio successfully!');
                clearInterval(progressInterval.current);
                setProgress(100);

                // Wait 3 seconds, then refresh the page
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setError('Something went wrong. Please try again.');
                clearInterval(progressInterval.current);
                setLoading(false);
            }
        } catch (error) {
            console.error('Submit Error:', error.response || error.message);
            setError('An error occurred while submitting the form.');
            clearInterval(progressInterval.current);
            setLoading(false);
        }
    };

    return (
        <div className="tts-form-container">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {!loading ? (
                <form className="tts-form" onSubmit={handleDouble}>
                    <div className="input-wrapper">
                        <TypeSuggestions value={formData.text} onChange={handleChange} />
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
                <div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p>{progress}%</p>
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
                    align-items: center;
                    width: 100%;
                }

                .input-wrapper {
                    display: flex;
                    width: 230px;
                    justify-content: center;
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
                    align-self: center;
                    margin-top: 10px;
                }

                .submit-button:hover:not(:disabled) {
                    background-color: var(--light-accent-hover, #0055aa);
                    transform: translateY(-2px);
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

                .progress-bar {
                    width: 200px;
                    background-color: #eee;
                    border-radius: 20px;
                    overflow: hidden;
                    height: 8px;
                }

                .progress-fill {
                    background-color: #28a745;
                    height: 100%;
                    width: 0;
                    transition: width 0.5s ease;
                }

                .loading-container p {
                    font-size: 14px;
                    color: var(--light-text-secondary, #666666);
                }
            `}</style>
        </div>
    );
};

export const User_tts = () => {
    return <TtsForm apiEndpoint="http://localhost:8000/api_tts/podcast/" />;
};

export const Interview = () => {
    return <TtsForm apiEndpoint="http://localhost:8000/api_tts/interview/" />;
};

export const StudentTeacher = () => {
    return <TtsForm apiEndpoint="http://localhost:8000/api_tts/TextToAudio/" />;
};
