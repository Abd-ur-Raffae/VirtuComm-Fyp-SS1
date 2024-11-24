

import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useControls } from 'leva';



export function Avatar({onComplete, isListening,dialogue ,...props}) {
  const { scene } = useGLTF('/models/672f5f7d5e4f6edb317f7edc.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)

  //adding and renaming animations
  const {animations : model_1_br} =useFBX('/animations/Idlem1.fbx')
  model_1_br[0].name = "Idlem1"
  const{animations: model_1_ta} = useFBX('/animations/Standing Arguingm2.fbx')
  model_1_ta[0].name = "Talkingm1"

//Deafult animation
const[animations, setAnimations] = React.useState([model_1_br[0]])

//animation hook
const group = React.useRef()
const {actions} = useAnimations([model_1_br[0], model_1_ta[0]], group)



  
const [isTalking, setIsTalking] = React.useState(false);


// //for using in web

// React.useEffect(() => {
//   actions[animations[0].name].reset().fadeIn(0.5).play()
//   return () => {
//     actions[animations[0].name].fadeOut(0.5)
//   }
// }, [animations, actions])


// // Use Leva to create a control
// const { speak } = useControls({
//   speak: { value: false, label: "Speak Model 1", onChange: (value) => value && handleSpeak() },
// });

// const handleSpeak = () => {
//   setAnimations([model_1_ta[0]]);
//   const text = "Greetings! I am a 3D model.";
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.onend = () => setAnimations([model_1_br[0]]);
//   window.speechSynthesis.speak(utterance);
// };
React.useEffect(() => {
  if (isTalking) {
    console.log("Received dialogue : ", dialogue);
    // Play talking animation
    actions[model_1_ta[0].name]?.reset().fadeIn(0.5).play();

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
      actions[model_1_ta[0].name].fadeOut(0.5);
      actions[model_1_br[0].name].reset().fadeIn(0.5).play();
      setIsTalking(false);
      // Notify parent component that speaking has ended
      if (onComplete) onComplete();
    };
    console.log("Speaking:", dialogue);
    window.speechSynthesis.speak(utterance);
  } else {
    // Play idle animation
    actions[model_1_br[0].name].reset().fadeIn(0.5).play();
  }
}, [isTalking, actions, dialogue, onComplete]);


React.useEffect(() => {
  if (isListening) {
    setIsTalking(true);
  }
}, [isListening]);


  return (
   
    <group {...props}
    position={[-0.5,-0.5,4.3]}
    rotation={[0, Math.PI / 3, 0]}
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
