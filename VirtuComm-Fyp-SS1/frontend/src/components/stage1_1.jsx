import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import React from 'react';
import FetchJsonAndWav from './ghar.jsx';

const Project1_1 = () => {
    return (
        <>
       
        <div style={styles.container}>
        
            
            <div style={styles.canvasContainer}>
           
                <Canvas shadows camera={{ position: [0, 3, 8], fov: 35 }}>
                    <color attach="background" args={["#ececec"]} />
                    <Experience />
                </Canvas>
            </div>
          
            <div style={styles.section}>
                <FetchJsonAndWav />

            </div>
        </div>
        
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw', // Full screen width
      marginTop: '20px',
    },
    canvasContainer: {
       
        width: '100vw', 
        height: '100vh', 
        flex: '0 0 auto', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #ccc', // Optional debugging
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
