import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useMouseRef() {
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return mouse;
}
