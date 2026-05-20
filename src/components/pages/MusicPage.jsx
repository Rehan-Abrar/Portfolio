import { useRef, useState } from "react";
import AudioVisualizer from "../ui/AudioVisualizer";
import AudioControls from "../ui/AudioControls";
import { tracks } from "../../utils/trackData.js";

export default function MusicPage({ audioRef }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks[currentTrackIndex];

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = prevIndex === tracks.length - 1 ? 0 : prevIndex + 1;

      // change the audio src via ref
      if (audioRef.current) {
        audioRef.current.src = tracks[newIndex].src;
        audioRef.current.play();
      }

      return newIndex;
    });
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? tracks.length - 1 : prevIndex - 1;

      if (audioRef.current) {
        audioRef.current.src = tracks[newIndex].src;
        audioRef.current.play();
      }
      return newIndex;
    });
  };

  return (
    <div className="select-none relative w-full h-full bg-neutral-200 text-white font-mono">
      <div className="absolute w-full h-full bg-grid"></div>
      <div className="absolute w-full h-full ">
        {audioRef.current && <AudioVisualizer audioRef={audioRef} />}
      </div>
      <div className="absolute w-full h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-transparent to-neutral-200/60">
        <img
          src={currentTrack.image}
          alt="Track Art"
          className="h-2/3 object-cover mb-4 md:mb-8 rounded-2xl shadow-lg shadow-neutral-500 backdrop-blur-3xl bg-neutral-200/60 border border-neutral-50"
        />
        <div className="flex-col text-neutral-900 text-3xl md:text-5xl w-full flex h-full items-center justify-around">
          <h1 className="pl-4 w-full">{currentTrack.title}</h1>
          <AudioControls
            currentTrackIndex={currentTrackIndex}
            audioRef={audioRef}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      </div>
    </div>
  );
}
