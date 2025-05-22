import { useState, useEffect, useRef } from "react";
import { useSharedAudio } from "./1.3AudioContext"; // Use shared audio

// Shared singleton manager for syncing audio state
const audioManagerState = {
    isAudioBeingManaged: false,
    currentManager: null,
    sharedData: {
        jsonFile: null,
        lipsync: null,
        isPlaying: false,
        speaker: null,
        audio: null,
        currentTime: 0,
        activeSpeaker: null // Add explicit active speaker tracking
    }
};

export function useDialogueManager({ dialogue, isListening, onComplete, avatarType }) {
    const { audio, setAudio } = useSharedAudio(); // Shared audio context
    const [lipsync, setLipSyncData] = useState(null);
    const [jsonFile, setJsonData] = useState(null);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speaker, setSpeaker] = useState(null); // host or guest
    const [activeSpeaker, setActiveSpeaker] = useState(null); // Track active speaker
    const instanceId = useRef(Math.random().toString(36).substring(7)); // Unique instance ID

    const baseMediaUrl = "http://localhost:8000/api_tts/media/podcast/";

    const updateLipSync = (currentTime, nodes ) => {
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

    // Sync shared state for all avatars (not just non-managers)
    useEffect(() => {
        const syncInterval = setInterval(() => {
            // Always sync from shared state for consistency
            setJsonData(audioManagerState.sharedData.jsonFile);
            setLipSyncData(audioManagerState.sharedData.lipsync);
            setIsPlaying(audioManagerState.sharedData.isPlaying);
            setSpeaker(audioManagerState.sharedData.speaker);
            setActiveSpeaker(audioManagerState.sharedData.activeSpeaker);
            
            // Update current time in shared state if we're the manager
            if (audioManagerState.currentManager === instanceId.current && audio) {
                audioManagerState.sharedData.currentTime = audio.currentTime;
            }
        }, 50); // Faster polling for more responsive updates
        
        return () => clearInterval(syncInterval);
    }, [audio]);

    // Assign manager role on mount - fix case sensitivity issue
    useEffect(() => {
        // Convert to lowercase for case-insensitive comparison
        const normalizedAvatarType = avatarType.toLowerCase();
        const shouldManageAudio = normalizedAvatarType === 'guest' || !audioManagerState.isAudioBeingManaged;

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
                        audio: null,
                        currentTime: 0,
                        activeSpeaker: null
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
            
            // Update active speaker based on current segment
            if (isPlaying && jsonFile?.segments && audio) {
                const currentSegment = jsonFile.segments.find(segment =>
                    audio.currentTime >= segment.start_time && audio.currentTime <= segment.end_time
                );
                
                if (currentSegment) {
                    audioManagerState.sharedData.activeSpeaker = currentSegment.speaker.toLowerCase();
                }
            }
        }
    }, [jsonFile, lipsync, isPlaying, speaker, audio]);

    // Fetch and play audio for current dialogue index
    useEffect(() => {
        if (audioManagerState.currentManager !== instanceId.current) return;

        const fetchData = async (index) => {
            try {
                const paddedIndex = String(index).padStart(3, '0');
                const timestamp = new Date().getTime();
                const currentSpeaker = index % 2 === 0 ? "host" : "guest";

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
                setActiveSpeaker(currentSpeaker); // Set active speaker immediately
                
                // Update shared state immediately
                audioManagerState.sharedData.jsonFile = jsonData;
                audioManagerState.sharedData.lipsync = lipSyncData;
                audioManagerState.sharedData.speaker = currentSpeaker;
                audioManagerState.sharedData.activeSpeaker = currentSpeaker;

                audioFile.onloadeddata = () => {
                    audioFile.play().catch((error) => console.error("Play request failed:", error));
                    setIsPlaying(true);
                    audioManagerState.sharedData.isPlaying = true;
                    audioManagerState.sharedData.audio = audioFile;
                };

                audioFile.onended = () => {
                    setIsPlaying(false);
                    audioManagerState.sharedData.isPlaying = false;
                    setCurrentDialogueIndex((prevIndex) => prevIndex + 1);
                };

            } catch (error) {
                console.error(error.message);
                setCurrentDialogueIndex((prevIndex) => prevIndex + 1);
            }
        };

        fetchData(currentDialogueIndex);
    }, [currentDialogueIndex, setAudio, onComplete]);

    // Determine if this avatar should be talking based on active speaker
    const isTalking = isPlaying && 
                     activeSpeaker && 
                     activeSpeaker.toLowerCase() === avatarType.toLowerCase();

    return {
        playAudio: () => setIsPlaying(true),
        pauseAudio: () => setIsPlaying(false),
        updateLipSync, // Return the updateLipSync function
        jsonFile: jsonFile || audioManagerState.sharedData.jsonFile, // Use local or shared data
        audio: audio || audioManagerState.sharedData.audio, // Use local or shared data
        lipsync: lipsync || audioManagerState.sharedData.lipsync, // Use local or shared data
        isPlaying: isPlaying || audioManagerState.sharedData.isPlaying, // Use local or shared data
        speaker: speaker || audioManagerState.sharedData.speaker, // Use local or shared data
        isTalking, // New property to directly indicate if this avatar should be talking
        activeSpeaker: activeSpeaker || audioManagerState.sharedData.activeSpeaker, // Expose active speaker
    };
}
