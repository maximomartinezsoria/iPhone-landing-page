"use client";

import { rightImg, watchImg } from "@/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { VideoCarousel } from "./VideoCarousel";
import { useMounted } from "@/hooks/useMounted";

const links = [
  {
    text: "Watch the film",
    img: watchImg,
    width: 20,
    height: 20,
  },
  {
    text: "Watch the event",
    img: rightImg,
    width: 7,
    height: 12,
  },
];

export function Highlights() {
  const isMounted = useMounted();

  useGSAP(() => {
    if (!isMounted) return;
    gsap.to("#highlights-title", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: "#highlights-title",
        start: "top 80%",
      },
    });
    gsap.to('[data-selector="highlight-link"]', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.25,
      scrollTrigger: {
        trigger: "#highlights-title",
        start: "top 80%",
      },
    });
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <section
      id="highlights"
      className="w-screen overflow-hidden h-full section-padding bg-zinc"
    >
      <div className="screen-max-width">
        <div className="mb-12 w-full md:flex items-center justify-between">
          <h2 id="highlights-title" className="section-heading md:mb-0">
            Get the highlights.
          </h2>

          <div className="flex flex-wrap items-end gap-5">
            {links.map((link, i) => (
              <p
                key={i}
                data-selector="highlight-link"
                className="text-blue hover:underline cursor-pointer flex items-center text-xl opacity-0 translate-y-20"
              >
                {link.text}
                <Image
                  src={link.img}
                  alt={link.text}
                  width={link.width}
                  height={link.height}
                  className="ml-2"
                />
              </p>
            ))}
          </div>
        </div>

        <VideoCarousel />
      </div>
    </section>
  );
}
