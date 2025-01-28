// Avatar.js
import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useAnimations, useFBX } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { DialogueManager } from './1.3avatar_manager'; // Import the DialogueManager

export function Avatar1({ isListening, ...props }) {
  const { 
    playAudio, 
    pauseAudio, 
    updateLipSync, 
    jsonFile, 
    audio, 
    lipsync 
  } = DialogueManager({ dialogue: props.dialogue, isListening, onComplete: props.onComplete });

  // Load model and animations
  const { scene } = useGLTF('/models/me.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

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

  // LipSync logic in useFrame
  useFrame(() => {
    if (audio && audio.currentTime !== undefined) {
      updateLipSync(audio.currentTime, nodes);
    }
  });

  // Play or pause audio based on playAudio
  useEffect(() => {
    if (audio) {
      if (playAudio) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [playAudio, audio]);

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

export default Avatar1;

useGLTF.preload('/models/me.glb');
