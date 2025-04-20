import { Canvas } from "@react-three/fiber";
import React, { useEffect, useContext, useState, useRef } from 'react';
import { Experience_3 } from "./1.3Experience.jsx";
import {AudioPlayerWithSubtitles} from '../temp.jsx';
import { AudioProvider } from "../AudioContext.js";
import { User_tts } from "../tts.jsx";
import { Podcast_links } from "../dialogue_display.jsx";
import Button from "../custom elements/stages_head.jsx";
import { ThemeContext } from "../custom elements/themeContext.jsx";
import Modal from "../custom elements/modal/modal_popup.tsx"; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Project1_3 = () => {
    const { theme } = useContext(ThemeContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    // Close sidebar when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
                !event.target.closest('.sidebar-toggle')) {
                setSidebarVisible(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebarRef]);

    useEffect(() => {
        document.body.style.overflowX = "hidden";
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/check-login/", { withCredentials: true });
                setIsAuthenticated(response.data.isAuthenticated);
                if (!response.data.isAuthenticated) {
                    navigate("/login", { state: { from: "/stage1_1" } });
                }
            } catch (error) {
                setIsAuthenticated(false);
                navigate("/login", { state: { from: "/stage1_1" } });
            }
        };
        checkLoginStatus();
        return () => {
            document.body.style.overflowX = "auto";
        };
    }, [navigate]);

    if (isAuthenticated === null) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div
            className="main-container"
            style={{
                backgroundImage: `url(${theme === "dark" ? "/img/dark2.jpg" : "/img/light2.jpg"})`,
            }}
        >
            {/* Header */}
            <header className="app-header">
                <Button />
            </header>

            <AudioProvider>
                <div className="content-wrapper">
                    {/* Main Content Area */}
                    <div className="main-content-area">
                        {/* Canvas Container - Now Larger */}
                        <div className={`canvas-container ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
                            <Canvas 
                                shadows 
                                camera={{ position: [0.8, 1, 8], rotation: [0, 0, 0], fov: 20 }}
                                className="main-canvas"
                            >
                                <color attach="background" args={theme === "dark" ? ["#1E1E1E"] : ["#f5f5f7"]} />
                                <Experience_3 />
                            </Canvas>
                            <div className="subtitle-container">
                                <AudioPlayerWithSubtitles />
                            </div>
                        </div>

                        {/* TTS Input Area */}
                        <div className={`tts-container ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
                            <User_tts />
                        </div>
                    </div>

                    {/* Sidebar Toggle Button */}
                    <button 
                        className={`sidebar-toggle ${sidebarVisible ? 'active' : ''}`}
                        onClick={toggleSidebar}
                        aria-label="Toggle suggestions"
                    >
                        <span className="toggle-icon">{sidebarVisible ? '›' : '‹'}</span>
                        <span className="toggle-text">Suggestions</span>
                    </button>

                    {/* Collapsible Sidebar */}
                    <div 
                        ref={sidebarRef}
                        className={`sidebar-container ${sidebarVisible ? 'visible' : 'hidden'}`}
                    >
                        <div className="sidebar-header">
                            <h3>Suggested Resources</h3>
                            <button 
                                className="close-sidebar" 
                                onClick={() => setSidebarVisible(false)}
                                aria-label="Close suggestions"
                            >
                                ×
                            </button>
                        </div>
                        <div className="sidebar-content">
                            <Podcast_links />
                        </div>
                    </div>
                </div>
            </AudioProvider>

            {/* Modal Component */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Configuration Settings</h2>
                <p>Adjust your settings here.</p>
            </Modal>

            {/* CSS Styles */}
            <style jsx>{`
                /* Global Styles */
                .main-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100vw;
                    padding: 20px;
                    box-sizing: border-box;
                    overflow: hidden;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                /* Header Styles */
                .app-header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 60px;
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 10;
                }

                /* Content Layout */
                .content-wrapper {
                    display: flex;
                    flex: 1;
                    position: relative;
                    gap: 20px;
                }

                /* Main Content Area */
                .main-content-area {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    gap: 20px;
                    height: calc(100vh - 100px);
                    transition: all 0.3s ease;
                }

                /* Canvas Container - Enhanced */
                .canvas-container {
                    flex: 1;
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
                    transition: all 0.3s ease;
                }

                .canvas-container.dark-theme {
                    background-color: rgba(30, 30, 40, 0.7);
                    border: 1px solid rgba(80, 80, 100, 0.3);
                }

                .canvas-container.light-theme {
                    background-color: rgba(245, 245, 247, 0.7);
                    border: 1px solid rgba(220, 220, 230, 0.5);
                }

                .main-canvas {
                    width: 100% !important;
                    height: 100% !important;
                }

                /* Subtitle Container */
                .subtitle-container {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    z-index: 5;
                }

                /* TTS Container */
                .tts-container {
                    flex: 0.5;
                    border-radius: 12px;
                    padding: 15px;
                    transition: all 0.3s ease;
                }

                .tts-container.dark-theme {
                    background-color: rgba(30, 30, 40, 0.7);
                    border: 1px solid rgba(80, 80, 100, 0.3);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                }

                .tts-container.light-theme {
                    background-color: rgba(245, 245, 247, 0.7);
                    border: 1px solid rgba(220, 220, 230, 0.5);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }

                /* Sidebar Toggle Button */
                .sidebar-toggle {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background: ${theme === "dark" ? "rgba(40, 44, 52, 0.9)" : "rgba(240, 240, 245, 0.9)"};
                    color: ${theme === "dark" ? "#ffffff" : "#333333"};
                    border: none;
                    border-radius: 8px 0 0 8px;
                    padding: 15px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    z-index: 100;
                    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .sidebar-toggle:hover {
                    background: ${theme === "dark" ? "rgba(60, 64, 72, 0.9)" : "rgba(220, 220, 225, 0.9)"};
                }

                .sidebar-toggle.active {
                    right: 600px;
                }

                .toggle-icon {
                    font-size: 24px;
                    margin-right: 5px;
                }

                .toggle-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    transform: rotate(180deg);
                    font-size: 14px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                /* Sidebar Container */
                .sidebar-container {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width:600px;
                    height: 100%;
                    background: ${theme === "dark" ? "rgba(30, 30, 40, 0.9)" : "rgba(245, 245, 247, 0.9)"};
                    border-left: 1px solid ${theme === "dark" ? "rgba(80, 80, 100, 0.3)" : "rgba(220, 220, 230, 0.5)"};
                    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                    z-index: 90;
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    border-radius: 12px 0 0 12px;
                    overflow: hidden;
                }

                .sidebar-container.visible {
                    transform: translateX(0);
                }

                .sidebar-container.hidden {
                    transform: translateX(100%);
                }

                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid ${theme === "dark" ? "rgba(80, 80, 100, 0.3)" : "rgba(220, 220, 230, 0.5)"};
                }

                .sidebar-header h3 {
                    margin: 0;
                    color: ${theme === "dark" ? "#ffffff" : "#333333"};
                    font-size: 18px;
                }

                .close-sidebar {
                    background: none;
                    border: none;
                    color: ${theme === "dark" ? "#ffffff" : "#333333"};
                    font-size: 24px;
                    cursor: pointer;
                }

                .sidebar-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                }

                /* Loading Styles */
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: ${theme === "dark" ? "#1E1E1E" : "#f5f5f7"};
                    color: ${theme === "dark" ? "#ffffff" : "#333333"};
                }

                .loading-spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top: 4px solid ${theme === "dark" ? "#ffffff" : "#333333"};
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .main-container {
                        padding: 15px;
                    }

                    .sidebar-container {
                        width: 280px;
                    }

                    .sidebar-toggle.active {
                        right: 280px;
                    }
                }

                @media (max-width: 768px) {
                    .main-container {
                        padding: 10px;
                    }

                    .content-wrapper {
                        flex-direction: column;
                    }

                    .main-content-area {
                        height: auto;
                    }

                    .canvas-container {
                        height: 50vh;
                    }

                    .sidebar-container {
                        position: fixed;
                        width: 100%;
                        height: 50%;
                        bottom: 0;
                        top: auto;
                        border-radius: 12px 12px 0 0;
                        border-left: none;
                        border-top: 1px solid ${theme === "dark" ? "rgba(80, 80, 100, 0.3)" : "rgba(220, 220, 230, 0.5)"};
                    }

                    .sidebar-container.hidden {
                        transform: translateY(100%);
                    }

                    .sidebar-container.visible {
                        transform: translateY(0);
                    }

                    .sidebar-toggle {
                        right: 50%;
                        top: auto;
                        bottom: 0;
                        transform: translateX(50%);
                        border-radius: 8px 8px 0 0;
                        padding: 10px 15px;
                    }

                    .sidebar-toggle.active {
                        right: 50%;
                        bottom: 50%;
                    }

                    .toggle-text {
                        writing-mode: horizontal-tb;
                        transform: none;
                    }

                    .toggle-icon {
                        transform: rotate(90deg);
                    }
                }

                @media (max-width: 480px) {
                    .app-header {
                        height: 50px;
                        margin-bottom: 10px;
                    }

                    .canvas-container {
                        height: 40vh;
                    }
                }
            `}</style>
        </div>
    );
};

export default Project1_3;
