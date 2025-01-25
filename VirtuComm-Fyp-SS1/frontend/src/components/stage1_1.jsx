import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import React from 'react';
import { FetchJsonAndWavSingle } from './ghar.jsx';
import { AudioProvider } from "./AudioContext.js";
import { Single_user_tts } from './tts.jsx';

const Project1_1 = () => {
    return (
        
       
        <div style={styles.container}>
        <AudioProvider>
            
            <div style={styles.canvasContainer}>
           
                <Canvas shadows camera={{ position: [0, 3, 8], fov: 35 }}>
                    <color attach="background" args={["#ececec"]} />
                    <Experience />
                </Canvas>
            </div>
          
            <div style={styles.section}>
                <FetchJsonAndWavSingle />
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
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        width: '100vw',
      marginTop: '20px',
    },
    canvasContainer: {
       
        width: '100%', 
        height: '90%', 
        flex: '0 0 auto', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #ccc',
    },
    section: {
        
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
    },
};

export default Project1_1;