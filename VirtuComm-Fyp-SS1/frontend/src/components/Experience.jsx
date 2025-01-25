import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import {Avatar} from "./Avatar";
import {useThree } from "@react-three/fiber"
export const Experience = () => {

  const texture  = useTexture('/textures/back.jpg.jpg')
  const viewport = useThree((state) => state.viewport)

  return (
    <>
      <OrbitControls 
      enableRotate={false} 
      enablePan={false} 
      enableZoom={false} />
     <Avatar position={[0, 0, 5]} scale = {1.5} />
     <Environment preset="sunset" />
    <mesh>
      <planeGeometry args={[viewport.width + 5, viewport.height+3]} />
      <meshBasicMaterial map={texture} />
    </mesh>
   
    </>
  );
};