import React, { useState, useEffect, useRef } from 'react';
import { useFrame,useGraph } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimations, useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { DialogueManager } from './1.3avatar_manager'; // Import the DialogueManager

export function Avatar2({ dialogue, isListening, onComplete, ...props }) {
  const { 
    playAudio, 
    pauseAudio, 
    updateLipSync, 
    jsonFile, 
    audio, 
    lipsync 
  } = DialogueManager({ dialogue, isListening, onComplete });

  const { scene } = useGLTF('/models/model2.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  const { animations: model2_br } = useFBX('/animations/Sitting Idle.fbx');
  model2_br[0].name = "Idle2";
  const { animations: model2_ta } = useFBX('/animations/Sitting Talking.fbx');
  model2_ta[0].name = "Talking2";

  const group = useRef();
  const { actions } = useAnimations([model2_br[0], model2_ta[0]], group);

  const [isTalking, setIsTalking] = useState(false);

  // Control animation states
  useEffect(() => {
    actions[model2_br[0].name].play();
    actions[model2_br[0].name].setLoop(THREE.LoopRepeat, Infinity);

    return () => {
      actions[model2_br[0].name]?.stop();
      actions[model2_ta[0].name]?.stop();
    };
  }, [actions]);

  useEffect(() => {
    if (isTalking) {
      actions[model2_ta[0].name].play();
      actions[model2_ta[0].name].fadeOut(0.0);
      actions[model2_br[0].name].play();
      setIsTalking(false);
      if (onComplete) onComplete();
    }
  }, [isTalking, actions, dialogue, onComplete]);

  useEffect(() => {
    if (isListening) {
      setIsTalking(true);
    }
  }, [isListening]);

  // LipSync logic in useFrame
  useFrame(() => {
    if (audio && audio.currentTime !== undefined) {
      updateLipSync(audio.currentTime, nodes);
    }
  });
  useEffect(() => {
    if (dialogue && dialogue.segments) {
      // Loop through the segments
      dialogue.segments.forEach((segment) => {
        if (segment.speaker === 'student') {
          setIsTalking(true);  // Trigger talking animation for student
        }
      });
    }
  }, [dialogue]);
  

  return (
    <group {...props} dispose={null} ref={group} position={[1.3, -0.7, 2.6]} rotation={[0, -.4, 0]} scale={1.1}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Glasses.geometry} material={materials.Wolf3D_Glasses} skeleton={nodes.Wolf3D_Glasses.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  );
}

useGLTF.preload('/models/model2.glb');
export default Avatar2;
