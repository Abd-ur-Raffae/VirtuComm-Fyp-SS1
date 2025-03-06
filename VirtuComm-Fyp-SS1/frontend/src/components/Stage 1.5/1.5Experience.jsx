import { Environment, OrbitControls, useTexture,useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from './1.5aAvatar';
import Avatar2 from './1.5bAvatar';


export const Experience_5 = () => {
const texture = useTexture('/textures/Office.jpg');
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
        url="\models\office_chair.glb" 
        position={[3, -1.2, 2.3]} 
        rotation={[0, -1.2, 0]}
        scale={1.53} 
      />
 <GLBModel 
        url="\models\chair2.glb" 
        position={[-0.4, -1.2, 3.2]} 
        rotation={[0, 1.4, 0]}
        scale={1.7} 
      />
   <GLBModel 
        url="\models\chair3.glb" 
        position={[0, -1.2, 1.8]} 
        rotation={[0, 1.4, 0]}
        scale={1.7} 
      />
   
      <GLBModel 
        url="\models\table.glb" 
        position={[1,.25,4.5]} 
        rotation={[0, 1.7, 0]}
        scale={1.2} 
      />
 <GLBModel 
        url="\models\desktop_computer.glb" 
        position={[1,.60,4.3]} 
        rotation={[0, 1.2, 0]}
        scale={0.9} 
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