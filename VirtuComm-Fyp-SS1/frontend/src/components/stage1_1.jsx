import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import React, { useEffect } from 'react';
import { FetchJsonAndWavSingle } from './ghar.jsx';
import { AudioProvider } from "./AudioContext.js";
import { Single_user_tts } from './tts.jsx';
import ChatScreen from './dialogue_display.jsx';

const Project1_1 = () => {
    useEffect(() => {
        // Handle any side effects if needed
    }, []);

    return (
        <div style={styles.container}>
            <AudioProvider>
                <div style={styles.topContainer}>
                    <div style={styles.canvasContainer}>
                        <Canvas shadows camera={{ position: [0, 3, 8], fov: 35 }}>
                            <color attach="background" args={["#ececec"]} />
                            <Experience />
                        </Canvas>
                        <div style={styles.subtitleBox}>
                            <FetchJsonAndWavSingle />
                        </div>
                    </div>
                    <div style={styles.chatContainer}>
                        <ChatScreen />
                    </div>
                </div>
                <div style={styles.section}>
                    <Single_user_tts />
                </div>
            </AudioProvider>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        boxSizing: 'border-box',
    },
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        gap: '20px',
        marginBottom: '20px',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
        },
    },
    canvasContainer: {
        flex: 2,
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        '@media (max-width: 768px)': {
            flex: 1,
        },
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
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        overflowY: 'auto', // Allow vertical scrolling
        overflowX: 'hidden', // Prevent horizontal scrolling
        '@media (max-width: 768px)': {
            flex: 1,
        },
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        marginTop: '10px',
    },
};

export default Project1_1;
