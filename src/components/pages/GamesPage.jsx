export default function GamesPage() {
  const t = { title: "Coming Soon" };
  return (
    <div className="relative w-full h-full bg-neutral-200">
      <div className="absolute bg-grid w-full h-full "></div>
      <div className="w-full h-full flex items-center justify-center font-mono">
        <h1 className="text-neutral-600 text-5xl">{t.title}</h1>
      </div>
    </div>
  );
}
