// components/FanAnimator.jsx
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function FanAnimator({ fans }) {
  const zFans = useRef([]);
  const yFans = useRef([]);

  useEffect(() => {
    zFans.current = fans.filter(
      (f) => f.name.includes("Fan_2") || f.name.includes("Fan_5"),
    );
    yFans.current = fans.filter(
      (f) =>
        f.name.includes("Fan") &&
        !f.name.includes("Fan_2") &&
        !f.name.includes("Fan_5"),
    );
  }, [fans]);

  useFrame(() => {
    zFans.current.forEach((fan) => (fan.rotation.y -= 0.01));
    yFans.current.forEach((fan) => (fan.rotation.x -= 0.01));
  });

  return null;
}
