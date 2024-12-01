

import React from 'react'
import { useGraph } from '@react-three/fiber'
import * as THREE from 'three'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'



export function Avatar({onComplete, isListening,dialogue ,...props}) {
  const { scene } = useGLTF('/models/672f5f7d5e4f6edb317f7edc.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)

  //adding and renaming animations
  const {animations : model_1_br} =useFBX('/animations/Sitting Idle.fbx')
  model_1_br[0].name = "Idlem1"
  const{animations: model_1_ta} = useFBX('/animations/Sitting Talking.fbx')
  model_1_ta[0].name = "Talkingm1"

//animation hook
const group = React.useRef()
const {actions} = useAnimations([model_1_br[0], model_1_ta[0]], group)



  
const [isTalking, setIsTalking] = React.useState(false);

React.useEffect(() => {
  // Start the default idle animation when the model is loaded
  actions[model_1_br[0].name].play();
  actions[model_1_br[0].name].setLoop(THREE.LoopRepeat, Infinity);

  return () => {
    // Cleanup actions to prevent memory leaks
    actions[model_1_br[0].name]?.stop();
    actions[model_1_ta[0].name]?.stop();
  };
}, [actions]);

React.useEffect(() => {
  if (isTalking) {
    console.log("Received dialogue : ", dialogue);
    if(!actions[model_1_ta[0].name]?.isRunning()) {
       actions[model_1_ta[0].name]?.play();
    }
    // Trigger speech synthesis
   
   
    const utterance = new SpeechSynthesisUtterance(dialogue);
   
    const voices = window.speechSynthesis.getVoices();
    console.log(window.speechSynthesis.getVoices());
    const selectedVoice = voices[0]; 
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
   
    utterance.lang = "en-US";

    // Handle when speech ends
    utterance.onend = () => {
      console.log("Speech ended")
      actions[model_1_ta[0].name].fadeOut(0.0);
      actions[model_1_br[0].name].play();
      setIsTalking(false);
      // Notify parent component that speaking has ended
      if (onComplete) onComplete();
    };
    console.log("Speaking:", dialogue);
    window.speechSynthesis.speak(utterance);
  } else {
    
    if(!actions[model_1_br[0].name]?.isRunning()){
    // Play idle animation
    actions[model_1_br[0].name].play();
  }
  }
}, [isTalking, actions, dialogue, onComplete]);


React.useEffect(() => {
  if (isListening) {
    setIsTalking(true);
  }
}, [isListening]);


  return (
   
    <group {...props}
    position={[-0.4,-0.5,3.6]}
    rotation={[0, 1, 0]}
    scale={1}
    
    dispose={null}  ref={group}>
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


export default Avatar;
useGLTF.preload('/models/672f5f7d5e4f6edb317f7edc.glb')
