import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useControls } from 'leva';
import * as THREE from 'three';

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

export function Avatar(props) {
  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: 'Greetings'
    },
  });

  const [jsonFile, setJsonData] = useState(null); // JSON transcription data
  const [audio, setAudio] = useState(null); // Audio element
  const [lipsync, setLipSyncData] = useState(null); // LipSync JSON data

  const baseMediaUrl = 'http://localhost:8000/api_tts/media/';
  const jsonFileName = 'output_transcription.json';
  const wavFileName = 'final_conversation.wav';
  const lipSyncFileName = 'final_conversation.json';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const timestamp = new Date().getTime(); // Unique identifier for cache-busting

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
            const audioElement = new Audio(`${baseMediaUrl}${wavFileName}?t=${timestamp}`);
            setAudio(audioElement);
        } catch (error) {
            console.error(error.message);
        }
    };

    fetchData();
}, []);

  
  // Morph target updates for lip-sync
  useFrame(() => {
    if (!audio || !lipsync || !audio.currentTime) return;

    const currentAudioTime = audio.currentTime;

    Object.values(matchSound).forEach((value) => {
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ] = 0;
    });

    lipsync.mouthCues.forEach((mouthCue) => {
      if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[matchSound[mouthCue.value]]
        ] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[matchSound[mouthCue.value]]
        ] = 1;
      }
    });
  });

  const { nodes, materials } = useGLTF('/models/me.glb');
  const { animations: IdleAnim } = useFBX('/animations/Breathing_Idle.fbx');
  const { animations: TalkAnim } = useFBX('/animations/Talking.fbx');

  IdleAnim[0].name = 'Idle';
  TalkAnim[0].name = 'Talk';

  const [animation, setAnimation] = useState('Idle');
  const group = useRef();
  const { actions } = useAnimations([IdleAnim[0], TalkAnim[0]], group);

  useEffect(() => {
    const handlePlay = () => {
        if (audio) { // Check if audio is defined
            if (playAudio) {
                audio.play();
                setAnimation('Talk');
            } else {
                audio.pause();
                setAnimation('Idle');
            }
        }
    };
    handlePlay();
    return () => {
        if (audio) {
            audio.pause(); // Ensure cleanup doesn't error out
        }
        setAnimation('Idle');
    };
  }, [playAudio, script, audio, actions]);



  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    // Cleanup
    return () => {
      actions[animation].fadeOut(0.5);
    };
  }, [animation, actions]);

  console.log(nodes.Wolf3D_Head.morphTargetDictionary);
  console.log(nodes.Wolf3D_Teeth.morphTargetDictionary);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  );
}

useGLTF.preload('/models/me.glb');
