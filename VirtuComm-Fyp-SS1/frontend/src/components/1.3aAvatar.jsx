import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useControls } from 'leva';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export function Avatar({ onComplete, isListening, dialogue, ...props }) {
  const [jsonFile, setJsonData] = useState(null); // JSON transcription data
  const [audio, setAudio] = useState(null); // Audio element
  const [lipsync, setLipSyncData] = useState(null); // LipSync JSON data

  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: 'Final',
      options: ['Ghar'],
    },
  });

  const baseMediaUrl = 'http://localhost:8000/api_tts/media/';
  const jsonFileName = 'output_transcription.json';
  const wavFileName = 'final_conversation.wav';
  const lipSyncFileName = 'final_conversation.json';

  // Fetch JSON and WAV files
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

  // Play/Pause audio based on playAudio state
  useEffect(() => {
    if (audio) {
      if (playAudio) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [playAudio, audio]);

  // Load model and animations
  const { scene } = useGLTF('/models/me.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // Load and configure animations
  const { animations: idleAnimations } = useFBX('/animations/Sitting Idle.fbx');
  idleAnimations[0].name = 'Idle';
  const { animations: talkingAnimations } = useFBX('/animations/Sitting Talking.fbx');
  talkingAnimations[0].name = 'Talking';

  const group = useRef();
  const { actions } = useAnimations([idleAnimations[0], talkingAnimations[0]], group);

  // Control idle and talking animations
  useEffect(() => {
    const idleAction = actions['Idle'];
    const talkingAction = actions['Talking'];

    if (idleAction) {
      idleAction.reset().play().setLoop(THREE.LoopRepeat, Infinity);
    }

    if (isListening && talkingAction) {
      talkingAction.reset().play();
    } else {
      talkingAction?.stop();
    }

    return () => {
      idleAction?.stop();
      talkingAction?.stop();
    };
  }, [isListening, actions]);

  return (
    <group
      {...props}
      position={[-0.4, -0.5, 3.6]}
      rotation={[0, 1, 0]}
      scale={1}
      dispose={null}
      ref={group}
    >
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

export default Avatar;

useGLTF.preload('/models/me.glb');
