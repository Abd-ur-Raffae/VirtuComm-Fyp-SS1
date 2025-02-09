import { useState, useEffect } from "react";
import { useSharedAudio } from "./1.3AudioContext"; // Use shared audio

export function useDialogueManager() {
    const { audio, setAudio } = useSharedAudio(); // Get shared audio context
    const [lipsync, setLipSyncData] = useState(null);
    const [jsonFile, setJsonData] = useState(null);

    const baseMediaUrl = "http://localhost:8000/api_tts/media/";
    const jsonFileName = "output_transcription.json";
    const wavFileName = "final_conversation.wav";
    const lipSyncFileName = "final_conversation.json";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const timestamp = new Date().getTime(); // Cache-busting

                // Fetch transcription JSON
                const jsonResponse = await fetch(`${baseMediaUrl}${jsonFileName}?t=${timestamp}`);
                if (!jsonResponse.ok) throw new Error("Failed to fetch JSON file");
                const jsonData = await jsonResponse.json();
                setJsonData(jsonData);

                // Fetch LipSync JSON
                const lipSyncResponse = await fetch(`${baseMediaUrl}${lipSyncFileName}?t=${timestamp}`);
                if (!lipSyncResponse.ok) throw new Error("Failed to fetch LipSync JSON file");
                const lipSyncData = await lipSyncResponse.json();
                setLipSyncData(lipSyncData);

                // Use shared audio instance
                if (!audio) {
                    const newAudio = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
                    setAudio(newAudio); // Store it in context
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, [audio, setAudio]); // Depend on shared audio

    const playAudio = () => {
        if (audio) {
            audio.play().catch((error) => console.error("Play request failed:", error));
        }
    };

    const pauseAudio = () => {
        if (audio) {
            audio.pause();
        }
    };

    const updateLipSync = (currentTime, nodes) => {
        if (!lipsync) return;
    
        const matchSound = {
          A: "viseme_PP",
          B: "viseme_kk",
          C: "viseme_I",
          D: "viseme_AA",
          E: "viseme_O",
          F: "viseme_U",
          G: "viseme_FF",
          H: "viseme_TH",
          X: "viseme_PP",
        };
    
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
        jsonFile,
        audio,
        updateLipSync,
        lipsync,
    };
}
