import { useRef, useEffect, useState } from "react";

export default function VolumeSlider({ volume = 1, onChange }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSeek = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const clampedOffset = Math.max(0, Math.min(offsetY, rect.height));
    const newVolume = 1 - clampedOffset / rect.height; // Invert Y
    onChange(newVolume);
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
    const offsetY = clientY - rect.top;
    const clampedOffset = Math.max(0, Math.min(offsetY, rect.height));
    const newVolume = 1 - clampedOffset / rect.height;
    onChange(newVolume);
  };

  useEffect(() => {
    const moveHandler = (e) => handleDrag(e);
    const upHandler = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
      window.addEventListener("touchmove", moveHandler);
      window.addEventListener("touchend", upHandler);
    }

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", upHandler);
    };
  }, [isDragging]);

  const volumePercent = Math.max(0, Math.min(volume, 1)) * 100;

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div
        ref={trackRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onClick={handleSeek}
        className="relative h-full w-2 bg-neutral-300 rounded cursor-pointer"
      >
        {/* Fill line */}
        <div
          className="absolute bottom-0 w-full bg-red-500 rounded"
          style={{ height: `${volumePercent}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute left-1/2 w-4 h-4 bg-red-600 rounded-full -translate-x-1/2 translate-y-1/2"
          style={{ bottom: `${volumePercent}%` }}
        />
      </div>
    </div>
  );
}
