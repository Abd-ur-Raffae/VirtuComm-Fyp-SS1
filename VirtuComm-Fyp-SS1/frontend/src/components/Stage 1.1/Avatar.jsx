import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useAudio } from '../AudioContext';


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


export function Avatar(props) {
  const{audioPlaying ,setAudioPlaying,audioRef,setSubtitleData} = useAudio();
  const{ playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: 'Greetings'
    },
  });

  
  const [lipsync, setLipSyncData] = useState(null); // LipSync JSON data

  const baseMediaUrl = 'http://localhost:8000/api_tts/media/';
  const jsonFileName = 'output_transcription_single.json';
  const wavFileName = 'final_single.wav';
  const lipSyncFileName = 'final_single.json';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime(); // Cache-busting
        // Load LipSync JSON
        const lipSyncResponse = await fetch(`${baseMediaUrl}${lipSyncFileName}?t=${timestamp}`);
        if (!lipSyncResponse.ok) throw new Error('Failed to fetch LipSync JSON');
        const lipSyncData = await lipSyncResponse.json();
        setLipSyncData(lipSyncData);

        // Set WAV audio to shared audioRef
        if (audioRef.current === null) {
          audioRef.current = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [audioRef]);
  
  // Morph target updates for lip-sync
  useFrame(() => {
    if (!audioRef.current || !lipsync || !audioRef.current.currentTime) return;

    const currentAudioTime = audioRef.current.currentTime;

    Object.values(matchSound).forEach((value) => {
      nodes.AvatarHead.morphTargetInfluences[
        nodes.AvatarHead.morphTargetDictionary[value]
      ] = 0;
       nodes.AvatarTeethLower.morphTargetInfluences[
         nodes.AvatarTeethLower.morphTargetDictionary[value]
       ] = 0;
    });

    lipsync.mouthCues.forEach((mouthCue) => {
      if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
        nodes.AvatarHead.morphTargetInfluences[
          nodes.AvatarHead.morphTargetDictionary[matchSound[mouthCue.value]]
        ] = 1;
        nodes.AvatarTeethLower.morphTargetInfluences[
        nodes.AvatarTeethLower.morphTargetDictionary[matchSound[mouthCue.value]]
       ] = 1;
      }
    });
  });

  const { nodes, materials } = useGLTF('/models/muslim_model.glb');
  const { animations: IdleAnim } = useFBX('/animations/new_Standing Idle.fbx');
  const { animations: TalkAnim } = useFBX('/animations/new_Standing Arguing.fbx');

  IdleAnim[0].name = 'Idle';
  TalkAnim[0].name = 'Talk';

  const [animation, setAnimation] = useState('Idle');
  const group = useRef();
  const { actions } = useAnimations([IdleAnim[0], TalkAnim[0]], group);

  useEffect(() => {
    const handlePlayPause = () => {
        if (audioRef.current) { 
            if (playAudio) {
                audioRef.current.play();
                setAudioPlaying(true);
                setAnimation('Talk');
            } else {
                audioRef.current.pause();
                setAudioPlaying(false);
                setAnimation('Idle');
            }
        }
    };
    handlePlayPause();
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setAudioPlaying(false); 
            setAnimation('Idle');
        }
      
    };
  }, [playAudio, audioRef, setAudioPlaying, actions]);



  useEffect(() => {
    if (actions[animation]) {
        actions[animation].reset().play();
    }
    // Cleanup
    return () => {
        if (actions[animation]) {
            actions[animation].stop();
        }
    };
}, [animation, actions]);


  
  return (
    <group {...props} 
    scale={1.25}
    position={[0,.45,5]}
    dispose={null} ref={group}>
       <primitive object={nodes.Hips} />
        <skinnedMesh geometry={nodes.AvatarBody.geometry} material={materials.AvatarBody} skeleton={nodes.AvatarBody.skeleton} />
        <skinnedMesh geometry={nodes.AvatarLeftCornea.geometry} material={materials.AvatarLeftCornea} skeleton={nodes.AvatarLeftCornea.skeleton} />
        <skinnedMesh geometry={nodes.AvatarLeftEyeball.geometry} material={materials.AvatarLeftEyeball} skeleton={nodes.AvatarLeftEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarRightCornea.geometry} material={materials.AvatarRightCornea} skeleton={nodes.AvatarRightCornea.skeleton} />
        <skinnedMesh geometry={nodes.AvatarRightEyeball.geometry} material={materials.AvatarRightEyeball} skeleton={nodes.AvatarRightEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarTeethUpper.geometry} material={materials.AvatarTeethUpper} skeleton={nodes.AvatarTeethUpper.skeleton} />
        <skinnedMesh geometry={nodes.outfit.geometry} material={materials.outfit} skeleton={nodes.outfit.skeleton} />
        <skinnedMesh name="AvatarEyelashes" geometry={nodes.AvatarEyelashes.geometry} material={materials.AvatarEyelashes} skeleton={nodes.AvatarEyelashes.skeleton} morphTargetDictionary={nodes.AvatarEyelashes.morphTargetDictionary} morphTargetInfluences={nodes.AvatarEyelashes.morphTargetInfluences} />
        <skinnedMesh name="AvatarHead" geometry={nodes.AvatarHead.geometry} material={materials.AvatarHead} skeleton={nodes.AvatarHead.skeleton} morphTargetDictionary={nodes.AvatarHead.morphTargetDictionary} morphTargetInfluences={nodes.AvatarHead.morphTargetInfluences} />
        <skinnedMesh name="AvatarTeethLower" geometry={nodes.AvatarTeethLower.geometry} material={materials.AvatarTeethLower} skeleton={nodes.AvatarTeethLower.skeleton} morphTargetDictionary={nodes.AvatarTeethLower.morphTargetDictionary} morphTargetInfluences={nodes.AvatarTeethLower.morphTargetInfluences} />
    </group>
  );
}

useGLTF.preload('/models/me.glb');