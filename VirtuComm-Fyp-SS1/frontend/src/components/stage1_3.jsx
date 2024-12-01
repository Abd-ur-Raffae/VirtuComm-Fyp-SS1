import { Canvas } from "@react-three/fiber";
import React from 'react';
import { Experience_3 } from "./1.3Experience";



const Project1_3 = () => {
    return (
            <div style={styles.container}>
                <div style={styles.canvasContainer}>
                    <Canvas shadows camera={{ position: [0.8,1, 8],rotation: [0, 0, 0], fov: 35 }}>
                        <color attach="background" args={["#ececec"]} />
                        <Experience_3 />
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

export default Project1_3;