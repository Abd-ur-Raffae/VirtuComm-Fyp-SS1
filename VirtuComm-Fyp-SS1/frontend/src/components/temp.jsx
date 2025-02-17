import { useEffect, useState } from "react";
import { useSharedAudio } from "./Stage 1.3/1.3AudioContext";

const AudioPlayerWithSubtitles = () => {
    const [segments, setSegments] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { audio } = useSharedAudio(); // Get audio from context

    useEffect(() => {
        const timestamp = new Date().getTime(); // Add timestamp to prevent caching
        fetch(`http://localhost:8000/api_tts/media/output_transcription.json?t=${timestamp}`)
            .then(response => response.json())
            .then(data => {
                if (data?.segments?.length > 0) {
                    setSegments(data.segments);
                    console.log("Segments loaded:", data.segments);
                } else {
                    console.error("No segments found!");
                }
            })
            .catch(error => console.error("Error loading subtitle JSON:", error));
    }, []);
    

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
                    word => currentTime >= word.start_time && currentTime <= word.end_time
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
                    <span key={index} style={{ fontWeight: index === currentWordIndex ? "bold" : "normal" }}>
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
