import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User_tts = () => {
    const [formData, setFormData] = useState({
        text: '',
        
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/api_tts/TextToAudio/', formData, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken,  // Include CSRF token in the headers
                },
            });
        } catch(error) {
        console.log('Ghar jao')
    }


        // try {
        //     const response = await axios.post('http://localhost:8000/api_tts/TextToAudio/', formData, {
        //         withCredentials: true,
        //         headers: {
        //             'X-CSRFToken': csrfToken,  // Include CSRF token in the headers
        //         },
        //     });

        //     if (response.status === 201) {
        //         console.log('User registered and logged in:', response.data);
        //         navigate('/home'); 
        //     }
        // } catch (error) {
        //     if (error.response && error.response.data) {
        //         setError(error.response.data.error || 'Registration failed. Please try again.');
        //         console.error('Registration error:', error.response.data);
        //     } else {
        //         setError('Network error. Please try again later.');
        //         console.error('Network error:', error);
        //     }
        // }
};

    return (
        <div className="container">
            <link rel="stylesheet" href="/css/RegisterPage.css" />
            <h2>Text</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="text">Text:</label>
                <input
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};


export default User_tts;