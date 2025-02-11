import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";

export const Experience = () => {
  const texture = useTexture('/textures/back.jpg.jpg');
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <OrbitControls 
        enableRotate={false} 
        enablePan={true} 
        enableZoom={true} 
      />
      {/* Increase scale for a zoom effect */}
      <Avatar position={[4, 4, 4]} scale={1.8} /> 
      <Environment preset="apartment" />
      <mesh>
        <planeGeometry args={[viewport.width + 5, viewport.height + 3]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
