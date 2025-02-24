import { useEffect, useState } from "react";
import { useSharedAudio } from "./Stage 1.3/1.3AudioContext";

const AudioPlayerWithSubtitles = () => {
    const [segments, setSegments] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { audio } = useSharedAudio(); // Get audio from context
    const [currentSubtitleFile, setCurrentSubtitleFile] = useState(null); // Track current subtitle file

    const baseMediaUrl = "http://localhost:8000/api_tts/media/";

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

        const timestamp = new Date().getTime(); // Add timestamp to prevent caching
        fetch(`${baseMediaUrl}${currentSubtitleFile}?t=${timestamp}`)
            .then((response) => response.json())
            .then((data) => {
                if (data?.segments?.length > 0) {
                    setSegments(data.segments);
                    console.log("Subtitles loaded:", data.segments);
                } else {
                    console.error("No segments found in subtitle file!");
                }
            })
            .catch((error) => console.error("Error loading subtitle JSON:", error));
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
        <div
            style={{
                marginTop: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                fontSize: "14px",
                padding: "10px",
                maxWidth: "80%",
                width: "80%",
                margin: "0 auto",
                wordWrap: "break-word",
                whiteSpace: "normal",
                overflowY: "auto",
                maxHeight: "150px", // Limit height, add scrolling if needed
            }}
        >
            {currentSegmentIndex === -1 ? (
                <strong>...</strong>
            ) : (
                <>
                    <strong>{segments[currentSegmentIndex]?.speaker}:</strong>
                    <p style={{ margin: "5px 0", lineHeight: "1.5" }}>
                        {segments[currentSegmentIndex]?.words.map((word, index) => (
                            <span
                                key={index}
                                style={{ fontWeight: index === currentWordIndex ? "bold" : "normal" }}
                            >
                                {word.word}{" "}
                            </span>
                        ))}
                    </p>
                </>
            )}
        </div>
    );
};

export default AudioPlayerWithSubtitles;