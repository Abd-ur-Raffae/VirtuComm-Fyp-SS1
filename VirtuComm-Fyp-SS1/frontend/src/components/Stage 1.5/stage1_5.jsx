import { Canvas } from "@react-three/fiber";
import React, { useEffect, useContext, useState } from 'react';
import { Experience_5 } from "./1.5Experience.jsx";
import AudioPlayerWithSubtitles from '../temp.jsx';
import { AudioProvider } from "../AudioContext.js";
import { User_tts } from "../tts.jsx";
import ChatScreen from "../dialogue_display.jsx";
import Button from "../custom elements/stages_head.jsx";
import ConfigButton from "../custom elements/configurations_button.jsx";
import { ThemeContext } from "../custom elements/themeContext.jsx";
import Modal from "../custom elements/modal/modal_popup.tsx";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Project1_5 = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflowX = "hidden"; 
        const checkLoginStatus = async () => {
            try {
              const response = await axios.get('http://localhost:8000/api/check-login/', { withCredentials: true });
              setIsAuthenticated(response.data.isAuthenticated);
              if (!response.data.isAuthenticated) {
                navigate('/login', { state: { from: '/stage1_1' } });
              }
            } catch (error) {
              setIsAuthenticated(false);
              navigate('/login', { state: { from: '/stage1_1' } });
            }
          };
          checkLoginStatus();
        return () => {
            document.body.style.overflowX = "auto"; 
        };
    }, [navigate]);


    if (isAuthenticated === null) {
        return <div>Loading...</div>;
      }
    
      if (!isAuthenticated) {
        return null; 
      }

    return (
        <div style={{ 
            ...styles.container, 
            backgroundImage: `url(${theme === 'dark' ? '/img/dark2.jpg' : '/img/light2.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            <div style={styles.header}>
                <Button />
            </div>
            <AudioProvider>
                <div style={styles.topContainer}>
                    <div style={{ ...styles.canvasContainer, backgroundColor: theme === 'dark' ? 'rgba(32, 60, 81, 0.1)' : 'rgba(164, 217, 243, 0.2)' }}>
                        <Canvas shadows camera={{ position: [0.8,1, 8],rotation: [0, 0, 0], fov: 35 }}>
                            <color attach="background" args={theme === 'dark' ? ["#1E1E1E"] : ["#ececec"]} />
                            <Experience_5 />
                        </Canvas>
                        <div style={styles.subtitleBox}>
                            <AudioPlayerWithSubtitles />
                        </div>
                    </div>
                    <div style={{ ...styles.chatContainer, backgroundColor: theme === 'dark' ? 'rgba(32, 60, 81, 0.1)' : 'rgba(164, 217, 243, 0.2)' }}>
                        <ChatScreen />
                    </div>
                </div>
                <div style={styles.section}>
                    <div style={{ ...styles.tts, backgroundColor: theme === 'dark' ? 'rgba(32, 60, 81, 0.1)' : 'rgba(164, 217, 243, 0.2)' }}>
                        <User_tts />
                    </div>
                    <div style={{ ...styles.config, backgroundColor: theme === 'dark' ? 'rgba(32, 60, 81, 0.1)' : 'rgba(164, 217, 243, 0.2)' }}>
                        <h2 style={{...styles.headingText, color: theme === 'dark' ? 'white' : 'black'}}>Configure your model</h2>
                        <div style={styles.header}>
                            <ConfigButton onClick={() => setIsModalOpen(true)} /> {/* Open modal on click */}
                        </div>
                    </div>
                </div>
            </AudioProvider>
            {/* Modal Component */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Configuration Settings</h2>
                <p>Adjust your settings here.</p>
            </Modal>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center',
        height: '10px',
        marginBottom: '20px',
    },
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        maxHeight: '330px',
        gap: '20px',
        marginBottom: '20px',
    },
    canvasContainer: {
        flex: 2,
        position: 'relative',
        borderRadius: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(1, 28, 74, 0.5) 0px 5px 5px',
        overflow: 'hidden',
        padding: '10px',
        backdropFilter: 'blur(5px)',
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
        borderRadius: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(1, 28, 74, 0.5) 0px 5px 5px',
        padding: '10px',
        backdropFilter: 'blur(10px)',
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
        borderRadius: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(1, 28, 74, 0.5) 0px 5px 5px',
        padding: '10px',
        backdropFilter: 'blur(5px)',
    },
    config: {
        flex: 1.01,
        borderRadius: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(1, 28, 74, 0.5) 0px 5px 5px',
        padding: '10px',
        backdropFilter: 'blur(5px)',
    },
    headingText: {
        marginBottom: '30px',
        fontFamily: 'Arial, Helvetica, sans-serif'
    }
};


export default Project1_5;