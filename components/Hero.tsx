"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";
import { useEffect, useState } from "react";
import { Button } from "@/app/Button";

export function Hero() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleVideoSrcSet = () => {
    if (window.innerWidth < 768) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleVideoSrcSet();

      window.addEventListener("resize", handleVideoSrcSet);

      return () => {
        window.removeEventListener("resize", handleVideoSrcSet);
      };
    }
  }, []);

  useGSAP(() => {
    gsap.to("#hero-title", { opacity: 1, delay: 1.5 });
    gsap.to("#buy-cta", { opacity: 1, y: 0, delay: 1.5 });
  }, []);

  return (
    <section className="w-full h-[calc(100vh-60px)] bg-black relative">
      <div className="container h-5/6 w-full flex items-center flex-center flex-col">
        <p
          id="hero-title"
          className="text-center font-semibold text-3xl text-gray-100 opacity-0 max-md:mb-10"
        >
          iPhone 16 Pro
        </p>
        <div className="md:w-10/12 w-9/12">
          {videoSrc && (
            <video
              autoPlay
              muted
              playsInline={true}
              key={videoSrc}
              className="pointer-events-none"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>

        <div
          id="buy-cta"
          className="flex flex-col items-center opacity-0 translate-y-20"
        >
          <Button href="/highlights">Buy</Button>
          <p className="font-normal text-xl">From $199/month or $999</p>
        </div>
      </div>
    </section>
  );
}
