import React, { useState, useEffect } from "react";
import { Single_user_tts } from "./tts";

const ChatScreen = () => {
  const [jsonFile, setJsonData] = useState(null);
  const baseMediaUrl = 'http://localhost:8000/api_tts/media/';
  const jsonFileName = 'metaDataPatches.json';

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
{/* Display the recommendation links */}
<div style={styles.messageContainer}>
  <div style={styles.speaker}>Recommendation Links</div>
  <div style={styles.message}>
    <ul style={styles.list}>
      {jsonFile.recommendation_links.web_links.map((link, index) => (
        <li key={index} style={styles.listItem}>
          <a href={link.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
</div>

        </>
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    width: "390px",
    height: "280px", // Fixed height
    backgroundColor: "rgba(229, 221, 213, 0.2)", // Transparent background
    backdropFilter: "blur(5px)", // Blur effect
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    overflowY: "auto", // Enables scrolling
    borderRadius: "10px", // Optional: Adds rounded corners for a smoother look
  },  

  list: {
    paddingLeft: "20px", // Space for bullets
    margin: "5px 0",
    textAlign: "left", // Ensures left alignment
    listStyleType: "disc", // Standard bullet points
  },

  listItem: {
    marginBottom: "8px", // Space between links
    listStylePosition: "outside", // Ensures bullet is on the first line
    display: "list-item", // Ensures proper list display
  },

  link: {
    textDecoration: "none",
    color: "#007BFF", // Blue color for links
    fontSize: "16px",
    wordBreak: "break-word", // Prevents overflow issues
    display: "inline", // Keeps link text inline
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
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    overflowWrap: "break-word", // Ensures text wraps properly
    whiteSpace: "pre-wrap", // Keeps formatting intact
  },
  
};

export default ChatScreen;
