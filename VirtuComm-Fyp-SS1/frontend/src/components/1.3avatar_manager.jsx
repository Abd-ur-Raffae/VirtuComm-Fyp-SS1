// DialogueManager.js
import { useState, useEffect, useRef } from 'react';


export function DialogueManager({ isListening, }) {
  const [audio, setAudio] = useState(null);
  const [lipsync, setLipSyncData] = useState(null);
  const [jsonFile, setJsonData] = useState(null);
  
  const [avatar1Listening, setAvatar1Listening] = useState(false);
  const [avatar2Listening, setAvatar2Listening] = useState(false);

  const audioElement = useRef(null);

  const baseMediaUrl = 'http://localhost:8000/api_tts/media/';
  const jsonFileName = 'output_transcription.json';
  const wavFileName = 'final_conversation.wav';
  const lipSyncFileName = 'final_conversation.json';

  // Fetch data for audio, lip-sync, and transcription JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime(); // Cache-busting

        // Fetch transcription JSON
        const jsonResponse = await fetch(`${baseMediaUrl}${jsonFileName}?t=${timestamp}`);
        if (!jsonResponse.ok) throw new Error('Failed to fetch JSON file');
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);

        // Fetch LipSync JSON
        const lipSyncResponse = await fetch(`${baseMediaUrl}${lipSyncFileName}?t=${timestamp}`);
        if (!lipSyncResponse.ok) throw new Error('Failed to fetch LipSync JSON file');
        const lipSyncData = await lipSyncResponse.json();
        setLipSyncData(lipSyncData);

        // Load and set WAV audio
        audioElement.current = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
        setAudio(audioElement.current);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const playAudio = () => {
    if (audioElement.current) audioElement.current.play();
  };

  const pauseAudio = () => {
    if (audioElement.current) audioElement.current.pause();
  };

  // LipSync logic
  const matchSound = {
    A: 'viseme_PP',
    B: 'viseme_kk',
    C: 'viseme_I',
    D: 'viseme_AA',
    E: 'viseme_O',
    F: 'viseme_U',
    G: 'viseme_FF',
    H: 'viseme_TH',
    X: 'viseme_PP',
  };

  const updateLipSync = (currentTime, nodes) => {
    if (!lipsync) return;

    Object.values(matchSound).forEach((value) => {
      nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
    });

    lipsync.mouthCues.forEach((mouthCue) => {
      if (currentTime >= mouthCue.start && currentTime <= mouthCue.end) {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
      }
    });
  };

  return {
    playAudio,
    pauseAudio,
    updateLipSync,
    jsonFile,
    audio,
    lipsync,
  };
}
