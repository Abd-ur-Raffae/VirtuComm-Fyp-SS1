import React, { useState, useEffect, useRef } from "react";

const FetchJsonAndWav = () => {
  const [jsonData, setJsonData] = useState(null); // State to hold JSON data
  const [wavFileUrl, setWavFileUrl] = useState(""); // State for WAV file URL
  const [error, setError] = useState(null); // Error handling
  const [currentSegment, setCurrentSegment] = useState(null); // Current segment being displayed
  const [currentWordIndex, setCurrentWordIndex] = useState(-1); // Index of the current word
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing

  const baseMediaUrl = "http://localhost:8000/api_tts/media/"; // Base URL for media files
  const jsonFileName = "output_transcription.json"; // Name of the JSON file
  const wavFileName = "final_conversation.wav"; // Name of the WAV file

  const audioRef = useRef(null); // Ref for the audio element
  const subtitleIntervalRef = useRef(null); // Ref for managing intervals

  useEffect(() => {
    const fetchJsonAndWav = async () => {
      try {
        // Fetch JSON file
        const jsonResponse = await fetch(`${baseMediaUrl}${jsonFileName}`);
        if (!jsonResponse.ok) {
          throw new Error("Failed to fetch JSON file");
        }
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);

        // Set WAV file URL directly
        setWavFileUrl(`${baseMediaUrl}${wavFileName}`);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJsonAndWav();
  }, []);

  const updateSubtitles = () => {
    const audioElement = audioRef.current;
    const currentTime = audioElement.currentTime;

    if (!jsonData || !jsonData.segments) return;

    // Find the current segment
    for (const segment of jsonData.segments) {
      if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
        setCurrentSegment(segment);

        // Find the currently spoken word within the segment
        const wordIndex = segment.words.findIndex(
          (word) =>
            currentTime >= word.start_time && currentTime <= word.end_time
        );
        setCurrentWordIndex(wordIndex);
        return;
      }
    }
    setCurrentSegment(null); // Clear segment when no match
    setCurrentWordIndex(-1); // Reset word index
  };

  const handlePlayPause = () => {
    const audioElement = audioRef.current;

    if (!isPlaying) {
      // Play audio
      audioElement.play();
      if (!subtitleIntervalRef.current) {
        subtitleIntervalRef.current = setInterval(updateSubtitles, 100);
      }
      setIsPlaying(true);
    } else {
      // Pause audio
      audioElement.pause();
      clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    const audioElement = audioRef.current;

    // Stop audio and reset
    audioElement.pause();
    audioElement.currentTime = 0;
    setCurrentSegment(null);
    setCurrentWordIndex(-1);
    clearInterval(subtitleIntervalRef.current);
    subtitleIntervalRef.current = null;
    setIsPlaying(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Audio Player with Synchronized Subtitles</h1>

      {/* Display Errors */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Play/Pause Toggle Button and Reset Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handlePlayPause}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {/* Hidden Audio Player */}
      {wavFileUrl && (
        <audio ref={audioRef} style={{ display: "none" }}>
          <source src={wavFileUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Display Synchronized Subtitles */}
      <div
  style={{
    backgroundColor: "#222",
    color: "#fff",
    padding: "10px",
    fontSize: "24px",
    textAlign: "left", // Align content to the left
    minHeight: "50px",
    borderRadius: "8px",
    maxWidth: "80%",
    margin: "0 auto",
    lineHeight: "50px",
    overflow: "hidden",
    display: "flex", // Use flexbox to align the speaker and text
    alignItems: "center",
  }}
>
  {currentSegment ? (
    <>
      {/* Speaker Name */}
      <div
        style={{
          fontWeight: "bold",
          marginRight: "20px",
          minWidth: "100px", // Reserve space for the speaker's name
        }}
      > 
        {currentSegment.speaker || "Unknown"}:
      </div>

      {/* Subtitle Text */}
      <div>
        {currentSegment.words.map((word, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              margin: "0 5px",
              transform: index === currentWordIndex ? "scale(1.3)" : "scale(1)", // Enlarge the current word
              transformOrigin: "center",
              transition: "transform 0.2s ease-in-out", // Smooth transition
            }}
          >
            {word.word}
          </span>
        ))}
      </div>
    </>
  ) : (
    "..."
  )}
</div>


    </div>
  );
};

export default FetchJsonAndWav;
