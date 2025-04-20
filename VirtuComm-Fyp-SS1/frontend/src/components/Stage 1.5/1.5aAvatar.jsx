import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useAnimations, useFBX } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { useDialogueManager } from './1.5avatar_manager'; // Import the DialogueManager

export function Avatar1({ isListening, ...props }) {
    const { playAudio, updateLipSync, jsonFile, audio, isPlaying, speaker } = useDialogueManager({ 
        dialogue: props.dialogue, 
        isListening, 
        onComplete: props.onComplete ,
        avatarType : 'applicant'
    });

    // Load model and animations
    const { scene } = useGLTF('/models/emp1.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes, materials } = useGraph(clone);

    const { animations: idleAnimations } = useFBX('/animations/Teacher_sitting.fbx');
    idleAnimations[0].name = 'Idle';
    const { animations: talkingAnimations } = useFBX('/animations/Teacher_talking.fbx');
    talkingAnimations[0].name = 'Talking';

    const group = useRef();
    const { actions } = useAnimations([idleAnimations[0], talkingAnimations[0]], group);

    useEffect(() => {
        const idleAction = actions['Idle'];
        const talkingAction = actions['Talking'];
    
        if (!idleAction || !talkingAction) {
            console.error('Actions not found:', { idleAction, talkingAction });
            return;
        }
    
        idleAction.reset().play().setLoop(THREE.LoopRepeat, Infinity);
        talkingAction.setLoop(THREE.LoopRepeat, Infinity);
    
        if (isPlaying && jsonFile?.segments && audio) {
            const currentSegment = jsonFile.segments.find(segment =>
                audio.currentTime >= segment.start_time && audio.currentTime <= segment.end_time
            );
    
            if (currentSegment?.speaker === 'applicant') {
                idleAction.stop();
                talkingAction.reset().play();
            } else {
                talkingAction.stop();
                idleAction.reset().play();
            }
        }
    }, [isPlaying, jsonFile, audio, actions]);

    useFrame(() => {
        if (audio && audio.currentTime !== undefined && isPlaying) {
            const currentSegment = jsonFile?.segments?.find(segment => 
                audio?.currentTime >= segment.start_time && audio?.currentTime <= segment.end_time
            );

            if (currentSegment?.speaker === 'applicant') {
                updateLipSync(audio.currentTime, nodes);
            }
        }
    });

  return (
    <group
      {...props}
      position={[-.60, -1.05, 3.25]}
      rotation={[0, 1.4, 0]}
      scale={1.4}
      dispose={null}
      ref={group}
    >
       <primitive object={nodes.Hips} />
        <skinnedMesh geometry={nodes.AvatarBody.geometry} material={materials['AvatarBody.001']} skeleton={nodes.AvatarBody.skeleton} />
        <skinnedMesh geometry={nodes.AvatarLeftEyeball.geometry} material={materials['AvatarLeftEyeball.001']} skeleton={nodes.AvatarLeftEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarRightEyeball.geometry} material={materials['AvatarRightEyeball.001']} skeleton={nodes.AvatarRightEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarTeethUpper.geometry} material={materials['AvatarTeethUpper.001']} skeleton={nodes.AvatarTeethUpper.skeleton} />
        <skinnedMesh geometry={nodes.outfit.geometry} material={materials['outfit.001']} skeleton={nodes.outfit.skeleton} />
        <skinnedMesh name="AvatarEyelashes" geometry={nodes.AvatarEyelashes.geometry} material={materials['AvatarEyelashes.001']} skeleton={nodes.AvatarEyelashes.skeleton} morphTargetDictionary={nodes.AvatarEyelashes.morphTargetDictionary} morphTargetInfluences={nodes.AvatarEyelashes.morphTargetInfluences} />
        <skinnedMesh name="AvatarHead" geometry={nodes.AvatarHead.geometry} material={materials['AvatarHead.001']} skeleton={nodes.AvatarHead.skeleton} morphTargetDictionary={nodes.AvatarHead.morphTargetDictionary} morphTargetInfluences={nodes.AvatarHead.morphTargetInfluences} />
        <skinnedMesh name="AvatarTeethLower" geometry={nodes.AvatarTeethLower.geometry} material={materials['AvatarTeethLower.001']} skeleton={nodes.AvatarTeethLower.skeleton} morphTargetDictionary={nodes.AvatarTeethLower.morphTargetDictionary} morphTargetInfluences={nodes.AvatarTeethLower.morphTargetInfluences} />
    </group>
  );
}

export default Avatar1;

useGLTF.preload('/models/emp1.glb');
