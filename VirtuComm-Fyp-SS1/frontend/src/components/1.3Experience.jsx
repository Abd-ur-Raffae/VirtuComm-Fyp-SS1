import { Environment, OrbitControls, useTexture,useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from './1.3aAvatar';
import Avatar2 from './1.3bAvatar';
import { useState } from "react";
import { useEffect } from "react";




export const Experience_3 = () => {
const texture = useTexture('/textures/back_img.jpg');
const { viewport, camera } = useThree();

const GLBModel = ({ url, position, rotation, scale }) => {
  const { scene } = useGLTF(url); 
  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />;
};
const avatar1Dialogues = [
  "Welcome to our beautiful country!",
  "Our country is known for its rich history and culture.",
  "You can visit the famous beaches and enjoy the serene views.",
  "We have some of the most ancient monuments in the world.",
  "The local cuisine is delicious and diverse.",
  "There are many scenic mountain ranges to explore.",
  "The best time to visit is during the spring season.",
  "The people here are very friendly and welcoming.",
  "Don't miss out on our traditional festivals and events.",
  "Make sure to try the local handicrafts as souvenirs!",
  ""
];

const avatar2Dialogues = [
  "That's wonderful to hear! I’ve heard great things about it.",
  "Yes, I've read about those ancient ruins; they are fascinating.",
  "The beaches sound amazing! I love the sound of the ocean.",
  "I would love to visit those historic sites one day!",
  "I’ve heard the local food is spicy and full of flavor!",
  "I’m a fan of hiking, so those mountain trails sound perfect.",
  "Spring sounds like the ideal time to visit with all the flowers blooming.",
  "It’s always great to meet friendly locals when traveling.",
  "Festivals are always a great way to experience the culture of a place.",
  "I’ll definitely look for some unique crafts to bring back home."
];


const [currentIndex1, setCurrentIndex1] = useState(0);
const [currentIndex2, setCurrentIndex2] = useState(0);
  
  const [avatar1Listening, setAvatar1Listening] = useState(true);
  const [avatar2Listening, setAvatar2Listening] = useState(false);


  useEffect(() => {
    console.log("Avatar 1 Dialogue:", avatar1Dialogues[currentIndex1]);
    console.log("Avatar 2 Dialogue:", avatar2Dialogues[currentIndex2]);
  }, [currentIndex1, currentIndex2]);


  const handleAvatar1Complete = () => {
    if (currentIndex1 < avatar1Dialogues.length - 1) {
      setAvatar1Listening(false);
      setAvatar2Listening(true);
      setCurrentIndex1(currentIndex1 + 1); // Functional update
    } else {
      console.log("Dialogue finished.");
    }
  };
  
  const handleAvatar2Complete = () => {
    if (currentIndex2 < avatar2Dialogues.length - 1) {
      setAvatar2Listening(false);
      setAvatar1Listening(true);
      setCurrentIndex2(currentIndex2 + 1); // Functional update
    } else {
      console.log("Dialogue finished.");
    }
  };
  
  useEffect(() => {
    console.log("Avatar 1 Listening:", avatar1Listening);
    console.log("Avatar 2 Listening:", avatar2Listening);
  }, [avatar1Listening, avatar2Listening]);


  return (
    <>
      <OrbitControls
      enableRotate={false} 
      enablePan={false} 
      enableZoom={false} 
      
      />
      {/* First Avatar positioned to the left */}
      <Avatar 
      position={[-0.5,-0.5,4.3]}
      rotation={[-.5, Math.PI / 3, 0]}
      scale={1}
      dialogue={avatar1Dialogues[currentIndex1]} 
      isListening={avatar1Listening}
      onComplete={handleAvatar1Complete}
      
        />
      {/* Second Avatar positioned to the right */}
      
      <Avatar2 
      position={[0.9, -0.5, 4.5]}
      rotation={[0, -Math.PI / 3, 0]}
      scale={1}
      dialogue={avatar2Dialogues[currentIndex2]}
      isListening={avatar2Listening}
      onComplete={handleAvatar2Complete}
        />

 <GLBModel 
        url="\models\chair_023.glb" 
        position={[1.4, -.8, 2.4]} 
        rotation={[0, -.4, 0]}
        scale={1.2} 
      />
 <GLBModel 
        url="\models\chair_02.glb" 
        position={[-0.8, -.8, 2.5]} 
        rotation={[0, .4, 0]}
        scale={1.2} 
      />
      <GLBModel 
        url="\models\table.glb" 
        position={[.5,.25,4.5]} 
        rotation={[0, .1, 0]}
        scale={1.1} 
      />


      <Environment preset="sunset" />
      
      <ambientLight intensity={1} />
      <directionalLight position={[3, 2, 1]} />
      <mesh position={[0, 0, 1]} rotation={[0, .12, 0]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      
    </>
    
    
  );
};