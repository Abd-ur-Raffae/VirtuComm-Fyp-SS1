import { useEffect, useRef, useState } from "react";

const AudioPlayerWithSubtitles = () => {
    const [segments, setSegments] = useState([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const audioRef = useRef(null);
    const intervalId = useRef(null);

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
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                startSubtitles();
            }).catch(error => console.error("Play request failed:", error));
        }
    }, [segments]);

    const startSubtitles = () => {
        intervalId.current = setInterval(updateSubtitles, 100);
    };

    const updateSubtitles = () => {
        if (!audioRef.current || segments.length === 0) return;

        const currentTime = audioRef.current.currentTime;

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
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
    };

    const renderSubtitle = () => {
        if (segments.length === 0 || currentSegmentIndex >= segments.length) return "";

        const segment = segments[currentSegmentIndex];
        return (
            <div style={{ textAlign: "left" }}>
                <strong>{segment.speaker}:</strong> {segment.words.map((word, index) => (
                    <span key={index} style={{ fontWeight: index === currentWordIndex ? "bold" : "normal" }}>
                        {word.word} {" "}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div style={{ textAlign: "center" }}>
            <audio ref={audioRef} hidden autoPlay>
                <source src="http://localhost:8000/api_tts/media/final_conversation.wav" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>

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
                {renderSubtitle()}
            </div>
        </div>
    );
};

export default AudioPlayerWithSubtitles;
