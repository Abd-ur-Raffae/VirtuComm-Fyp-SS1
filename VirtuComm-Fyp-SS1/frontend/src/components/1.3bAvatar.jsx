import React, { useEffect, useRef } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimations, useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { DialogueManager } from './1.3avatar_manager'; // Import the DialogueManager

export function Avatar2({ dialogue, isListening, onComplete, ...props }) {
  const { 
    playAudio, 
    // pauseAudio, 
    updateLipSync, 
    jsonFile, 
    audio, 
    // lipsync 
  } = DialogueManager({ dialogue, isListening, onComplete });

  const { scene } = useGLTF('/models/chacha.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  console.log("Nodes:", nodes);
  console.log(Object.keys(nodes))


  const { animations: idleAnimations } = useFBX('/animations/Sitting Idle.fbx');
  idleAnimations[0].name = 'Idle';
  const { animations: talkingAnimations } = useFBX('/animations/Sitting Talking.fbx');
  talkingAnimations[0].name = 'Talking';
  

  const group = useRef();
  const { actions } = useAnimations([idleAnimations[0], talkingAnimations[0]], group);

  useEffect(() => {
    const idleAction = actions['Idle'];
    const talkingAction = actions['Talking'];
    if (idleAction) {
      idleAction.reset().play().setLoop(THREE.LoopRepeat, Infinity);
    }
    if (talkingAction) {
      talkingAction.setLoop(THREE.LoopRepeat, Infinity);
    }
  
    if (playAudio && jsonFile?.segments && audio) {
      const currentSegment = jsonFile.segments.find(segment => 
        audio.currentTime >= segment.start_time && audio.currentTime <= segment.end_time
      );
  
      if (currentSegment?.speaker === 'teacher') {
        idleAction?.stop();
        talkingAction?.reset().play();
      } else {
        talkingAction?.stop();
        idleAction?.play();
      }
    }
  
    return () => {
      idleAction?.stop();
      talkingAction?.stop();
    };
  }, [playAudio, jsonFile, audio, actions]);
  
  useEffect(() => {
    if (audio) {
      if (playAudio) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [playAudio, audio]);
  
  useFrame(() => {
    if (audio && audio.currentTime !== undefined && playAudio) {
      const currentSegment = jsonFile?.segments?.find(segment => 
        audio?.currentTime >= segment.start_time && audio?.currentTime <= segment.end_time
      );
  
      if (currentSegment?.speaker === 'teacher') {
        updateLipSync(audio.currentTime, nodes);
      }
    }
  });
  return (
    <group {...props} dispose={null} ref={group} position={[1.3, -0.7, 2.6]} rotation={[0, -.4, 0]} scale={1.1}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
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

useGLTF.preload('/models/chacha.glb');
export default Avatar2;
