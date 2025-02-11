import { Environment, OrbitControls, useTexture,useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from './1.3aAvatar';
import Avatar2 from './1.3bAvatar';


export const Experience_3 = () => {
const texture = useTexture('/textures/back_img.jpg');
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
        url="\models\chair_023.glb" 
        position={[3.2, -1.2, 2.3]} 
        rotation={[0, -.8, 0]}
        scale={1.33} 
      />
 <GLBModel 
        url="\models\chair_02.glb" 
        position={[-2.5, -1.2, 2.8]} 
        rotation={[0, 1, 0]}
        scale={1.33} 
      />
      <GLBModel 
        url="\models\table.glb" 
        position={[.5,.25,4.5]} 
        rotation={[0, .1, 0]}
        scale={1.1} 
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