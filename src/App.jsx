import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import SceneWrapper from "./components/3d/SceneWrapper";
import Loading from "./components/pages/Loading.jsx";
import MainAudioControl from "./components/ui/MainAudioControl.jsx";
import { tracks } from "./utils/trackData.js";
import {
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsFillHouseDoorFill,
} from "react-icons/bs";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [cameraReset, setCameraReset] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !muted;
    audioRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  const handleCameraReset = () => {
    if (isAnimating) return;
    setCameraReset((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isAnimating) {
        if (event.key === "Escape") {
          handleCameraReset();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnimating]);

  return (
    <div className="relative h-screen w-full bg-black flex ">
      <Canvas camera={{ position: [16.5, 4, 14.5], fov: 35 }} className="z-0">
        <SceneWrapper
          setLoaded={setLoaded}
          audioRef={audioRef}
          showLoading={showLoading}
          cameraReset={cameraReset}
          setCameraReset={setCameraReset}
          setIsAnimating={setIsAnimating}
         
        />
      </Canvas>
      <div className="absolute pointer-events-none text-3xl w-full h-full text-neutral-200 font-mono z-10 flex flex-col">
        {showLoading ? (
          <Loading loaded={loaded} setShowLoading={setShowLoading} />
        ) : (
          <div className="absolute pointer-events-none p-4 w-full h-full flex items-start justify-between">
            <button
              onClick={handleCameraReset}
              className="pointer-events-auto p-4  bg-neutral-800/40 backdrop-blur-xs rounded-xl cursor-pointer hover:bg-neutral-800"
            >
              <BsFillHouseDoorFill className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <div className="h-full flex gap-2">
              <audio
                ref={audioRef}
                src={tracks[0]?.src}
                className="hidden"
                autoPlay
              />
              <MainAudioControl audioRef={audioRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
