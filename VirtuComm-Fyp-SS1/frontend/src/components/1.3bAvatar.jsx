

import React from 'react'
import { useGraph } from '@react-three/fiber'
import * as THREE from 'three'
import { useAnimations, useFBX, useGLTF, useKeyboardControls } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'


export function Avatar2({onComplete,isListening,dialogue, ...props}) {
  const { scene } = useGLTF('/models/model2.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)


//adding and renaming animations
const {animations : model_2_br} =useFBX('/animations/Sitting Idle.fbx')
model_2_br[0].name = "Idlem1"
const{animations: model_2_ta} = useFBX('/animations/Sitting Talking.fbx')
model_2_ta[0].name = "Talkingm1"


//animation hook
const group = React.useRef()
const {actions} = useAnimations([model_2_br[0], model_2_ta[0]], group)



  const [isTalking, setIsTalking] = React.useState(false);
  React.useEffect(() => {
    // Start the default idle animation when the model is loaded
    actions[model_2_br[0].name].play();
    actions[model_2_br[0].name].setLoop(THREE.LoopRepeat, Infinity);
  
    return () => {
      // Cleanup actions to prevent memory leaks
      actions[model_2_br[0].name]?.stop();
      actions[model_2_ta[0].name]?.stop();
    };
  }, [actions]);
  
React.useEffect(() => {
  if (isTalking) {
    // Trigger talking animation
    if(!actions[model_2_ta[0].name]?.isRunning()) {
    actions[model_2_ta[0].name].play();
    }
    // Speak text
    const utterance = new SpeechSynthesisUtterance(dialogue);
    
    // Set voice
    const voices = window.speechSynthesis.getVoices();
    console.log(window.speechSynthesis.getVoices());
    const selectedVoice = voices[1]; // Change the name to the desired voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    
    utterance.lang = 'en-US';
    utterance.onend = () => {
      actions[model_2_ta[0].name].fadeOut(0.0);  
      actions[model_2_br[0].name].play();

      // Notify Model 1 to start talking
      setIsTalking(false);
      if (onComplete) onComplete();
    };
    window.speechSynthesis.speak(utterance);
  } else {
    if(actions[model_2_br[0].name]?.isRunning()) {
    actions[model_2_br[0].name].play();
  }}
}, [isTalking, actions, dialogue, onComplete]);

React.useEffect(() => {
  if (isListening) {
    setIsTalking(true);
  }
}, [isListening]);

  return (
    <group {...props}
     dispose={null} 
     ref={group}
     position={[1.3, -0.7, 2.6]}
     rotation={[0, -.4, 0]}
     scale={1.1}
     >
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
  )
}

useGLTF.preload('/models/model2.glb')
export default Avatar2;