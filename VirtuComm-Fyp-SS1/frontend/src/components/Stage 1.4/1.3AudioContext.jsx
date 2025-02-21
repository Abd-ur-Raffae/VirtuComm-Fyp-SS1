import { createContext, useContext, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [audio, setAudio] = useState(null);

    return (
        <AudioContext.Provider value={{ audio, setAudio }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useSharedAudio = () => useContext(AudioContext);
