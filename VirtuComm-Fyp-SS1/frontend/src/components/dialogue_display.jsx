import React, { useState, useEffect } from "react";
import { Single_user_tts } from "./tts";

const ChatScreen = () => {
  const [jsonFile, setJsonData] = useState(null);
  const baseMediaUrl = 'http://localhost:8000/api_tts/media/';
  const jsonFileName = 'metaDataSingle.json';

  // Fetch data for audio, lip-sync, and transcription JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime(); // Cache-busting

        // Fetch transcription JSON
        const jsonResponse = await fetch(`${baseMediaUrl}${jsonFileName}?t=${timestamp}`);
        if (!jsonResponse.ok) throw new Error('Failed to fetch JSON file');
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);

      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.chatContainer}>
      {jsonFile && (
        <>
        {/* Display the user message */}
          <div style={styles.messageContainer}>
            <div style={styles.speaker}>Me</div>
            <div style={styles.message}>{jsonFile.prompt}</div>
          </div>
          <div style={styles.messageContainer}>
            <div style={styles.speaker}>{jsonFile.speaker}</div>
            <div style={styles.message}>{jsonFile.text}</div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5ddd5",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    overflowY: "auto",
  },
  messageContainer: {
    margin: "10px 0",
  },
  speaker: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#555",
  },
  message: {
    maxWidth: "75%",
    padding: "12px",
    borderRadius: "10px",
    margin: "6px",
    fontSize: "16px",
    wordWrap: "break-word",
    boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
    backgroundColor: "#fff",
  },
};

export default ChatScreen;
