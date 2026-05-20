import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiGoogle,
  SiPython,
  SiFastapi,
  SiWhatsapp,
  SiFlutter,
  SiFirebase,
  SiGooglemaps,
  SiNextdotjs,
  SiStripe,
  SiSanity,
  SiFramer,
  SiOpencv,
  SiScikitlearn,
} from "react-icons/si";

export const projects = [
  {
    title: "Meshlyy — Creator-Brand Collaboration Platform",
    shortTitle: "Meshlyy",
    can: "/images/MeshlyyCan.webp",
    images: [
      { src: "/images/projects/Meshlyy/1st.jpg", alt: "Meshlyy dashboard" },
      { src: "/images/projects/Meshlyy/2nd.jpg", alt: "Campaign matching UI" },
      { src: "/images/projects/Meshlyy/3rd.jpg", alt: "Influencer profiles" },
    ],
    description:
      "Full-stack SaaS platform connecting creators and brands with AI-powered campaign matching, influencer scoring, and automated collaboration workflows using Gemini AI and Apify scraping pipelines.",
    tech: [SiReact, SiTypescript, SiNodedotjs, SiExpress, SiSupabase, SiGoogle],
    features: [
      "AI-powered influencer-brand matching system using Gemini AI.",
      "Instagram data scraping pipeline using Apify.",
      "Full authentication and admin dashboard with Supabase.",
      "Scalable modular backend with Express architecture.",
      "Real-time analytics for campaigns and engagement tracking.",
    ],
    date: "2026",
    github: "https://github.com/Rehan-Abrar/Meshlyy",
  },

  {
    title: "Khetaan — WhatsApp AI Assistant for Farmers",
    shortTitle: "Khetaan",
    can: "/images/KhetaanCan.webp",
    images: [
      { src: "/images/projects/Khetaan/1st.jpg", alt: "Chat interface" },
      { src: "/images/projects/Khetaan/2nd.jpg", alt: "Disease detection output" },
      { src: "/images/projects/Khetaan/3rd.jpg", alt: "Weather insights" },
    ],
    description:
      "WhatsApp-native AI assistant for farmers providing crop disease diagnosis, weather forecasting, and market price insights in Urdu/Roman Urdu using multi-agent AI orchestration.",
    tech: [SiPython, SiFastapi, SiWhatsapp, SiGoogle],
    features: [
      "Multi-agent AI system for agriculture insights.",
      "Crop disease detection using Gemini AI.",
      "Real-time weather and mandi price integration.",
      "WhatsApp Cloud API based conversational interface.",
      "Fully backend-driven AI orchestration via FastAPI.",
    ],
    date: "2026",
    github: "https://github.com/Rehan-Abrar/Khetaan",
  },

  {
    title: "FindIt — Lost & Found Mobile App",
    shortTitle: "FindIt",
    can: "/images/FindItCan.webp",
    images: [
      { src: "/images/projects/FindIt/1st.jpg", alt: "Map feed" },
      { src: "/images/projects/FindIt/2nd.jpg", alt: "Lost item post" },
      { src: "/images/projects/FindIt/3rd.jpg", alt: "Chat system" },
      { src: "/images/projects/FindIt/4th.jpg", alt: "User profile" },
    ],
    description:
      "Cross-platform Flutter app for lost & found items with real-time Firestore sync, chat system, location-based discovery, and offline-first caching.",
    tech: [SiFlutter, SiFirebase, SiGooglemaps],
    features: [
      "Real-time Firestore-based item tracking system.",
      "Map-based lost & found discovery interface.",
      "In-app chat system for item recovery.",
      "Cloudinary image upload pipeline.",
      "Offline caching using SQLite for resilience.",
    ],
    date: "2025",
    github: "https://github.com/Rehan-Abrar/FindIt",
  },

  {
    title: "Floraviva — E-Commerce Platform",
    shortTitle: "Floraviva",
    can: "/images/FloravivaCan.webp",
    images: [
      { src: "/images/projects/Floraviva/1st.gif", alt: "Storefront UI" },
      { src: "/images/projects/Floraviva/2nd.jpg", alt: "Product page" },
      { src: "/images/projects/Floraviva/3rd.jpg", alt: "Cart system" },
      { src: "/images/projects/Floraviva/4th.jpg", alt: "Checkout flow" },
    ],
    description:
      "Modern CMS-driven e-commerce platform with Stripe payments, animated UI, and scalable backend integration using Sanity CMS and Cloudinary.",
    tech: [SiNextdotjs, SiTypescript, SiStripe, SiSanity, SiFramer],
    features: [
      "Stripe-based secure payment system.",
      "CMS-driven product management with Sanity.",
      "Animated UI with Framer Motion.",
      "State management using Zustand.",
      "Optional 3D product visualization support.",
    ],
    date: "2025",
    github: "https://github.com/Rehan-Abrar/floraviva",
  },

  {
    title: "Cheating Pattern Detector — AI Proctoring System",
    shortTitle: "Cheating Detector",
    can: "/images/CheatingDetectorCan.webp",
    images: [
      { src: "/images/projects/CheatingDetector/1st.jpg", alt: "Face detection" },
      { src: "/images/projects/CheatingDetector/2nd.jpg", alt: "Gaze tracking" },
      { src: "/images/projects/CheatingDetector/3rd.jpg", alt: "Risk scoring" },
    ],
    description:
      "Real-time AI-based exam monitoring system using computer vision for gaze tracking, head pose estimation, and cheating risk detection.",
    tech: [SiPython, SiOpencv, SiScikitlearn],
    features: [
      "Real-time gaze tracking and head pose estimation.",
      "Multi-face detection for exam monitoring.",
      "Log-based behavioral risk scoring system.",
      "Feature extraction pipeline for ML classification.",
      "Session-based monitoring and reporting system.",
    ],
    date: "2025",
    github: "https://github.com/Rehan-Abrar/Cheating-Pattern-Detector",
  },
];

// IMPORTANT: Add the image folders and files under public/images/projects/<Project>/
// Also ensure the imported icons exist in react-icons; replace placeholders as needed.
