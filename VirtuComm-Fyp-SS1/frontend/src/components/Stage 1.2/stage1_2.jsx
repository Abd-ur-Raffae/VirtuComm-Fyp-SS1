import { Canvas } from "@react-three/fiber";
import React from 'react';
import { Experience_2 } from "./1.2Experience";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Project1_2 = () => {
    return (
            <div style={styles.container}>
                <div style={styles.canvasContainer}>
                    <Canvas shadows camera={{ position: [0, 3, 8], fov: 35 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Experience_2 />
                    </Canvas>
                </div>
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
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh', // Reduced height so footer is visible
    },
    canvasContainer: {
        width: '100%',
        height: '160%', // Keep this to adjust canvas size
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default Project1_2;