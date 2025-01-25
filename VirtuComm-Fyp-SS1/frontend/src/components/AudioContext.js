// AudioContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioPlaying, setAudioPlaying] = useState(false); 
  const audioRef = useRef(null); 
  const [subtitleData, setSubtitleData] = useState(null); 

  return (
    <AudioContext.Provider
      value={{
        audioPlaying,
        setAudioPlaying,
        audioRef,
        subtitleData,
        setSubtitleData,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
