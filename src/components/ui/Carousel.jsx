import { useState, useEffect } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const Carousel = ({ items, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState(null);

  const totalItems = items.length;
  const numCards = 5;

  const getItem = (index) => items[(index + totalItems) % totalItems];

  const offset = transitioning ? (direction === "Next" ? -1 : 1) : 0;

  const visibleItems = [
    getItem(currentIndex - 2),
    getItem(currentIndex - 1),
    getItem(currentIndex),
    getItem(currentIndex + 1),
    getItem(currentIndex + 2),
  ];

  while (visibleItems.length < numCards) {
    visibleItems.push(...items);
  }
  visibleItems.splice(numCards);

  const handleTransition = (dir) => {
    if (transitioning) return;

    setDirection(dir);
    setTransitioning(true);

    setTimeout(() => {
      setTransitioning(false);
      setCurrentIndex((prev) =>
        dir === "Next"
          ? (prev + 1) % totalItems
          : (prev - 1 + totalItems) % totalItems,
      );
    }, 500);
  };

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      handleTransition("Next");
    }, interval);

    return () => clearInterval(timer); // Cleanup
  }, [autoPlay, interval, transitioning]); // Watch transitioning to prevent overlap

  return (
    <div className="relative w-full h-full overflow-hidden p-2 flex items-center justify-center">
      <div className="relative w-[85%] h-full">
        {visibleItems.map((item, index) => {
          const baseOffset = (index - 2 + offset) * 100;

          let scale = 0.9;
          if (!transitioning) {
            scale = index === 2 ? 1 : 0.9;
          } else {
            if (direction === "Next") {
              scale = index === 3 ? 1 : 0.9;
            } else if (direction === "Prev") {
              scale = index === 1 ? 1 : 0.9;
            }
          }

          return (
            <div
              key={item.key}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-3xl"
              style={{
                transform: `translateX(${baseOffset}%) scale(${scale})`,
                transition: transitioning ? "transform 0.5s ease" : "none",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => handleTransition("Prev")}
        className="absolute h-full left-2 top-1/2 -translate-y-1/2  text-neutral-800 px-3 py-1 rounded"
      >
        <MdKeyboardArrowLeft size={80} />
      </button>
      <button
        onClick={() => handleTransition("Next")}
        className="absolute h-full right-2 top-1/2 -translate-y-1/2 text-neutral-800 px-3 py-1 rounded"
      >
        <MdKeyboardArrowRight size={80} />
      </button>
    </div>
  );
};

export default Carousel;
