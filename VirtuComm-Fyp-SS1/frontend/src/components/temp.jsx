import { useEffect, useState } from "react";
import { useSharedAudio } from "./Stage 1.3/1.3AudioContext";

export const AudioPlayerWithSubtitles = () => {
    const [segments, setSegments] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { audio } = useSharedAudio(); // Get audio from context
    const [currentSubtitleFile, setCurrentSubtitleFile] = useState(null); // Track current subtitle file
    const [loading, setLoading] = useState(false);

    const baseMediaUrl = "http://localhost:8000/api_tts/media/podcast/";

    // Extract the current file index and speaker from the audio source
    useEffect(() => {
        if (!audio || !audio.src) return;

        // Extract the file name from the audio source URL
        const fileName = audio.src.split("/").pop(); // e.g., "003_student.wav"
        const [index, speaker] = fileName.split("_"); // e.g., ["003", "student.wav"]
        const speakerName = speaker.split(".")[0]; // e.g., "student"

        // Construct the subtitle file name
        const subtitleFileName = `${index}_${speakerName}_sub.json`;
        setCurrentSubtitleFile(subtitleFileName); // Set the current subtitle file
    }, [audio]);

    // Fetch subtitles for the current audio file
    useEffect(() => {
        if (!currentSubtitleFile) return;

        const fetchSubtitles = async () => {
            setLoading(true);
            try {
                const timestamp = new Date().getTime(); // Add timestamp to prevent caching
                const response = await fetch(`${baseMediaUrl}${currentSubtitleFile}?t=${timestamp}`);
                const data = await response.json();
                
                if (data?.segments?.length > 0) {
                    setSegments(data.segments);
                    console.log("Subtitles loaded:", data.segments);
                } else {
                    console.error("No segments found in subtitle file!");
                }
            } catch (error) {
                console.error("Error loading subtitle JSON:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSubtitles();
    }, [currentSubtitleFile]);

    // Update subtitles based on audio playback
    useEffect(() => {
        if (!audio) return;

        const interval = setInterval(() => {
            if (!audio.paused) {
                updateSubtitles();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [audio, segments]);

    const updateSubtitles = () => {
        if (!audio || segments.length === 0) return;

        const currentTime = audio.currentTime;
        let foundSegment = false;

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
                foundSegment = true;

                if (currentSegmentIndex !== i) {
                    setCurrentSegmentIndex(i);
                    setCurrentWordIndex(0);
                }

                let newWordIndex = segment.words.findIndex(
                    (word) => currentTime >= word.start_time && currentTime <= word.end_time
                );

                if (newWordIndex !== -1 && newWordIndex !== currentWordIndex) {
                    setCurrentWordIndex(newWordIndex);
                }
                return;
            }
        }

        // If no active segment is found, show "..."
        if (!foundSegment) {
            setCurrentSegmentIndex(-1);
        }
    };

    return (
        <div className="subtitle-wrapper">
            {loading ? (
                <div className="subtitle-loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : currentSegmentIndex === -1 ? (
                <div className="subtitle-placeholder">...</div>
            ) : (
                <div className="subtitle-content">
                    <div className="speaker-name">{segments[currentSegmentIndex]?.speaker}</div>
                    <p className="subtitle-text">
                        {segments[currentSegmentIndex]?.words.map((word, index) => (
                            <span
                                key={index}
                                className={index === currentWordIndex ? "word-active" : "word-normal"}
                            >
                                {word.word}{" "}
                            </span>
                        ))}
                    </p>
                </div>
            )}

            {/* CSS Styles */}
            <style jsx>{`
                .subtitle-wrapper {
                    background-color: rgba(0, 0, 0, 0.6);
                    color: white;
                    border-radius: 8px;
                    padding: 12px 16px;
                    width: 90%;
                    max-width: 600px;
                    margin: 0 auto;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    animation: fadeIn 0.5s ease;
                }

                .subtitle-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 60px;
                }

                .subtitle-placeholder {
                    text-align: center;
                    font-weight: bold;
                    font-size: 18px;
                    opacity: 0.7;
                    padding: 10px 0;
                }

                .subtitle-content {
                    animation: slideInUp 0.3s ease;
                }

                .speaker-name {
                    font-weight: 600;
                    font-size: 15px;
                    margin-bottom: 6px;
                    color: #f0f0f0;
                    text-transform: capitalize;
                }

                .subtitle-text {
                    margin: 5px 0;
                    line-height: 1.5;
                    font-size: 16px;
                    font-weight: 400;
                }

                .word-active {
                    font-weight: 700;
                    color: #ffffff;
                    position: relative;
                }

                .word-active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #ffffff;
                    animation: pulse 1s infinite;
                }

                .word-normal {
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.9);
                }

                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideInUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .subtitle-wrapper {
                        width: 95%;
                        padding: 10px 14px;
                    }

                    .speaker-name {
                        font-size: 14px;
                    }

                    .subtitle-text {
                        font-size: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .subtitle-wrapper {
                        padding: 8px 12px;
                    }

                    .speaker-name {
                        font-size: 13px;
                    }

                    .subtitle-text {
                        font-size: 14px;
                        line-height: 1.4;
                    }
                }
            `}</style>
        </div>
    );
};

export const Subtitles_Stage1_4 = () => {
    const [segments, setSegments] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { audio } = useSharedAudio(); // Get audio from context
    const [currentSubtitleFile, setCurrentSubtitleFile] = useState(null); // Track current subtitle file
    const [loading, setLoading] = useState(false);

    const baseMediaUrl = "http://localhost:8000/api_tts/media/stu_teach/";

    // Extract the current file index and speaker from the audio source
    useEffect(() => {
        if (!audio || !audio.src) return;

        // Extract the file name from the audio source URL
        const fileName = audio.src.split("/").pop(); // e.g., "003_student.wav"
        const [index, speaker] = fileName.split("_"); // e.g., ["003", "student.wav"]
        const speakerName = speaker.split(".")[0]; // e.g., "student"

        // Construct the subtitle file name
        const subtitleFileName = `${index}_${speakerName}_sub.json`;
        setCurrentSubtitleFile(subtitleFileName); // Set the current subtitle file
    }, [audio]);

    // Fetch subtitles for the current audio file
    useEffect(() => {
        if (!currentSubtitleFile) return;

        const fetchSubtitles = async () => {
            setLoading(true);
            try {
                const timestamp = new Date().getTime(); // Add timestamp to prevent caching
                const response = await fetch(`${baseMediaUrl}${currentSubtitleFile}?t=${timestamp}`);
                const data = await response.json();
                
                if (data?.segments?.length > 0) {
                    setSegments(data.segments);
                    console.log("Subtitles loaded:", data.segments);
                } else {
                    console.error("No segments found in subtitle file!");
                }
            } catch (error) {
                console.error("Error loading subtitle JSON:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSubtitles();
    }, [currentSubtitleFile]);

    // Update subtitles based on audio playback
    useEffect(() => {
        if (!audio) return;

        const interval = setInterval(() => {
            if (!audio.paused) {
                updateSubtitles();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [audio, segments]);

    const updateSubtitles = () => {
        if (!audio || segments.length === 0) return;

        const currentTime = audio.currentTime;
        let foundSegment = false;

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
                foundSegment = true;

                if (currentSegmentIndex !== i) {
                    setCurrentSegmentIndex(i);
                    setCurrentWordIndex(0);
                }

                let newWordIndex = segment.words.findIndex(
                    (word) => currentTime >= word.start_time && currentTime <= word.end_time
                );

                if (newWordIndex !== -1 && newWordIndex !== currentWordIndex) {
                    setCurrentWordIndex(newWordIndex);
                }
                return;
            }
        }

        // If no active segment is found, show "..."
        if (!foundSegment) {
            setCurrentSegmentIndex(-1);
        }
    };

    return (
        <div className="subtitle-wrapper">
            {loading ? (
                <div className="subtitle-loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : currentSegmentIndex === -1 ? (
                <div className="subtitle-placeholder">...</div>
            ) : (
                <div className="subtitle-content">
                    <div className="speaker-name">{segments[currentSegmentIndex]?.speaker}</div>
                    <p className="subtitle-text">
                        {segments[currentSegmentIndex]?.words.map((word, index) => (
                            <span
                                key={index}
                                className={index === currentWordIndex ? "word-active" : "word-normal"}
                            >
                                {word.word}{" "}
                            </span>
                        ))}
                    </p>
                </div>
            )}

            {/* CSS Styles */}
            <style jsx>{`
                .subtitle-wrapper {
                    background-color: rgba(0, 0, 0, 0.6);
                    color: white;
                    border-radius: 8px;
                    padding: 12px 16px;
                    width: 90%;
                    max-width: 600px;
                    margin: 0 auto;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    animation: fadeIn 0.5s ease;
                }

                .subtitle-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 60px;
                }

                .subtitle-placeholder {
                    text-align: center;
                    font-weight: bold;
                    font-size: 18px;
                    opacity: 0.7;
                    padding: 10px 0;
                }

                .subtitle-content {
                    animation: slideInUp 0.3s ease;
                }

                .speaker-name {
                    font-weight: 600;
                    font-size: 15px;
                    margin-bottom: 6px;
                    color: #f0f0f0;
                    text-transform: capitalize;
                }

                .subtitle-text {
                    margin: 5px 0;
                    line-height: 1.5;
                    font-size: 16px;
                    font-weight: 400;
                }

                .word-active {
                    font-weight: 700;
                    color: #ffffff;
                    position: relative;
                }

                .word-active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #ffffff;
                    animation: pulse 1s infinite;
                }

                .word-normal {
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.9);
                }

                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideInUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .subtitle-wrapper {
                        width: 95%;
                        padding: 10px 14px;
                    }

                    .speaker-name {
                        font-size: 14px;
                    }

                    .subtitle-text {
                        font-size: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .subtitle-wrapper {
                        padding: 8px 12px;
                    }

                    .speaker-name {
                        font-size: 13px;
                    }

                    .subtitle-text {
                        font-size: 14px;
                        line-height: 1.4;
                    }
                }
            `}</style>
        </div>
    );
};


export const Subtitles_Stage1_5 = () => {
    const [segments, setSegments] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { audio } = useSharedAudio(); // Get audio from context
    const [currentSubtitleFile, setCurrentSubtitleFile] = useState(null); // Track current subtitle file
    const [loading, setLoading] = useState(false);

    const baseMediaUrl = "http://localhost:8000/api_tts/media/interview/";

    // Extract the current file index and speaker from the audio source
    useEffect(() => {
        if (!audio || !audio.src) return;

        // Extract the file name from the audio source URL
        const fileName = audio.src.split("/").pop(); // e.g., "003_student.wav"
        const [index, speaker] = fileName.split("_"); // e.g., ["003", "student.wav"]
        const speakerName = speaker.split(".")[0]; // e.g., "student"

        // Construct the subtitle file name
        const subtitleFileName = `${index}_${speakerName}_sub.json`;
        setCurrentSubtitleFile(subtitleFileName); // Set the current subtitle file
    }, [audio]);

    // Fetch subtitles for the current audio file
    useEffect(() => {
        if (!currentSubtitleFile) return;

        const fetchSubtitles = async () => {
            setLoading(true);
            try {
                const timestamp = new Date().getTime(); // Add timestamp to prevent caching
                const response = await fetch(`${baseMediaUrl}${currentSubtitleFile}?t=${timestamp}`);
                const data = await response.json();
                
                if (data?.segments?.length > 0) {
                    setSegments(data.segments);
                    console.log("Subtitles loaded:", data.segments);
                } else {
                    console.error("No segments found in subtitle file!");
                }
            } catch (error) {
                console.error("Error loading subtitle JSON:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSubtitles();
    }, [currentSubtitleFile]);

    // Update subtitles based on audio playback
    useEffect(() => {
        if (!audio) return;

        const interval = setInterval(() => {
            if (!audio.paused) {
                updateSubtitles();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [audio, segments]);

    const updateSubtitles = () => {
        if (!audio || segments.length === 0) return;

        const currentTime = audio.currentTime;
        let foundSegment = false;

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
                foundSegment = true;

                if (currentSegmentIndex !== i) {
                    setCurrentSegmentIndex(i);
                    setCurrentWordIndex(0);
                }

                let newWordIndex = segment.words.findIndex(
                    (word) => currentTime >= word.start_time && currentTime <= word.end_time
                );

                if (newWordIndex !== -1 && newWordIndex !== currentWordIndex) {
                    setCurrentWordIndex(newWordIndex);
                }
                return;
            }
        }

        // If no active segment is found, show "..."
        if (!foundSegment) {
            setCurrentSegmentIndex(-1);
        }
    };

    return (
        <div className="subtitle-wrapper">
            {loading ? (
                <div className="subtitle-loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : currentSegmentIndex === -1 ? (
                <div className="subtitle-placeholder">...</div>
            ) : (
                <div className="subtitle-content">
                    <div className="speaker-name">{segments[currentSegmentIndex]?.speaker}</div>
                    <p className="subtitle-text">
                        {segments[currentSegmentIndex]?.words.map((word, index) => (
                            <span
                                key={index}
                                className={index === currentWordIndex ? "word-active" : "word-normal"}
                            >
                                {word.word}{" "}
                            </span>
                        ))}
                    </p>
                </div>
            )}

            {/* CSS Styles */}
            <style jsx>{`
                .subtitle-wrapper {
                    background-color: rgba(0, 0, 0, 0.6);
                    color: white;
                    border-radius: 8px;
                    padding: 12px 16px;
                    width: 90%;
                    max-width: 600px;
                    margin: 0 auto;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    animation: fadeIn 0.5s ease;
                }

                .subtitle-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 60px;
                }

                .subtitle-placeholder {
                    text-align: center;
                    font-weight: bold;
                    font-size: 18px;
                    opacity: 0.7;
                    padding: 10px 0;
                }

                .subtitle-content {
                    animation: slideInUp 0.3s ease;
                }

                .speaker-name {
                    font-weight: 600;
                    font-size: 15px;
                    margin-bottom: 6px;
                    color: #f0f0f0;
                    text-transform: capitalize;
                }

                .subtitle-text {
                    margin: 5px 0;
                    line-height: 1.5;
                    font-size: 16px;
                    font-weight: 400;
                }

                .word-active {
                    font-weight: 700;
                    color: #ffffff;
                    position: relative;
                }

                .word-active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #ffffff;
                    animation: pulse 1s infinite;
                }

                .word-normal {
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.9);
                }

                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideInUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .subtitle-wrapper {
                        width: 95%;
                        padding: 10px 14px;
                    }

                    .speaker-name {
                        font-size: 14px;
                    }

                    .subtitle-text {
                        font-size: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .subtitle-wrapper {
                        padding: 8px 12px;
                    }

                    .speaker-name {
                        font-size: 13px;
                    }

                    .subtitle-text {
                        font-size: 14px;
                        line-height: 1.4;
                    }
                }
            `}</style>
        </div>
    );
};


