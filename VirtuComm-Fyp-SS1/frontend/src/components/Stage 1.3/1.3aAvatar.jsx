import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useAnimations, useFBX } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { useDialogueManager } from './1.3avatar_manager'; // Import the DialogueManager

export function Avatar1({ isListening, ...props }) {
    const { 
        playAudio, 
        updateLipSync, 
        jsonFile, 
        audio, 
        isPlaying, 
        speaker,
        isTalking, // Use the new isTalking property
        activeSpeaker
    } = useDialogueManager({ 
        dialogue: props.dialogue, 
        isListening, 
        onComplete: props.onComplete,
        avatarType: 'guest' // Specify this is the guest/student avatar
    });

    // Load model and animations
    const { scene } = useGLTF('/models/ceo.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes, materials } = useGraph(clone);

    const { animations: idleAnimations } = useFBX('/animations/Teacher_sitting.fbx');
    idleAnimations[0].name = 'Idle';
    const { animations: talkingAnimations } = useFBX('/animations/talk_may.fbx');
    talkingAnimations[0].name = 'Talking';

    const group = useRef();
    const { actions } = useAnimations([idleAnimations[0], talkingAnimations[0]], group);
    const currentAnimation = useRef(null);

    // Animation switching logic - improved with direct isTalking check
    useEffect(() => {
        const idleAction = actions['Idle'];
        const talkingAction = actions['Talking'];
    
        if (!idleAction || !talkingAction) {
            console.error('Actions not found:', { idleAction, talkingAction });
            return;
        }
    
        // Set up animations with crossfade
        const setupAnimations = () => {
            idleAction.play();
            idleAction.setLoop(THREE.LoopRepeat, Infinity);
            talkingAction.setLoop(THREE.LoopRepeat, Infinity);
            currentAnimation.current = 'Idle';
        };
        
        setupAnimations();
        
        // Cleanup function
        return () => {
            idleAction.stop();
            talkingAction.stop();
        };
    }, [actions]); // Only run once when actions are available

    // Separate effect for animation switching based on isTalking
    useEffect(() => {
        const idleAction = actions['Idle'];
        const talkingAction = actions['Talking'];
        
        if (!idleAction || !talkingAction) return;
        
        // Switch animation based on isTalking state
        if (isTalking && currentAnimation.current !== 'Talking') {
            idleAction.stop();
            talkingAction.play();
            currentAnimation.current = 'Talking';
            console.log('Guest: Switching to TALKING animation');
        } else if (!isTalking && currentAnimation.current !== 'Idle') {
            talkingAction.stop();
            idleAction.play();
            currentAnimation.current = 'Idle';
            console.log('Guest: Switching to IDLE animation');
        }
    }, [isTalking, actions]); // Depend on isTalking state

    // Lip sync in animation frame
    useFrame(() => {
        if (audio && audio.currentTime !== undefined && isPlaying && isTalking) {
            updateLipSync(audio.currentTime, nodes);
        }
    });

  return (
    <group
      {...props}
      position={[-2.05, -1.05, 3.3]}
      rotation={[0, 1.6, 0]}
      scale={1.3}
      dispose={null}
      ref={group}
    >
      <primitive object={nodes.Hips} />
        <skinnedMesh geometry={nodes.AvatarBody.geometry} material={materials.AvatarBody} skeleton={nodes.AvatarBody.skeleton} />
        <skinnedMesh geometry={nodes.AvatarLeftEyeball.geometry} material={materials.AvatarLeftEyeball} skeleton={nodes.AvatarLeftEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarRightEyeball.geometry} material={materials.AvatarRightEyeball} skeleton={nodes.AvatarRightEyeball.skeleton} />
        <skinnedMesh geometry={nodes.AvatarTeethUpper.geometry} material={materials.AvatarTeethUpper} skeleton={nodes.AvatarTeethUpper.skeleton} />
        <skinnedMesh geometry={nodes.glasses.geometry} material={materials.glasses} skeleton={nodes.glasses.skeleton} />
        <skinnedMesh geometry={nodes.outfit.geometry} material={materials.outfit} skeleton={nodes.outfit.skeleton} />
        <skinnedMesh name="AvatarEyelashes" geometry={nodes.AvatarEyelashes.geometry} material={materials.AvatarEyelashes} skeleton={nodes.AvatarEyelashes.skeleton} morphTargetDictionary={nodes.AvatarEyelashes.morphTargetDictionary} morphTargetInfluences={nodes.AvatarEyelashes.morphTargetInfluences} />
        <skinnedMesh name="AvatarHead" geometry={nodes.AvatarHead.geometry} material={materials.AvatarHead} skeleton={nodes.AvatarHead.skeleton} morphTargetDictionary={nodes.AvatarHead.morphTargetDictionary} morphTargetInfluences={nodes.AvatarHead.morphTargetInfluences} />
        <skinnedMesh name="AvatarTeethLower" geometry={nodes.AvatarTeethLower.geometry} material={materials.AvatarTeethLower} skeleton={nodes.AvatarTeethLower.skeleton} morphTargetDictionary={nodes.AvatarTeethLower.morphTargetDictionary} morphTargetInfluences={nodes.AvatarTeethLower.morphTargetInfluences} />
    </group>
  );
}

export default Avatar1;

useGLTF.preload('/models/ceo.glb');
