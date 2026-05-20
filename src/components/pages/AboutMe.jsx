import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

export default function AboutMe({ setTarget }) {
  const t = {
    title: "About Me",
    name: "I'm Rehan Abrar",
    desc1:
      "Passionate about building real-world software and learning new technologies through hands-on development.",
    desc2:
      "CS student at Riphah International University focused on full-stack development and AI systems.",
    cv: "Check out my CV",
    cvFile: "/images/Rehan_Abrar_CV.pdf",
  };

  return (
    <div className="h-full w-full relative bg-neutral-200 select-none ">
      <div className="absolute w-full h-full bg-grid"></div>
      <div className="absolute w-full h-full text-sm md:text-xl p-4 flex flex-col items-center justify-between border gap-2 font-mono">
        <div className="w-full text-center items-center justify-between flex ">
          <button onClick={() => setTarget("Contact_Red_Text_Target")}>
            <MdKeyboardArrowLeft className="w-7 h-7 md:w-12 md:h-12" />
          </button>
          <h1 className="text-2xl md:text-4xl">{t.title}</h1>
          <button onClick={() => setTarget("Contact_Red_Text_Target")}>
            <MdKeyboardArrowRight className="w-7 h-7 md:w-12 md:h-12" />
          </button>
        </div>

        <img
          src="images/projects/profile.jpg"
          className="flex object-cover rounded-4xl shadow-lg shadow-neutral-500 h-1/3 border border-neutral-50"
        />

        <div className="w-full h-full text-center items-center justify-between flex flex-col font-mono p-2 ">
          <p className="font-bold text-2xl md:text-3xl">{t.name}</p>
          <p>{t.desc1}</p>
          <p>{t.desc2}</p>

          <a
            href={t.cvFile}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono flex gap-4 items-center justify-center px-4 py-2 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform bg-neutral-200/80  border border-neutral-50 "
          >
            {t.cv}
          </a>
        </div>
      </div>
    </div>
  );
}
