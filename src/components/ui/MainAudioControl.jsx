import { useState, useRef, useEffect } from "react";
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
import VolumeSlider from "../ui/VolumeSlider.jsx";

const MainAudioControl = ({ audioRef }) => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.2); // range: 0 to 1
  const [showSlider, setShowSlider] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  // Detect touch devices
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      if (vol === 0) {
        setMuted(true);
        audioRef.current.muted = true;
      } else {
        setMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div
      className="h-1/5"
      {...(!isTouch && {
        onMouseEnter: () => setShowSlider(true),
        onMouseLeave: () => setShowSlider(false),
      })}
    >
      <button
        onClick={handleToggleMute}
        className={`pointer-events-auto p-4  backdrop-blur-xs ${showSlider ? "rounded-t-xl bg-neutral-800" : "rounded-xl bg-neutral-800/40"} cursor-pointer hover:bg-neutral-800`}
      >
        {muted ? (
          <BsFillVolumeMuteFill className="w-6 h-6 md:w-8 md:h-8" />
        ) : (
          <BsFillVolumeUpFill className="w-6 h-6 md:w-8 md:h-8" />
        )}
      </button>
      {/* Volume slider (vertical) */}
      {showSlider && (
        <div className="h-full pointer-events-auto bg-neutral-800 rounded-b-xl px-4 pb-4 flex items-center justify-center">
          <VolumeSlider volume={volume} onChange={setVolume} />
        </div>
      )}
    </div>
  );
};

export default MainAudioControl;
