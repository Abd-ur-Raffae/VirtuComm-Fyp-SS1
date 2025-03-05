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
        enablePan={false} 
        enableZoom={false} 
      />
      {/* Increase scale for a zoom effect */}
      <Avatar position={[4, 4, 4]} scale={1.8} rotation={[-.15, 0, 0]} /> 
      <Environment preset="apartment" files="https://raw.githubusercontent.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/venice_sunset_1k.hdr" background />
      <mesh>
        <planeGeometry args={[viewport.width + 5, viewport.height + 3]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
