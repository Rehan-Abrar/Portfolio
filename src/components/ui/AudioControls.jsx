import { useEffect, useState } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipStartFill,
  BsSkipEndFill,
} from "react-icons/bs";
import AudioSlider from "../ui/AudioSlider.jsx";

export default function AudioControls({
  currentTrackIndex,
  audioRef,
  onNext,
  onPrev,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime || 0);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => onNext();

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    // If metadata is already loaded (first load case)
    if (audio.readyState >= 1) {
      updateDuration();
    }

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef, onNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(true);
    setProgress(0);
    audio.play();
  }, [currentTrackIndex, audioRef]);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
    setProgress(value);
  };

  return (
    <div className=" w-full flex flex-col items-center justify-center p-4">
      <AudioSlider
        duration={duration}
        progress={progress}
        onChange={handleSeek}
      />
      <div className="flex items-center gap-6 text-neutral-900 text-4xl">
        <button onClick={onPrev} title="Previous">
          <BsSkipStartFill className="w-7 h-7 md:w-12 md:h-12" />
        </button>
        <button onClick={togglePlay} title="Play/Pause">
          {isPlaying ? (
            <BsPauseFill className="w-8 h-8 md:w-12 md:h-12" />
          ) : (
            <BsPlayFill className="w-8 h-8 md:w-12 md:h-12" />
          )}
        </button>
        <button onClick={onNext} title="Next">
          <BsSkipEndFill className="w-8 h-8 md:w-12 md:h-12" />
        </button>
      </div>
    </div>
  );
}
