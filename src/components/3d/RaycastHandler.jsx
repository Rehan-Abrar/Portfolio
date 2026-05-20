import { useEffect, useRef, useCallback, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { navConfig } from "../../utils/navConfig.js";

export default function RaycastHandler({
  targets,
  controlsRef,
  setScreenMesh,
  setTarget,
  screenMesh,
  currentTarget,
  setIsAnimating,
}) {
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const hovered = useRef(null);
  const hoverTargets = useRef([]);
  const { camera, gl } = useThree();
  const [animating, setAnimating] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // --- helpers ---
  const findNavEntryBy = useCallback(
    (key, value) =>
      Object.values(navConfig).find((conf) => conf[key] === value),
    [],
  );

  const findTargetByName = useCallback(
    (name) => targets.find((o) => o.name === name),
    [targets],
  );

  const playHoverAnimation = useCallback((object, on) => {
    if (!object) return;
    const targetScale = on
      ? object.userData.initialScale.clone().multiplyScalar(1.1)
      : object.userData.initialScale;
    const targetColor = on ? "#ffffff" : "#ff4444";

    gsap.to(object.scale, {
      x: targetScale.x,
      y: targetScale.y,
      z: targetScale.z,
      duration: 0.4,
      ease: "back.out(1.8)",
      overwrite: "auto",
    });

    gsap.to(object.material.color, {
      ...new THREE.Color(targetColor),
      duration: 0.4,
      overwrite: "auto",
    });
  }, []);

  const focusCameraOnObject = useCallback(
    (object) => {
      if (!currentTarget) return;
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

      const configEntry = findNavEntryBy("target", object.name);
      const offsetArray = configEntry?.cameraOffset || [0, 0, 1];
      const offsetDirection = new THREE.Vector3(...offsetArray).normalize();
      const newCameraPos = center
        .clone()
        .add(offsetDirection.multiplyScalar(cameraZ));

      gsap.killTweensOf([controlsRef.current.target, camera.position]);

      gsap.to(controlsRef.current.target, {
        x: center.x,
        y: center.y,
        z: center.z,
        duration: 2,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(camera.position, {
        x: newCameraPos.x,
        y: newCameraPos.y,
        z: newCameraPos.z,
        duration: 2,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: () => {
          camera.lookAt(controlsRef.current.target);
          controlsRef.current.update();
        },
        onComplete: () => {
          controlsRef.current.enabled = true;
          controlsRef.current.enableZoom = true;
          setAnimating(false);
          setIsAnimating(false);
        },
      });
    },
    [camera, controlsRef, findNavEntryBy, currentTarget],
  );

  // detect touch devices
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // update pointer coordinates relative to canvas
  const updatePointer = (clientX, clientY) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  // handle hover movement (desktop only)
  useEffect(() => {
    const handleMove = (e) => {
      if (isTouch) return; // skip hover on mobile
      updatePointer(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [isTouch]);

  useEffect(() => {
    hoverTargets.current = targets.filter((t) =>
      Object.values(navConfig).some((conf) => conf.glass === t.name),
    );
  }, [targets]);

  useEffect(() => {
    return () => {
      gsap.globalTimeline.clear();
    };
  }, []);

  // hover logic (desktop only)
  useFrame(() => {
    if (isTouch) return;

    raycaster.current.setFromCamera(pointer.current, camera);
    const intersects = raycaster.current.intersectObjects(targets);

    if (intersects.length > 0) {
      const hit = intersects[0].object;

      if (hoverTargets.current.includes(hit)) {
        const navEntry = findNavEntryBy("glass", hit.name);
        if (!navEntry) return;

        if (hovered.current !== hit) {
          if (hovered.current) {
            const prevEntry = findNavEntryBy("glass", hovered.current.name);
            if (prevEntry) {
              playHoverAnimation(findTargetByName(prevEntry.text), false);
            }
          }

          hovered.current = hit;
          playHoverAnimation(findTargetByName(navEntry.text), true);
        }

        document.body.style.cursor = "pointer";
      } else {
        if (hovered.current) {
          const prevEntry = findNavEntryBy("glass", hovered.current.name);
          if (prevEntry) {
            playHoverAnimation(findTargetByName(prevEntry.text), false);
          }
          hovered.current = null;
        }

        if (hit.name.includes("Screen") && hit !== screenMesh) {
          document.body.style.cursor = "pointer";
        } else {
          document.body.style.cursor = "default";
        }
      }
    } else {
      if (hovered.current) {
        const prevEntry = findNavEntryBy("glass", hovered.current.name);
        if (prevEntry) {
          playHoverAnimation(findTargetByName(prevEntry.text), false);
        }
        hovered.current = null;
      }
      document.body.style.cursor = "default";
    }
  });

  // focus camera when screenMesh changes
  useEffect(() => {
    if (screenMesh) {
      controlsRef.current.enabled = false;
      controlsRef.current.enableZoom = false;
      setAnimating(true);
      setIsAnimating(true);
      focusCameraOnObject(screenMesh);
    }
  }, [screenMesh, currentTarget, focusCameraOnObject]);

  // handle click / tap
  useEffect(() => {
    const handleClick = (e) => {
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      updatePointer(clientX, clientY);
      raycaster.current.setFromCamera(pointer.current, camera);

      const intersects = raycaster.current.intersectObjects(targets);
      if (intersects.length === 0) return;

      const clicked = intersects[0].object;

      if (clicked.name.includes("Screen")) {
        if (clicked === screenMesh) {
          controlsRef.current.enabled = false;
        }

        const navEntry = findNavEntryBy("target", clicked.name);
        if (!navEntry) return;

        const screenTarget = findTargetByName(navEntry.target);
        if (screenTarget && screenTarget !== screenMesh) {
          setScreenMesh?.(screenTarget);
          setTarget(navEntry.text);
        }
      } else if (clicked.name.includes("Glass")) {
        const navEntry = findNavEntryBy("glass", clicked.name);
        if (!navEntry) return;
        const screenTarget = findTargetByName(navEntry.target);
        if (screenTarget) {
          setScreenMesh?.(screenTarget);
          setTarget(navEntry.text);
        }
      }
    };

    const handlePointerUp = () => {
      if (animating) return;
      controlsRef.current.enabled = true;
    };

    window.addEventListener("pointerdown", handleClick);
    window.addEventListener("touchstart", handleClick);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("pointerdown", handleClick);
      window.removeEventListener("touchstart", handleClick);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [
    targets,
    camera,
    controlsRef,
    setScreenMesh,
    screenMesh,
    setTarget,
    findNavEntryBy,
    findTargetByName,
    animating,
  ]);

  return null;
}
