import { useState, useEffect, useCallback, useRef } from "react";
import { useSharedAudio } from "../Stage 1.3/1.3AudioContext";

export function useDialogueManager({ dialogue, isListening, onComplete }) {
    const { audio, setAudio } = useSharedAudio();
    const [lipsync, setLipSyncData] = useState(null);
    const [jsonFile, setJsonData] = useState(null);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speaker, setSpeaker] = useState(null);
    const audioRef = useRef(null); // Reference to track the current audio instance
    const isFetchingRef = useRef(false); // Prevent duplicate fetches

    const baseMediaUrl = "http://localhost:8000/api_tts/media/";

    // Lip-sync update function
    const updateLipSync = useCallback((currentTime, nodes) => {
        if (!lipsync || !nodes?.AvatarHead || !nodes?.AvatarTeethLower) return;

        const matchSound = {
            A: 'aa', B: 'kk', C: 'ih', D: 'CH', E: 'E', F: 'FF', G: 'RR', H: 'TH',
            I: 'ih', J: 'CH', K: 'kk', L: 'RR', M: 'PP', N: 'nn', O: 'oh', P: 'PP',
            Q: 'kk', R: 'RR', S: 'SS', T: 'TH', U: 'ou', V: 'FF', W: 'ou', X: 'SS',
            Y: 'ih', Z: 'SS',
        };

        // Reset all morph targets
        Object.values(matchSound).forEach((value) => {
            if (nodes.AvatarHead.morphTargetDictionary[value]) {
                nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[value]] = 0;
                nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[value]] = 0;
            }
        });

        // Apply current mouth cue
        lipsync.mouthCues.forEach((mouthCue) => {
            if (currentTime >= mouthCue.start && currentTime <= mouthCue.end) {
                const target = matchSound[mouthCue.value];
                if (nodes.AvatarHead.morphTargetDictionary[target]) {
                    nodes.AvatarHead.morphTargetInfluences[nodes.AvatarHead.morphTargetDictionary[target]] = 1;
                    nodes.AvatarTeethLower.morphTargetInfluences[nodes.AvatarTeethLower.morphTargetDictionary[target]] = 1;
                }
            }
        });
    }, [lipsync]);

    // Fetch dialogue data
    const fetchDialogue = useCallback(async (index) => {
        if (isFetchingRef.current) return; // Prevent concurrent fetches
        isFetchingRef.current = true;

        try {
            const timestamp = new Date().getTime();
            const paddedIndex = String(index).padStart(3, '0');
            const speakers = ["student", "teacher"];
            let jsonData, lipSyncData, audioFile, currentSpeaker;

            for (const speakerCandidate of speakers) {
                const jsonFileName = `${paddedIndex}_${speakerCandidate}_sub.json`;
                const lipSyncFileName = `${paddedIndex}_${speakerCandidate}_lipsync.json`;
                const wavFileName = `${paddedIndex}_${speakerCandidate}.wav`;

                const [jsonResponse, lipSyncResponse, audioResponse] = await Promise.all([
                    fetch(`${baseMediaUrl}${jsonFileName}?t=${timestamp}`),
                    fetch(`${baseMediaUrl}${lipSyncFileName}?t=${timestamp}`),
                    fetch(`${baseMediaUrl}${wavFileName}?t=${timestamp}`),
                ]);

                if (jsonResponse.ok && lipSyncResponse.ok && audioResponse.ok) {
                    jsonData = await jsonResponse.json();
                    lipSyncData = await lipSyncResponse.json();
                    audioFile = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
                    currentSpeaker = speakerCandidate;
                    break;
                }
            }

            if (!jsonData || !lipSyncData || !audioFile) {
                console.log("Dialogue complete.");
                onComplete?.();
                return;
            }

            // Cleanup previous audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleAudioEnd);
                audioRef.current = null;
            }

            // Set new audio and state
            setJsonData(jsonData);
            setLipSyncData(lipSyncData);
            setSpeaker(currentSpeaker);
            setAudio(audioFile);
            audioRef.current = audioFile;

            audioFile.addEventListener('loadeddata', () => {
                audioFile.play().catch((error) => console.error("Play failed:", error));
                setIsPlaying(true);
            });

            audioFile.addEventListener('ended', handleAudioEnd);

        } catch (error) {
            console.error("Fetch error:", error);
            setCurrentDialogueIndex((prev) => prev + 1); // Move to next on error
        } finally {
            isFetchingRef.current = false;
        }
    }, [setAudio, onComplete]);

    // Handle audio end
    const handleAudioEnd = useCallback(() => {
        setIsPlaying(false);
        setCurrentDialogueIndex((prev) => prev + 1);
    }, []);

    // Fetch data when index changes
    useEffect(() => {
        if (!isListening) {
            fetchDialogue(currentDialogueIndex);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleAudioEnd);
            }
        };
    }, [currentDialogueIndex, isListening, fetchDialogue]);

    return {
        playAudio: () => audioRef.current?.play() && setIsPlaying(true),
        pauseAudio: () => audioRef.current?.pause() && setIsPlaying(false),
        updateLipSync,
        jsonFile,
        audio: audioRef.current,
        lipsync,
        isPlaying,
        speaker,
    };
}