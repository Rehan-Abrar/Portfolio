import { Html } from "@react-three/drei";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Vector3 } from "three";
import { navConfig } from "../../utils/navConfig.js";

export default function AttachHtmlToMesh({ mesh, children }) {
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [position, setPosition] = useState([0, 0, 0]);
  const [isMedium, setIsMedium] = useState(window.innerWidth >= 768);
  const htmlRef = useRef();

  const configEntry = Object.values(navConfig).find(
    (entry) => entry.target === mesh?.name,
  );

  // Step 1: Set the size
  useLayoutEffect(() => {
    if (!mesh || !configEntry) return;

    mesh.geometry?.computeBoundingBox();
    const box = mesh.geometry?.boundingBox;
    if (!box) return;

    const axisMap = {
      x: box.max.x - box.min.x,
      y: box.max.y - box.min.y,
      z: box.max.z - box.min.z,
    };

    const width = axisMap[configEntry.htmlSizeAxis[0]] || 1;
    const height = axisMap[configEntry.htmlSizeAxis[1]] || 1;
    setSize({ width, height });
  }, [mesh, configEntry]);

  // Step 2: After size has been applied and rendered
  useEffect(() => {
    if (!mesh || !configEntry) return;

    const raf = requestAnimationFrame(() => {
      // Now that size is applied, compute position
      const box = mesh.geometry?.boundingBox;
      if (!box) return;

      const center = new Vector3();
      box.getCenter(center);
      mesh.localToWorld(center);

      setPosition([
        center.x + configEntry.htmlOffset[0],
        center.y + configEntry.htmlOffset[1],
        center.z + configEntry.htmlOffset[2],
      ]);
    });

    return () => cancelAnimationFrame(raf);
  }, [size, mesh, configEntry]);

  if (!mesh || !configEntry) return null;

  useEffect(() => {
    const onResize = () => setIsMedium(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const distanceFactor = isMedium ? 0.4 : 0.6; // md+ = 0.4, below md = 0.6
  const multiplier = isMedium ? 1000 : 700; // md+ = 1000px, below md = 700px

  return (
    <Html
      ref={htmlRef}
      position={position}
      rotation={configEntry.htmlRotation}
      transform
      occlude="blending"
      center
      distanceFactor={distanceFactor}
      style={{
        width: `${size.width * multiplier}px`,
        height: `${size.height * multiplier}px`,
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </Html>
  );
}
