import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei";

import React, { useState } from "react";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Suspense } from "react";
import { models } from "@/constants";
import { ProductSize } from "./ProductViewer";
import { Lights } from "./Lights";
import { Loader } from "./Loader";
import { Iphone3DModel } from "./Iphone3dModel";

import { extend } from "@react-three/fiber";

extend({ OrbitControls: OrbitControlsImpl });

type Props = {
  index: number;
  groupRef: React.MutableRefObject<THREE.Group>;
  gsapType: string;
  controlRef: React.RefObject<OrbitControlsImpl>;
  setRotationState: React.Dispatch<React.SetStateAction<number>>;
  size: ProductSize;
  item: (typeof models)[number];
};

export function Iphone({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  item,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? "right-[-100%]" : ""}`}
    >
      <ambientLight intensity={0.4} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => {
          setRotationState(controlRef.current?.getAzimuthalAngle() || 0);
        }}
      />

      <group
        ref={groupRef}
        name={`${index === 1} ? 'small' : 'large`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={!isLoaded && <Loader />}>
          <Iphone3DModel
            groupProps={{
              scale: index === 1 ? [15, 15, 15] : [17, 17, 17],
            }}
            item={item}
            onLoad={() => {
              setIsLoaded(true);
            }}
          />
        </Suspense>
      </group>
    </View>
  );
}
