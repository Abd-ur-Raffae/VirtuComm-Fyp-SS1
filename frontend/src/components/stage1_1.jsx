import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import React from 'react';

const Project1_1 = () => {
    return (
<div style={styles.container}>
                <div style={styles.canvasContainer}>
                    <Canvas shadows camera={{ position: [0, 3, 8], fov: 35 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Experience />
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
        width: '80%',
        height: '80%', // Keep this to adjust canvas size
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default Project1_1;