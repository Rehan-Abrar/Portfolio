import { BsLinkedin, BsGithub, BsTwitterX } from "react-icons/bs";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { useForm } from "@formspree/react";
import React, { useState, useEffect } from "react";

export default function ContactPage({ setTarget }) {
  const [state, handleSubmit] = useForm("mzzvpzbg");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state.succeeded) setShowModal(true);
  }, [state.succeeded]);

  const content = {
    en: {
      title: "Contact Me",
      findMe: "You can find me on:",
      orMessage: "Or send me a message:",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send",
      sentTitle: "Message Sent!",
      sentMsg: "Thanks for reaching out. I’ll get back to you soon.",
      close: "Close",
    },
    es: {
      title: "Contáctame",
      findMe: "Puedes encontrarme en:",
      orMessage: "O envíame un mensaje:",
      name: "Nombre",
      email: "Correo electrónico",
      message: "Mensaje",
      send: "Enviar",
      sentTitle: "¡Mensaje enviado!",
      sentMsg: "Gracias por contactarme. Te responderé pronto.",
      close: "Cerrar",
    },
  };

  const t = content.en;

  return (
    <div className="w-full h-full relative bg-neutral-200 select-none">
      <div className="absolute w-full h-full bg-grid"></div>
      <div className="absolute w-full h-full text-xl md:text-2xl p-4 flex flex-col items-center justify-between border font-mono">
        <div className="w-full text-center items-center justify-between flex font-mono ">
          <button onClick={() => setTarget("AboutMe_Red_Text_Target")}>
            <MdKeyboardArrowLeft className="w-7 h-7 md:w-12 md:h-12" />
          </button>
          <h1 className="text-2xl md:text-4xl">{t.title}</h1>
          <button onClick={() => setTarget("AboutMe_Red_Text_Target")}>
            <MdKeyboardArrowRight className="w-7 h-7 md:w-12 md:h-12" />
          </button>
        </div>

        <div className="w-full text-center items-center justify-center flex flex-col md:gap-4 ">
          <h2 className="w-full text-center text-xl md:text-3xl font-mono">
            {t.findMe}
          </h2>
          <div className="w-full flex items-center justify-around">
            <a
              href="https://www.linkedin.com/in/rehan-abrar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono flex gap-4 items-center justify-center p-4 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform bg-neutral-200/80 border border-neutral-50"
            >
              <BsLinkedin className="w-7 h-7 md:w-12 md:h-12" />
            </a>
            <a
              href="https://github.com/Rehan-Abrar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono flex gap-4 items-center justify-center p-4 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform bg-neutral-200/80 border border-neutral-50"
            >
              <BsGithub className="w-7 h-7 md:w-12 md:h-12" />
            </a>
          </div>
        </div>

        {showModal ? (
          <div className="w-full h-full flex flex-col text-2xl items-center justify-around">
            <h2 className="font-semibold w-full text-center text-3xl">
              {t.sentTitle}
            </h2>
            <p className="w-full text-center">{t.sentMsg}</p>
            <button
              onClick={() => setShowModal(false)}
              className="font-mono flex items-center justify-center py-2 px-4 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform bg-neutral-200/60 border border-neutral-50"
            >
              {t.close}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col text-lg md:text-2xl md:gap-2 mb-4"
          >
            <h2 className="text-xl md:text-3xl w-full text-center font-mono">
              {t.orMessage}
            </h2>
            <div className="w-full h-full px-4">
              <label htmlFor="name" className="font-mono">
                {t.name}
              </label>
              <input
                id="name"
                name="name"
                required
                className="p-2 rounded-2xl bg-neutral-200 shadow-inner shadow-neutral-500 w-full font-mono border border-neutral-50"
              />
            </div>
            <div className="w-full h-full px-4">
              <label htmlFor="email" className="font-mono">
                {t.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="p-2 rounded-2xl shadow-inner bg-neutral-200 shadow-neutral-500 w-full font-mono border border-neutral-50"
              />
            </div>
            <div className="w-full h-full px-4">
              <label htmlFor="message" className="font-mono">
                {t.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="p-2 rounded-2xl shadow-inner bg-neutral-200 shadow-neutral-500 w-full font-mono border border-neutral-50"
              />
            </div>
            <div className="w-full h-full px-4">
              <button
                type="submit"
                className="font-mono flex  items-center justify-center px-4 md:py-2 rounded-2xl shadow-md shadow-neutral-500 hover:scale-105 transition-transform bg-neutral-200/80 border border-neutral-50"
              >
                {t.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
