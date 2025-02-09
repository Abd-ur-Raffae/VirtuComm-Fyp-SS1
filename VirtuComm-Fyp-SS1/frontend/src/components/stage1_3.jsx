import { Canvas } from "@react-three/fiber";
import React from 'react';
import { Experience_3 } from "./1.3Experience";
import AudioPlayerWithSubtitles from './temp.jsx';
import { AudioProvider } from "./AudioContext.js";


const Project1_3 = () => {
    return (
            <div style={styles.container}>
                <AudioProvider>
                <div style={styles.canvasContainer}>
                    <Canvas shadows camera={{ position: [0.8,1, 8],rotation: [0, 0, 0], fov: 35 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Experience_3 />
                    </Canvas>
                </div>

                <div style={styles.section}>
                    <AudioPlayerWithSubtitles />
                </div>
                
                </AudioProvider>
            </div>
    );
};


const styles = {
    header: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
        textAlign: 'center',
    },
    container: {
        display: 'flex',
        flexDirection: 'column', // Arrange items vertically
        justifyContent: 'center',
        alignItems: 'center',
        height: '95vh', // Reduced height so footer is visible
    },
    canvasContainer: {
        width: '100%',
        height: '80%', // Adjust canvas height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        marginTop: '20px', // Add spacing between canvas and section
    },
};


export default Project1_3;