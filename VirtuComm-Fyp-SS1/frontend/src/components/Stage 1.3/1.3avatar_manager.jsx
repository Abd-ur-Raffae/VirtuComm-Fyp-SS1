import { useState, useEffect } from "react";
import { useSharedAudio } from "./1.3AudioContext"; // Use shared audio

export function useDialogueManager({ dialogue, isListening, onComplete }) {
    const { audio, setAudio } = useSharedAudio(); // Get shared audio context
    const [lipsync, setLipSyncData] = useState(null);
    const [jsonFile, setJsonData] = useState(null);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speaker, setSpeaker] = useState(null); // Current speaker (student or teacher)

    const baseMediaUrl = "http://localhost:8000/api_tts/media/";

    // Define the updateLipSync function
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

        // Reset all morph targets
        Object.values(matchSound).forEach((value) => {
            nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[value]] = 0;
            nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[value]] = 0;
        });

        // Update morph targets based on the current time
        lipsync.mouthCues.forEach((mouthCue) => {
            if (currentTime >= mouthCue.start && currentTime <= mouthCue.end) {
                nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
                nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
            }
        });
    };

    useEffect(() => {
        const fetchData = async (index) => {
            try {
                const timestamp = new Date().getTime(); // Cache-busting
                const paddedIndex = String(index).padStart(3, '0'); // Pad index to 3 digits (e.g., 000, 001, etc.)

                // Try fetching files for both student and teacher
                const speakers = ["student", "teacher"];
                let jsonData = null;
                let lipSyncData = null;
                let audioFile = null;
                let currentSpeaker = null;

                for (const currentSpeakerCandidate of speakers) {
                    const jsonFileName = `${paddedIndex}_${currentSpeakerCandidate}_sub.json`;
                    const lipSyncFileName = `${paddedIndex}_${currentSpeakerCandidate}_lipsync.json`;
                    const wavFileName = `${paddedIndex}_${currentSpeakerCandidate}.wav`;

                    // Fetch JSON file
                    const jsonResponse = await fetch(`${baseMediaUrl}${jsonFileName}?t=${timestamp}`);
                    if (!jsonResponse.ok) continue; // Skip if file not found

                    // Fetch LipSync file
                    const lipSyncResponse = await fetch(`${baseMediaUrl}${lipSyncFileName}?t=${timestamp}`);
                    if (!lipSyncResponse.ok) continue; // Skip if file not found

                    // Fetch audio file
                    const audioResponse = await fetch(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
                    if (!audioResponse.ok) continue; // Skip if file not found

                    // If all files are found, set the data
                    jsonData = await jsonResponse.json();
                    lipSyncData = await lipSyncResponse.json();
                    audioFile = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
                    currentSpeaker = currentSpeakerCandidate;
                    break; // Exit loop if files are found
                }

                if (!jsonData || !lipSyncData || !audioFile) {
                    // No files found for this index, stop the process
                    console.log("No more files found. Dialogue complete.");
                    onComplete?.(); // Trigger onComplete callback
                    return;
                }

                // Set the data
                setJsonData(jsonData);
                setLipSyncData(lipSyncData);
                setAudio(audioFile);
                setSpeaker(currentSpeaker);

                // Play the audio automatically when it's loaded
                audioFile.onloadeddata = () => {
                    audioFile.play().catch((error) => console.error("Play request failed:", error));
                    setIsPlaying(true);
                };

                // When the audio ends, move to the next dialogue
                audioFile.onended = () => {
                    setIsPlaying(false);
                    setCurrentDialogueIndex((prevIndex) => prevIndex + 1); // Move to the next index
                };

            } catch (error) {
                console.error(error.message);
                // If an error occurs, skip to the next index
                setCurrentDialogueIndex((prevIndex) => prevIndex + 1);
            }
        };

        fetchData(currentDialogueIndex);
    }, [currentDialogueIndex, setAudio, onComplete]); 

    return {
        playAudio: () => setIsPlaying(true),
        pauseAudio: () => setIsPlaying(false),
        updateLipSync, // Return the updateLipSync function
        jsonFile,
        audio,
        lipsync,
        isPlaying,
        speaker,
    };
}