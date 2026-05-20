export default function TechCarousel({ icons }) {
  return (
    <div className="overflow-hidden w-full relative">
      {/* Inline style tag to define the keyframes */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}
      </style>

      <div className="flex w-[200%] animate-scroll">
        {[...icons, ...icons].map((Icon, idx) => (
          <div key={idx} className="flex-1 flex justify-center">
            <Icon size={40} className="text-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
