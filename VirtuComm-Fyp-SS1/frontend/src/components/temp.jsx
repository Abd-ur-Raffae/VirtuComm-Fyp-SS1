import { useEffect, useState } from "react";
import { useSharedAudio } from "./1.3AudioContext";

const AudioPlayerWithSubtitles = () => {
    const [segments, setSegments] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { audio } = useSharedAudio(); // Get audio from context

    useEffect(() => {
        fetch("http://localhost:8000/api_tts/media/output_transcription.json")
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
        fontSize: "20px",
        padding: "5px",
        whiteSpace: "nowrap",
        maxWidth: "80%",
        margin: "0 auto",
    }}
>
    {currentSegmentIndex === -1 ? (
        <strong>...</strong>
    ) : (
        <>
            <strong>{segments[currentSegmentIndex]?.speaker}:</strong> 
            {segments[currentSegmentIndex]?.words.map((word, index) => (
                <span key={index} style={{ fontWeight: index === currentWordIndex ? "bold" : "normal" }}>
                    {word.word} {" "}
                </span>
            ))}
        </>
    )}
</div>

    );
};

export default AudioPlayerWithSubtitles;
