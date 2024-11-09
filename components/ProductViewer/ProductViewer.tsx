"use client";

import gsap from "gsap";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { Iphone } from "./Iphone";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models } from "@/constants";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import clsx from "clsx";

export enum ProductSize {
  SMALL,
  LARGE,
}

export const sizes = [
  { label: '6.1"', value: ProductSize.SMALL },
  { label: '6.7"', value: ProductSize.LARGE },
];

export function ProductViewer() {
  const [size, setSize] = useState<ProductSize>(ProductSize.SMALL);
  const [model, setModel] = useState(models[0]);
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const cameraControlSmall = useRef<OrbitControlsImpl>(null);
  const cameraControlLarge = useRef<OrbitControlsImpl>(null);

  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  const tl = gsap.timeline();

  const sizeTimeline = useRef<gsap.core.Timeline>(
    gsap.timeline({ paused: true }),
  );

  useGSAP(() => {
    gsap.to("#product-viewer-title", {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: "#product-viewer-title",
        start: "top 80%",
      },
    });
  }, []);

  useEffect(() => {
    sizeTimeline.current.to("#size-buble", {
      x: "100%",
      ease: "none",
      duration: 0.2,
    });
  }, []);

  useEffect(() => {
    if (size === ProductSize.LARGE) {
      sizeTimeline.current.play();
    } else {
      sizeTimeline.current.reverse();
    }
  }, [size]);

  useEffect(() => {
    if (size === ProductSize.LARGE) {
      tl.to(large.current.rotation, {
        y: smallRotation,
        duration: 1,
        ease: "power2.inOut",
      });

      tl.to(
        "#view1",
        {
          transform: "translateX(-100%)",
          duration: 2,
          ease: "power2.inOut",
        },
        "<",
      );

      tl.to(
        "#view2",
        {
          transform: "translateX(-100%)",
          duration: 2,
          ease: "power2.inOut",
        },
        "<",
      );
    }

    if (size === ProductSize.SMALL) {
      tl.to(small.current.rotation, {
        y: largeRotation,
        duration: 1,
        ease: "power2.inOut",
      });

      tl.to(
        "#view2",
        {
          transform: "translateX(0)",
          duration: 2,
          ease: "power2.inOut",
        },
        "<",
      );

      tl.to(
        "#view1",
        {
          transform: "translateX(0)",
          duration: 2,
          ease: "power2.inOut",
        },
        "<",
      );
    }
  }, [size, smallRotation, largeRotation, tl]);

  return (
    <section id="product-viewer" className="section-padding">
      <div className="container">
        <h2 id="product-viewer-title" className="section-heading">
          Take a closer look.
        </h2>

        <div className="flex flex-col items-center mt-5">
          <div
            ref={canvasContainerRef}
            className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative"
          >
            <Iphone
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />
            <Iphone
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />

            <Canvas
              className="w-full h-full inset-0 overflow-hidden"
              eventSource={canvasContainerRef.current as HTMLDivElement}
              style={{ position: "fixed", pointerEvents: "none" }}
            >
              <View.Port />
            </Canvas>
          </div>

          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              <ul className="flex items-center justify-center px-4 py-4 rounded-full bg-gray-300 backdrop-blur h-14">
                {models.map((modelItem, i) => (
                  <li key={i} className="w-6 h-6 rounded-full mx-2">
                    <button
                      onClick={() => setModel(modelItem)}
                      className={clsx(
                        "w-full h-full rounded-full border-2 transition-all duration-200",
                        {
                          "border-white": model === modelItem,
                          "border-transparent": model !== modelItem,
                        },
                      )}
                      style={{ backgroundColor: modelItem.color[0] }}
                    ></button>
                  </li>
                ))}
              </ul>

              <div className="ml-3 h-14 bg-gray-300 rounded-full px-2">
                <div className="flex-center h-full relative">
                  <div className="absolute w-full h-full left-1/2 -translate-x-1/2 pointer-events-none">
                    <div
                      id="size-buble"
                      className="rounded-full bg-white w-12 h-12 absolute top-1/2 -translate-y-1/2 left-0"
                    ></div>
                  </div>
                  {sizes.map(({ label, value }) => (
                    <button
                      key={value}
                      className="flex items-center justify-center rounded-full bg-transparent gap-1 w-12 h-12 backdrop-blur-0"
                      onClick={() => setSize(value)}
                    >
                      <span
                        className={clsx(
                          "text-sm flex justify-center items-center font-medium transition-colors duration-300 ease-linear",
                          {
                            "text-black": size === value,
                            "text-white": size !== value,
                          },
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
