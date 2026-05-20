export const createCards = (count) => {
  const colors = ["#ee4035", "#f37736", "#fdf498", "#7bc043", "#0392cf"];

  return Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="w-full h-full flex items-center justify-center rounded-3xl text-white text-2xl"
      style={{ backgroundColor: colors[i % colors.length] }}
    >
      {`Card ${i + 1}`}
    </div>
  ));
};

export const createImageCards = (images) => {
  const cards = [];

  if (images.length === 0) return cards;

  // Decide totalCards based on conditions
  let totalCards;
  if (images.length >= 5) {
    totalCards = images.length;
  } else if (images.length < 5 && images.length % 2 === 0) {
    // Less than 5 and even number of images: return 6 cards
    totalCards = 6;
  } else {
    // Less than 5 and odd number of images: return 5 cards
    totalCards = 5;
  }

  for (let i = 0; i < totalCards; i++) {
    const image = images[i % images.length];

    cards.push(
      <div
        key={`image-${i}`}
        className="w-full h-full flex items-center justify-center rounded-3xl overflow-hidden shadow-neutral-500 bg-neutral-100/80 p-2"
      >
        <img
          src={image.src}
          alt={image.alt || `Image ${i + 1}`}
          className="object-contain max-w-full max-h-full"
        />
      </div>,
    );
  }

  return cards;
};
