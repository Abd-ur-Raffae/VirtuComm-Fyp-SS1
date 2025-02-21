import { useState, useEffect } from "react";
import { useSharedAudio } from "../Stage 1.3/1.3AudioContext"; 

export function useDialogueManager() {
    const { audio, setAudio } = useSharedAudio(); 
    const [lipsync, setLipSyncData] = useState(null);
    const [jsonFile, setJsonData] = useState(null);

    const baseMediaUrl = "http://localhost:8000/api_tts/media/";
    const jsonFileName = "output_transcription.json";
    const wavFileName = "final_conversation.wav";
    const lipSyncFileName = "final_conversation.json";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const timestamp = new Date().getTime(); 

              
                const jsonResponse = await fetch(`${baseMediaUrl}${jsonFileName}?t=${timestamp}`);
                if (!jsonResponse.ok) throw new Error("Failed to fetch JSON file");
                const jsonData = await jsonResponse.json();
                setJsonData(jsonData);

               
                const lipSyncResponse = await fetch(`${baseMediaUrl}${lipSyncFileName}?t=${timestamp}`);
                if (!lipSyncResponse.ok) throw new Error("Failed to fetch LipSync JSON file");
                const lipSyncData = await lipSyncResponse.json();
                setLipSyncData(lipSyncData);

             
                if (!audio) {
                    const newAudio = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
                    setAudio(newAudio); 
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
            A: 'aa',
            B: 'kk',
            C: 'ih',
            D: 'CH',
            E: 'E',
            F: 'FF',
            G: 'RR', 
            H: 'TH',
            I: 'ih', 
            J: 'CH', 
            K: 'kk',
            L: 'RR', 
            M: 'PP', 
            N: 'nn',
            O: 'oh',
            P: 'PP',
            Q: 'kk', 
            R: 'RR',
            S: 'SS',
            T: 'TH', 
            U: 'ou', 
            V: 'FF', 
            W: 'ou',
            X: 'SS',
            Y: 'ih',
            Z: 'SS', 
          };
          
        Object.values(matchSound).forEach((value) => {
          nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[value]] = 0;
          nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[value]] = 0;
        });
    
        lipsync.mouthCues.forEach((mouthCue) => {
          if (currentTime >= mouthCue.start && currentTime <= mouthCue.end) {
            nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
            nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
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
