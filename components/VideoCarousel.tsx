import { hightlightsSlides } from "@/constants";
import { pauseImg, playImg, replayImg } from "@/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

enum ProcessTypes {
  GO_TO_VIDEO,
  VIDEO_END,
  VIDEO_LAST,
  VIDEO_RESET,
  PAUSE,
  PLAY,
}

export function VideoCarousel() {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLDivElement | null)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<number[]>([]);

  const handleProcess = (type: ProcessTypes, i: number = 0) => {
    switch (type) {
      case ProcessTypes.VIDEO_END:
        setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }));
        break;

      case ProcessTypes.VIDEO_LAST:
        setVideo((prev) => ({ ...prev, isLastVideo: true }));
        break;

      case ProcessTypes.VIDEO_RESET:
        setVideo((prev) => ({ ...prev, videoId: 0, isLastVideo: false }));
        break;

      case ProcessTypes.PAUSE:
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;

      case ProcessTypes.PLAY:
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (index: number) =>
    setLoadedData((prev) => [...prev, index]);

  useGSAP(() => {
    gsap.to('[data-selector="video-carousel"]', {
      transform: `translateX(${-100 * video.videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to('[data-selector="video"]', {
      scrollTrigger: {
        trigger: '[data-selector="video"]',
        toggleActions: "restart none none none",
      },
      onComplete() {
        setVideo((prev) => ({
          ...prev,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [video.isEnd, video.videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!video.isPlaying) {
        videoRef.current[video.videoId]?.pause();
      } else {
        if (video.startPlay) {
          videoRef.current[video.videoId]?.play();
        }
      }
    }
  }, [video.startPlay, video.videoId, video.isPlaying, loadedData]);

  useEffect(() => {
    let currentProgress = 0;
    if (videoSpanRef.current[video.videoId]) {
      const animation = gsap.to(videoSpanRef.current[video.videoId], {
        onUpdate() {
          const progress = Math.ceil(animation.progress() * 100);

          if (progress !== currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[video.videoId], {
              width: window.innerWidth < 768 ? "10vw" : "4vw",
            });

            gsap.to(videoSpanRef.current[video.videoId], {
              width: `${progress}%`,
              backgroundColor: "white",
            });
          }
        },

        onComplete() {
          if (video.isPlaying) {
            gsap.to(videoDivRef.current[video.videoId], {
              width: "12px",
            });

            gsap.to(videoSpanRef.current[video.videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (video.videoId === 0) {
        animation.restart();
      }

      const animationUpdate = () => {
        const currentVideo = videoRef.current[video.videoId];

        if (currentVideo) {
          animation.progress(currentVideo.currentTime / currentVideo.duration);
        }
      };

      if (video.isPlaying) {
        gsap.ticker.add(animationUpdate);
      } else {
        gsap.ticker.remove(animationUpdate);
      }
    }
  }, [video.videoId, video.startPlay, video.isPlaying]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((slide, i) => (
          <div
            key={slide.id}
            data-selector="video-carousel"
            className="sm:pr-20 pr-10"
          >
            <div className="relative sm:w-[70vw] w-[88vw] md:h-[70vh] sm:h-[50vh] h-[35vh]">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  data-selector="video"
                  playsInline={true}
                  className={`${
                    slide.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => {
                    videoRef.current[i] = el;
                  }}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess(ProcessTypes.VIDEO_END, i)
                      : handleProcess(ProcessTypes.VIDEO_LAST)
                  }
                  onPlay={() =>
                    setVideo((prev) => ({ ...prev, isPlaying: true }))
                  }
                  onLoadedMetadata={() => handleLoadedMetaData(i)}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {slide.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center p-5 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                videoDivRef.current[i] = el;
              }}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                ref={(el) => {
                  videoSpanRef.current[i] = el;
                }}
                className="absolute w-full h-full rounded-full"
              ></span>
            </div>
          ))}
        </div>

        <button
          className="ml-4 p-4 rounded-full bg-gray-300 backdrop-blur flex-center"
          onClick={
            video.isLastVideo
              ? () => handleProcess(ProcessTypes.VIDEO_RESET)
              : !video.isPlaying
                ? () => handleProcess(ProcessTypes.PLAY)
                : () => handleProcess(ProcessTypes.PAUSE)
          }
        >
          <Image
            src={
              video.isLastVideo
                ? replayImg
                : !video.isPlaying
                  ? playImg
                  : pauseImg
            }
            alt={
              video.isLastVideo ? "Replay" : !video.isPlaying ? "Play" : "Pause"
            }
            width={20}
            height={20}
          />
        </button>
      </div>
    </>
  );
}
