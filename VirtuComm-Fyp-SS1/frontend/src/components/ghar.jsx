import React, { useState, useEffect, useRef } from "react";
import { useAudio } from './AudioContext';

export const FetchJsonAndWav = () => {
  const { audioPlaying, audioRef, subtitleData, setSubtitleData } = useAudio();
  const [currentSegment, setCurrentSegment] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const subtitleIntervalRef = useRef(null);

  // Fetch JSON Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const jsonResponse = await fetch(`http://localhost:8000/api_tts/media/output_transcription.json?timestamp=${timestamp}`);
        if (!jsonResponse.ok) {
          throw new Error("Failed to fetch JSON file");
        }
        const jsonData = await jsonResponse.json();
        setSubtitleData(jsonData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [setSubtitleData]);

  // Update Subtitles Logic
  const updateSubtitles = () => {
    if (!audioRef.current || !subtitleData || !subtitleData.segments) return;
    const currentTime = audioRef.current.currentTime;

    for (const segment of subtitleData.segments) {
      if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
        setCurrentSegment(segment);

        const wordIndex = segment.words.findIndex(
          (word) => currentTime >= word.start_time && currentTime <= word.end_time
        );
        setCurrentWordIndex(wordIndex);
        return;
      }
    }

    // Clear segment if no match
    setCurrentSegment(null);
    setCurrentWordIndex(-1);
  };

  // Handle Audio Playback and Interval
  useEffect(() => {
    if (audioPlaying) {
      subtitleIntervalRef.current = setInterval(updateSubtitles, 100);
    } else {
      clearInterval(subtitleIntervalRef.current);
    }

    // Cleanup on unmount or audioPlaying change
    return () => clearInterval(subtitleIntervalRef.current);
  }, [audioPlaying, subtitleData]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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


export const FetchJsonAndWavSingle = () => {
  const { audioPlaying,audioRef, subtitleData, setSubtitleData } = useAudio(); 
  //const [jsonData, setJsonData] = useState(null);
  // const [error, setError] = useState(null); 
  const [currentSegment, setCurrentSegment] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1); 
  //const [isPlaying, setIsPlaying] = useState(false); 

  // const baseMediaUrl = "http://localhost:8000/api_tts/media/"; 
  // const jsonFileName = "output_transcription.json";
  // const wavFileName = "final_conversation.wav"; 

   //const audioRef = useRef(null); 
   //const subtitleIntervalRef = useRef(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const jsonResponse = await fetch(`http://localhost:8000/api_tts/media/output_transcription_single.json?timestamp=${timestamp}`);
        //const jsonResponse = await fetch(`${baseMediaUrl}${jsonFileName}`);
        if (!jsonResponse.ok) {
          throw new Error("Failed to fetch JSON file");
        }
        const jsonData = await jsonResponse.json();
        setSubtitleData(jsonData);

      //  setWavFileUrl(`${baseMediaUrl}${wavFileName}`);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [setSubtitleData]);
  let subtitleInterval = null;

  const updateSubtitles = () => {
    // const audioElement = audioRef.current;
    // const currentTime = audioElement.currentTime;

    if (!audioRef.current || !subtitleData || !subtitleData.segments) return;
const currentTime = audioRef.current.currentTime;
    for (const segment of subtitleData.segments) {
      if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
        setCurrentSegment(segment);

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
if (audioPlaying) {
    subtitleInterval = setInterval(updateSubtitles, 100);
  } else if (subtitleInterval) {
    clearInterval(subtitleInterval);
  }
  // const handlePlayPause = () => {
  //   const audioElement = audioRef.current;

  //   if (!isPlaying) {
  //     // Play audio
  //     audioElement.play();
  //     if (!subtitleIntervalRef.current) {
  //       subtitleIntervalRef.current = setInterval(updateSubtitles, 100);
  //     }
  //     setIsPlaying(true);
  //   } else {
  //     // Pause audio
  //     audioElement.pause();
  //     clearInterval(subtitleIntervalRef.current);
  //     subtitleIntervalRef.current = null;
  //     setIsPlaying(false);
  //   }
  // };

  // const handleReset = () => {
  //   const audioElement = audioRef.current;

  //   // Stop audio and reset
  //   audioElement.pause();
  //   audioElement.currentTime = 0;
  //   setCurrentSegment(null);
  //   setCurrentWordIndex(-1);
  //   clearInterval(subtitleIntervalRef.current);
  //   subtitleIntervalRef.current = null;
  //   setIsPlaying(false);
  // };

  return (
     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      

      {/* Display Errors
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

     
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
      </div> */}

      {/* Hidden Audio Player
      {wavFileUrl && (
        <audio ref={audioRef} style={{ display: "none" }}>
          <source src={wavFileUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )} */}

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