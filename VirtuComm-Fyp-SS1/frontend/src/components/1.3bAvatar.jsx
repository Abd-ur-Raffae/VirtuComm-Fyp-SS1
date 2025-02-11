import React, { useEffect, useRef } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimations, useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useDialogueManager } from './1.3avatar_manager'; // Import the DialogueManager

export function Avatar2({ dialogue, isListening, onComplete, ...props }) {
  const { 
    playAudio, 
    // pauseAudio, 
    updateLipSync, 
    jsonFile, 
    audio, 
    // lipsync 
  } = useDialogueManager({ dialogue, isListening, onComplete });

  const { scene } = useGLTF('/models/teacher_female.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  console.log("Nodes:", nodes);
  console.log(Object.keys(nodes))


  const { animations: idleAnimations } = useFBX('/animations/Teacher_sitting.fbx');
  idleAnimations[0].name = 'Idle';
  const { animations: talkingAnimations } = useFBX('/animations/Teacher_talking.fbx');
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
    <group {...props} dispose={null} ref={group} position={[2.95, -1.2, 2.6]} rotation={[0, -1, 0]} scale={1.4}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.AvatarBody.geometry} material={materials['AvatarBody.001']} skeleton={nodes.AvatarBody.skeleton} />
        <skinnedMesh geometry={nodes.AvatarLeftCornea.geometry} material={materials.AvatarLeftCornea} skeleton={nodes.AvatarLeftCornea.skeleton} />
        <skinnedMesh geometry={nodes.AvatarLeftEyeball.geometry} material={materials['AvatarLeftEyeball.001']} skeleton={nodes.AvatarLeftEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarRightCornea.geometry} material={materials.AvatarRightCornea} skeleton={nodes.AvatarRightCornea.skeleton} />
        <skinnedMesh geometry={nodes.AvatarRightEyeball.geometry} material={materials['AvatarRightEyeball.001']} skeleton={nodes.AvatarRightEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarTeethUpper.geometry} material={materials['AvatarTeethUpper.001']} skeleton={nodes.AvatarTeethUpper.skeleton} />
        <skinnedMesh geometry={nodes.haircut.geometry} material={materials.haircut} skeleton={nodes.haircut.skeleton} />
        <skinnedMesh geometry={nodes.outfit.geometry} material={materials.outfit} skeleton={nodes.outfit.skeleton} />
        <skinnedMesh name="AvatarEyelashes" geometry={nodes.AvatarEyelashes.geometry} material={materials['AvatarEyelashes.001']} skeleton={nodes.AvatarEyelashes.skeleton} morphTargetDictionary={nodes.AvatarEyelashes.morphTargetDictionary} morphTargetInfluences={nodes.AvatarEyelashes.morphTargetInfluences} />
        <skinnedMesh name="AvatarHead" geometry={nodes.AvatarHead.geometry} material={materials['AvatarHead.001']} skeleton={nodes.AvatarHead.skeleton} morphTargetDictionary={nodes.AvatarHead.morphTargetDictionary} morphTargetInfluences={nodes.AvatarHead.morphTargetInfluences} />
        <skinnedMesh name="AvatarTeethLower" geometry={nodes.AvatarTeethLower.geometry} material={materials['AvatarTeethLower.001']} skeleton={nodes.AvatarTeethLower.skeleton} morphTargetDictionary={nodes.AvatarTeethLower.morphTargetDictionary} morphTargetInfluences={nodes.AvatarTeethLower.morphTargetInfluences} />
    </group>
  );
}

useGLTF.preload('/models/teacher_female.glb');
export default Avatar2;
