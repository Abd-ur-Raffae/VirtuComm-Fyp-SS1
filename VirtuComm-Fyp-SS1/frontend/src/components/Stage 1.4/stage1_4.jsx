import { Canvas } from "@react-three/fiber";
import React, { useEffect, useContext, useState } from 'react';
import { Experience_4 } from "./1.4Experience.jsx";
import {Subtitles_Stage1_4} from '../temp.jsx';
import { AudioProvider } from "../AudioContext.js";
import { StudentTeacher } from "../tts.jsx";
import { Stu_teach_links } from "../dialogue_display.jsx";
import Button from "../custom elements/stages_head.jsx";
import { ThemeContext } from "../custom elements/themeContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../custom elements/modal/modal_popup.tsx";


const Project1_4 = () => {
    const { theme } = useContext(ThemeContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

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
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div
            style={{
                ...styles.container,
                backgroundImage: `url(${theme === "dark" ? "/img/dark2.jpg" : "/img/light2.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div style={styles.header}>
                <Button />
            </div>

            <AudioProvider>
                <div style={styles.mainContent}>
                    {/* Left side (Canvas + Section) */}
                    <div style={styles.leftContainer}>
                        <div style={{ ...styles.canvasContainer, backgroundColor: theme === "dark" ? "rgba(32, 60, 81, 0.1)" : "rgba(164, 217, 243, 0.2)" }}>
                            <Canvas shadows camera={{ position: [0.8, 1, 8], rotation: [0, 0, 0], fov: 35 }}>
                                <color attach="background" args={theme === "dark" ? ["#1E1E1E"] : ["#ececec"]} />
                                <Experience_4 />
                            </Canvas>
                            <div style={styles.subtitleBox}>
                                <Subtitles_Stage1_4 />
                            </div>
                        </div>

                        <div style={{ ...styles.tts, backgroundColor: theme === "dark" ? "rgba(32, 60, 81, 0.1)" : "rgba(164, 217, 243, 0.2)" }}>
                            <StudentTeacher />
                        </div>
                    </div>

                    {/* Right side (ChatScreen) */}
                    <div style={styles.rightContainer}>
                        <Stu_teach_links />
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
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
    },
    header: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "10px",
        marginBottom: "20px",
    },
    mainContent: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        gap: "20px",
        marginBottom: "20px",
    },
    leftContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 2,
        gap: "20px",
        height:"100%",
    },
    canvasContainer: {
        flex: 1,
        position: "relative",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(1, 28, 74, 0.5) 0px 5px 5px",
        overflow: "hidden",
        padding: "10px",
        backdropFilter: "blur(5px)",
    },
    subtitleBox: {
        position: "absolute",
        bottom: "10px",
        left: "10px",
        right: "10px",
        padding: "10px",
        borderRadius: "5px",
        textAlign: "center",
    },
    tts: {
        flex: 0.7,
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(1, 28, 74, 0.5) 0px 5px 5px",
        padding: "10px",
        backdropFilter: "blur(5px)",
    },
    rightContainer: {
        flex: 1,
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(1, 28, 74, 0.5) 0px 5px 5px",
        padding: "10px",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        height: "460px",
    },
};

export default Project1_4;
