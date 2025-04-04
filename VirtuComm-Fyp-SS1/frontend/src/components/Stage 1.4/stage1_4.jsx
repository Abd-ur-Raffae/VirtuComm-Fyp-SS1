import { Canvas } from "@react-three/fiber";
import React from 'react';
import { Experience_4 } from "./1.4Experience.jsx";
import {AudioPlayerWithSubtitles} from '../temp.jsx';
import { AudioProvider } from "../AudioContext.js";
import { User_tts } from "../tts.jsx";
import ChatScreen from "../dialogue_display.jsx";
import { useEffect,useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Project1_4 = () => {

const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        document.body.style.overflowX = "hidden"; 
        const checkLoginStatus = async () => {
            try {
              const response = await axios.get('http://localhost:8000/api/check-login/', { withCredentials: true });
              setIsAuthenticated(response.data.isAuthenticated);
              if (!response.data.isAuthenticated) {
                navigate('/login', { state: { from: '/stage1_4' } });
              }
            } catch (error) {
              setIsAuthenticated(false);
              navigate('/login', { state: { from: '/stage1_4' } });
            }
          };
          checkLoginStatus();
        return () => {
            document.body.style.overflowX = "auto"; // Reset on unmount
        };
    }, [navigate]);
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
      }
    
      if (!isAuthenticated) {
        return null; // Redirect handled by useEffect
      }

    return (
        <div style={styles.container}>
            <AudioProvider>
                <div style={styles.topContainer}>
                    <div style={styles.canvasContainer}>
                        <Canvas shadows camera={{ position: [0.8,1, 8],rotation: [0, 0, 0], fov: 35 }}>
                            <color attach="background" args={["#ececec"]} />
                            <Experience_4 />
                        </Canvas>
                        <div style={styles.subtitleBox}>
                            <AudioPlayerWithSubtitles />
                        </div>
                    </div>
                    <div style={styles.chatContainer}>
                        <ChatScreen />
                    </div>
                </div>
                <div style={styles.section}>
                    <div style={styles.tts}>
                        <User_tts />
                    </div>
                    <div style={styles.config}>
                        <h1>Configurations</h1>
                    </div>
                </div>
            </AudioProvider>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Ensures it takes full screen height
        width: '100vw',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden', // Hide all scrollbars
    },
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        maxHeight: '360px',
        gap: '20px',
        marginBottom: '20px',
    },
    canvasContainer: {
        flex: 2,
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    subtitleBox: {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#c0d6e4',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
    },
    section: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        gap: '20px',
        marginBottom: '20px',
    },
    tts: {
        flex: 1.83,
        flexDirection: 'column',
        backgroundColor: '#c0d6e4',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
    },
    config: {
        flex: 1.01,
        backgroundColor: '#c0d6e4',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
    },
};


export default Project1_4;