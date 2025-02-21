import { Environment, OrbitControls, useTexture,useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from './1.4aAvatar';
import Avatar2 from './1.4bAvatar';


export const Experience_4 = () => {
const texture = useTexture('/textures/class_room.avif');
const { viewport } = useThree();

const GLBModel = ({ url, position, rotation, scale }) => {
  const { scene } = useGLTF(url); 
  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />;
};

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
        />
      {/* Second Avatar positioned to the right */}
      
      <Avatar2 
      position={[3.9, -0.7, 4.]}
      rotation={[0, -Math.PI / 3, 0]}
      scale={1}
        />

 
<GLBModel 
        url="\models\school_chair.glb" 
        position={[-2.8, -.7, 2.4]} 
        rotation={[0, 2.5, 0]}
        scale={0.7} 
      />
<GLBModel 
        url="\models\whiteboard_low-poly.glb" 
        position={[.5, -.6, 1.5]} 
        rotation={[-.1, 0, 0]}
        scale={3} 
      />


      <Environment preset="apartment" />
      
      <ambientLight intensity={1} />
      <directionalLight position={[3, 2, 1]} />
      <mesh position={[0, 0, 1]} rotation={[0, .12, 0]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      
    </>
    
    
  );
};