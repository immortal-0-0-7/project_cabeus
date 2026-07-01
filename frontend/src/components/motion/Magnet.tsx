import { useCallback, useRef, useState, type ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const inRange =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (!inRange) {
        setActive(false);
        setTransform('translate3d(0, 0, 0)');
        return;
      }

      setActive(true);
      const dx = (e.clientX - centerX) / strength;
      const dy = (e.clientY - centerY) / strength;
      setTransform(`translate3d(${dx}px, ${dy}px, 0)`);
    },
    [padding, strength],
  );

  const handleLeave = useCallback(() => {
    setActive(false);
    setTransform('translate3d(0, 0, 0)');
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        transition: active ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
