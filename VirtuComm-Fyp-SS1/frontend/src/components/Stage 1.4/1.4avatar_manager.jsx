import { useState, useEffect, useRef } from "react";
import { useSharedAudio } from "../Stage 1.3/1.3AudioContext"; // Use shared audio

// Shared singleton manager for syncing audio state
const audioManagerState = {
    isAudioBeingManaged: false,
    currentManager: null,
    sharedData: {
        jsonFile: null,
        lipsync: null,
        isPlaying: false,
        speaker: null,
        audio: null
    }
};

export function useDialogueManager({ dialogue, isListening, onComplete, avatarType }) {
    const { audio, setAudio } = useSharedAudio(); // Shared audio context
    const [lipsync, setLipSyncData] = useState(null);
    const [jsonFile, setJsonData] = useState(null);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speaker, setSpeaker] = useState(null); // host or guest
    const instanceId = useRef(Math.random().toString(36).substring(7)); // Unique instance ID

    const baseMediaUrl = "http://localhost:8000/api_tts/media/stu_teach/";

    const updateLipSync = (currentTime, nodes) => {
        const lipSyncData = lipsync || audioManagerState.sharedData.lipsync;
        if (!lipSyncData) return;

        const matchSound = {
            A: 'aa', B: 'kk', C: 'ih', D: 'CH', E: 'E', F: 'FF', G: 'RR',
            H: 'TH', I: 'ih', J: 'CH', K: 'kk', L: 'RR', M: 'PP', N: 'nn',
            O: 'oh', P: 'PP', Q: 'kk', R: 'RR', S: 'SS', T: 'TH', U: 'ou',
            V: 'FF', W: 'ou', X: 'SS', Y: 'ih', Z: 'SS',
        };

        Object.values(matchSound).forEach((value) => {
            nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[value]] = 0;
            nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[value]] = 0;
        });

        lipSyncData.mouthCues.forEach((mouthCue) => {
            if (currentTime >= mouthCue.start && currentTime <= mouthCue.end) {
                nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
                nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[matchSound[mouthCue.value]]] = 1;
            }
        });
    };

    // Sync shared state for non-manager avatars
    useEffect(() => {
        if (audioManagerState.currentManager !== instanceId.current) {
            const syncInterval = setInterval(() => {
                setJsonData(audioManagerState.sharedData.jsonFile);
                setLipSyncData(audioManagerState.sharedData.lipsync);
                setIsPlaying(audioManagerState.sharedData.isPlaying);
                setSpeaker(audioManagerState.sharedData.speaker);
            }, 100);
            return () => clearInterval(syncInterval);
        }
    }, []);

    // Assign manager role on mount
    useEffect(() => {
        const shouldManageAudio = avatarType === 'student' || !audioManagerState.isAudioBeingManaged;

        if (shouldManageAudio) {
            audioManagerState.isAudioBeingManaged = true;
            audioManagerState.currentManager = instanceId.current;

            return () => {
                if (audioManagerState.currentManager === instanceId.current) {
                    audioManagerState.isAudioBeingManaged = false;
                    audioManagerState.currentManager = null;
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

    // Update shared state when local state changes (if manager)
    useEffect(() => {
        if (audioManagerState.currentManager === instanceId.current) {
            audioManagerState.sharedData.jsonFile = jsonFile;
            audioManagerState.sharedData.lipsync = lipsync;
            audioManagerState.sharedData.isPlaying = isPlaying;
            audioManagerState.sharedData.speaker = speaker;
            audioManagerState.sharedData.audio = audio;
        }
    }, [jsonFile, lipsync, isPlaying, speaker, audio]);

    // Fetch and play audio for current dialogue index
    useEffect(() => {
        if (audioManagerState.currentManager !== instanceId.current) return;

        const fetchData = async (index) => {
            try {
                const paddedIndex = String(index).padStart(3, '0');
                const timestamp = new Date().getTime();
                const currentSpeaker = index % 2 === 0 ? "student" : "teacher";

                const jsonFileName = `${paddedIndex}_${currentSpeaker}_sub.json`;
                const lipSyncFileName = `${paddedIndex}_${currentSpeaker}_lipsync.json`;
                const wavFileName = `${paddedIndex}_${currentSpeaker}.wav`;

                const [jsonResponse, lipSyncResponse, audioResponse] = await Promise.all([
                    fetch(`${baseMediaUrl}${jsonFileName}?t=${timestamp}`),
                    fetch(`${baseMediaUrl}${lipSyncFileName}?t=${timestamp}`),
                    fetch(`${baseMediaUrl}${wavFileName}?t=${timestamp}`)
                ]);

                if (!jsonResponse.ok || !lipSyncResponse.ok || !audioResponse.ok) {
                    console.log("No more files found or one of the required files is missing.");
                    onComplete?.();
                    return;
                }

                const jsonData = await jsonResponse.json();
                const lipSyncData = await lipSyncResponse.json();
                const audioFile = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);

                setJsonData(jsonData);
                setLipSyncData(lipSyncData);
                setAudio(audioFile);
                setSpeaker(currentSpeaker);

                audioFile.onloadeddata = () => {
                    audioFile.play().catch((error) => console.error("Play request failed:", error));
                    setIsPlaying(true);
                };

                audioFile.onended = () => {
                    setIsPlaying(false);
                    setCurrentDialogueIndex((prevIndex) => prevIndex + 1);
                };

            } catch (error) {
                console.error(error.message);
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
