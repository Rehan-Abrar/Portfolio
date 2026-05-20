// components/ModelLoader.jsx
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export default function ModelLoader({ onMeshReady, onFansReady, setLoaded }) {
  const groupRef = useRef();
  const { scene } = useGLTF("models/3dPortfolio.glb");

  const manager = new THREE.LoadingManager();

  manager.onLoad = () => {
    setLoaded(true);
  };

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader(manager);
    const textureMap = {
      First: "textures/First.webp",
      Second: "textures/Second.webp",
      Third: "textures/Third.webp",
    };

    const loaded = {};
    for (const [key, path] of Object.entries(textureMap)) {
      const tex = loader.load(path);
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      loaded[key] = tex;
    }
    return loaded;
  }, []);

  useEffect(() => {
    const interactive = [];
    const fans = [];

    scene.traverse((child) => {
      if (!child.isMesh) return;

      // Apply texture if matches
      for (const key in textures) {
        if (child.name.includes(key)) {
          child.material = new THREE.MeshBasicMaterial({
            map: textures[key],
          });
          child.material.map.minFilter = THREE.LinearFilter;
        }
      }

      // Apply special materials
      if (child.name.includes("Glass")) {
        child.material = new THREE.MeshPhysicalMaterial({
          transparent: true,
          transmission: 1,
          roughness: 0,
          metalness: 0,
          opacity: 1,
          ior: 1.5,
          thickness: 0.1,
          specularIntensity: 1,
          clearcoat: 1,
          clearcoatRoughness: 0,
        });
      } else if (child.name.includes("Red")) {
        child.material = new THREE.MeshBasicMaterial({ color: 0xff2222 });
      } else if (child.name.includes("White")) {
        child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      }

      // Collect fans and interactive objects
      if (child.name.includes("Fan")) fans.push(child);

      if (child.name.includes("Target") || child.name.includes("First")) {
        if (!child.userData.initialScale) {
          child.userData.initialScale = child.scale.clone();
        }
        interactive.push(child);
      }
    });

    onMeshReady?.(interactive);
    onFansReady?.(fans);
  }, [scene, textures, onMeshReady, onFansReady]);

  return <primitive object={scene} ref={groupRef} />;
}
