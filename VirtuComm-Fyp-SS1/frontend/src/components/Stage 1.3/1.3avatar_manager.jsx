import { useState, useEffect, useRef } from "react";
import { useSharedAudio } from "./1.3AudioContext"; // Use shared audio

// Create a singleton instance to track if audio is already being managed
// and to share data between avatar instances
const audioManagerState = {
    isAudioBeingManaged: false,
    currentManager: null,
    // Add shared state for all avatars
    sharedData: {
        jsonFile: null,
        lipsync: null,
        isPlaying: false,
        speaker: null,
        audio: null
    }
};

export function useDialogueManager({ dialogue, isListening, onComplete, avatarType }) {
    const { audio, setAudio } = useSharedAudio(); // Get shared audio context
    const [lipsync, setLipSyncData] = useState(null);
    const [jsonFile, setJsonData] = useState(null);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speaker, setSpeaker] = useState(null); // Current speaker (student or teacher)
    const instanceId = useRef(Math.random().toString(36).substring(7)); // Generate unique ID for this instance

    const baseMediaUrl = "http://localhost:8000/api_tts/media/podcast/";

    // Define the updateLipSync function
    const updateLipSync = (currentTime, nodes) => {
        // Use local lipsync data or shared lipsync data
        const lipSyncData = lipsync || audioManagerState.sharedData.lipsync;
        if (!lipSyncData) return;

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
        lipSyncData.mouthCues.forEach((mouthCue) => {
            if (currentTime >= mouthCue.start && currentTime <= mouthCue.end) {
                nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
                nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
            }
        });
    };

    // Effect to sync local state with shared state for non-manager avatars
    useEffect(() => {
        // If this instance is not the manager, sync with shared state
        if (audioManagerState.currentManager !== instanceId.current) {
            const syncInterval = setInterval(() => {
                setJsonData(audioManagerState.sharedData.jsonFile);
                setLipSyncData(audioManagerState.sharedData.lipsync);
                setIsPlaying(audioManagerState.sharedData.isPlaying);
                setSpeaker(audioManagerState.sharedData.speaker);
            }, 100); // Check for updates every 100ms
            
            return () => clearInterval(syncInterval);
        }
    }, []);

    // Set this instance as the current manager when component mounts
    useEffect(() => {
        // If this is the first avatar (guest/student), it will manage audio
        // If this is the second avatar (host/teacher), it will only manage audio if it's not already being managed
        const shouldManageAudio = avatarType === 'guest' || (!audioManagerState.isAudioBeingManaged);
        
        if (shouldManageAudio) {
            audioManagerState.isAudioBeingManaged = true;
            audioManagerState.currentManager = instanceId.current;
            
            return () => {
                // Clean up when this component unmounts
                if (audioManagerState.currentManager === instanceId.current) {
                    audioManagerState.isAudioBeingManaged = false;
                    audioManagerState.currentManager = null;
                    // Clear shared data
                    audioManagerState.sharedData = {
                        jsonFile: null,
                        lipsync: null,
                        isPlaying: false,
                        speaker: null,
                        audio: null
                    };
                }
            };
        }
    }, [avatarType]);

    // Effect to update shared state when local state changes (for manager avatar)
    useEffect(() => {
        if (audioManagerState.currentManager === instanceId.current) {
            audioManagerState.sharedData.jsonFile = jsonFile;
            audioManagerState.sharedData.lipsync = lipsync;
            audioManagerState.sharedData.isPlaying = isPlaying;
            audioManagerState.sharedData.speaker = speaker;
            audioManagerState.sharedData.audio = audio;
        }
    }, [jsonFile, lipsync, isPlaying, speaker, audio]);

    useEffect(() => {
        // Only fetch and play audio if this instance is the current manager
        if (audioManagerState.currentManager !== instanceId.current) {
            return; // Skip audio fetching and playing for non-manager instances
        }

        const fetchData = async (index) => {
            try {
                const timestamp = new Date().getTime(); // Cache-busting
                const paddedIndex = String(index).padStart(3, '0'); // Pad index to 3 digits (e.g., 000, 001, etc.)

                // Try fetching files for both student and teacher
                const speakers = ["guest", "host"];
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
        jsonFile: jsonFile || audioManagerState.sharedData.jsonFile, // Use local or shared data
        audio: audio || audioManagerState.sharedData.audio, // Use local or shared data
        lipsync: lipsync || audioManagerState.sharedData.lipsync, // Use local or shared data
        isPlaying: isPlaying || audioManagerState.sharedData.isPlaying, // Use local or shared data
        speaker: speaker || audioManagerState.sharedData.speaker, // Use local or shared data
    };
}
