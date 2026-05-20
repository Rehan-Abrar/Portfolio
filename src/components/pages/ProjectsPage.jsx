import { useState } from "react";
import { projects } from "../../utils/projectsData";
import { BsGithub } from "react-icons/bs";
import Carousel from "../ui/Carousel.jsx";
import { createImageCards } from "../../utils/cardFactory.jsx";
import TechCarousel from "../ui/TechCarousel.jsx";

const ITEMS_PER_PAGE = 9;

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const t = {
    back: "Back to Projects",
    prev: "Prev",
    next: "Next",
    page: "Page",
    of: "of",
    madeFor: "Developed for:",
  };

  if (selectedProject) {
    // Fullscreen view
    return (
      <div className="font-mono w-full h-full relative bg-neutral-200 select-none text-xl md:text-3xl">
        <div className="absolute w-full h-full bg-grid"></div>
        <div className="absolute w-full h-full p-6 flex flex-col items-center justify-between gap-2">
          <div className="flex items-center justify-center overflow-hidden w-full h-2/5">
            <Carousel items={createImageCards(selectedProject.images)} />
          </div>

          <div className="md:gap-2 h-3/5 w-full flex flex-col justify-around">
            <div className="text-center w-full flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold">
                {selectedProject.title}
              </h1>
              <h2 className="text-xl font-light">{selectedProject.date}</h2>
            </div>
            {selectedProject.madeFor && (
              <div className="flex md:flex-col gap-6 md:gap-0 justify-center items-center w-full ">
                <p className="text-xl md:text-2xl font-bold">{t.madeFor}</p>
                <a
                  href={selectedProject.madeFor[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" flex gap-4 items-center justify-center text-center px-4 py-2 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform"
                >
                  {selectedProject.madeFor[0]}
                </a>
              </div>
            )}
            <p className="text-center">{selectedProject.description}</p>

            <div className="w-full">
              <TechCarousel icons={selectedProject.tech} />
            </div>

            <ul className="list-disc pl-6 text-lg md:text-2xl">
              {(selectedProject.features || []).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <div className="flex justify-between items-center w-full gap-6 p-2">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full font-mono flex gap-4 items-center justify-center p-4 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform"
              >
                {t.back}
              </button>

              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full font-mono flex gap-4 items-center justify-center p-4 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform"
              >
                <BsGithub />
                Github{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="w-full h-full relative bg-neutral-200 select-none font-mono text-2xl md:text-3xl text-center">
      <div className="absolute w-full h-full bg-grid"></div>
      <div className="absolute w-full h-full  font-mono p-8 flex flex-col items-center gap-6">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-4">
          {currentProjects.map((project, index) => (
            <div
              key={index}
              onClick={() => setSelectedProject(project)}
              className="flex flex-col shadow-lg shadow-neutral-500 bg-neutral-200/60 backdrop-blur-xs items-center justify-center rounded-2xl cursor-pointer hover:scale-105 transition-transform border border-neutral-50"
            >
              <img
                src={project.can}
                alt={project.shortTitle || project.title}
                className="w-full h-full object-contain p-2"
              />
              <div className="p-2 font-mono">
                {project.shortTitle || project.title}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl shadow-md ${
              currentPage === 1
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-neutral-100 hover:bg-neutral-300"
            }`}
          >
            {t.prev}
          </button>

          <span className="flex items-center">
            {t.page} {currentPage} {t.of} {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl shadow-md ${
              currentPage === totalPages
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-neutral-100 hover:bg-neutral-300"
            }`}
          >
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
