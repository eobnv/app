import { useRef, useState, useEffect, useCallback } from 'react';

interface OptionWheelProps {
  items: { id: string; label: string; icon?: React.ReactNode }[];
  defaultSelected?: number;
  onChange: (index: number, id: string) => void;
  textColor?: string;
  activeColor?: string;
  fontSize?: number;
  spacing?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
}

export function OptionWheel({
  items,
  defaultSelected = 0,
  onChange,
  textColor = '#6a6a80',
  activeColor = '#60a5fa',
  fontSize = 1.4,
  spacing = 1.8,
  tilt = 10,
  blur = 1.5,
  fade = 0.35,
  minOpacity = 0.05,
  smoothing = 250,
}: OptionWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const lastPointerY = useRef(0);
  const lastPointerTime = useRef(0);
  const velocity = useRef(0);

  const rafRef = useRef<number>(0);
  const currentScroll = useRef(0);
  const targetScroll = useRef(0);
  const itemHeight = fontSize * spacing * 16;
  const maxScroll = (items.length - 1) * itemHeight;

  // Spring animation loop — critically damped spring for buttery smooth motion
  const animate = useCallback(() => {
    const stiffness = 0.12;
    const damping = 0.78;

    const diff = targetScroll.current - currentScroll.current;
    velocity.current = velocity.current * damping + diff * stiffness;
    currentScroll.current += velocity.current;

    if (Math.abs(diff) < 0.3 && Math.abs(velocity.current) < 0.3) {
      currentScroll.current = targetScroll.current;
      velocity.current = 0;
      setScrollY(targetScroll.current);
    } else {
      setScrollY(currentScroll.current);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Set initial position
  useEffect(() => {
    targetScroll.current = defaultSelected * itemHeight;
    currentScroll.current = defaultSelected * itemHeight;
    velocity.current = 0;
    setScrollY(defaultSelected * itemHeight);
  }, [defaultSelected, itemHeight]);

  // Snap to nearest item after interaction ends
  const snapToNearest = useCallback(() => {
    const nearest = Math.round(targetScroll.current / itemHeight);
    targetScroll.current = Math.max(0, Math.min(maxScroll, nearest * itemHeight));
  }, [itemHeight, maxScroll]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Use deltaY directly for 1:1 scroll feel, clamp at bounds
    targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current + e.deltaY * 0.6));
  }, [maxScroll]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScroll.current = targetScroll.current;
    lastPointerY.current = e.clientY;
    lastPointerTime.current = Date.now();
    velocity.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const now = Date.now();
    const dt = Math.max(1, now - lastPointerTime.current);
    const delta = dragStartY.current - e.clientY;
    const newScroll = dragStartScroll.current + delta;
    targetScroll.current = Math.max(0, Math.min(maxScroll, newScroll));

    // Track velocity for inertia
    const pointerDelta = lastPointerY.current - e.clientY;
    velocity.current = (pointerDelta / dt) * 16; // pixels per frame
    lastPointerY.current = e.clientY;
    lastPointerTime.current = now;
  }, [isDragging, maxScroll]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    // Apply inertia then snap
    targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current + velocity.current * 8));
    snapToNearest();
  }, [isDragging, snapToNearest]);

  // Detect selected index when scroll settles
  const lastIndexRef = useRef(defaultSelected);
  useEffect(() => {
    const newIndex = Math.round(currentScroll.current / itemHeight);
    if (newIndex !== lastIndexRef.current && newIndex >= 0 && newIndex < items.length) {
      lastIndexRef.current = newIndex;
      onChange(newIndex, items[newIndex].id);
    }
  }, [scrollY, itemHeight, items, onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nearest = Math.round(targetScroll.current / itemHeight);
      targetScroll.current = Math.min(maxScroll, (nearest + 1) * itemHeight);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nearest = Math.round(targetScroll.current / itemHeight);
      targetScroll.current = Math.max(0, (nearest - 1) * itemHeight);
    }
  }, [itemHeight, maxScroll]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      tabIndex={0}
      className="option-wheel relative cursor-grab active:cursor-grabbing select-none"
      style={{
        height: `${items.length * itemHeight}px`,
        maxHeight: '60vh',
        perspective: '1200px',
        touchAction: 'none',
      }}
    >
      {/* Gradient fade mask */}
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-xl"
        style={{
          background: `linear-gradient(to bottom,
            var(--bg-secondary) 0%,
            transparent 30%,
            transparent 70%,
            var(--bg-secondary) 100%)`,
        }}
      />

      {/* Items */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: `calc(50% - ${itemHeight / 2}px)`,
          transform: `translate3d(0, ${-scrollY}px, 0)`,
        }}
      >
        {items.map((item, index) => {
          const distance = index - scrollY / itemHeight;
          const absDistance = Math.abs(distance);
          const opacity = Math.max(minOpacity, 1 - absDistance * fade);
          const rotateX = distance * tilt;
          const blurAmount = Math.max(0, absDistance - 0.5) * blur;
          const translateY = index * itemHeight;
          const isActive = Math.round(scrollY / itemHeight) === index;
          const scale = isActive ? 1.12 : 1 - absDistance * 0.05;

          return (
            <div
              key={item.id}
              className="absolute left-0 right-0 flex items-center justify-center"
              style={{
                top: `${translateY}px`,
                height: `${itemHeight}px`,
                opacity,
                filter: blurAmount > 0.1 ? `blur(${blurAmount}px)` : 'none',
                transform: `rotateX(${rotateX}deg) translateZ(${absDistance * -40}px) scale(${scale})`,
                transformStyle: 'preserve-3d',
                transition: 'color 0.3s ease, text-shadow 0.3s ease, font-weight 0.3s ease',
                color: isActive ? activeColor : textColor,
                textShadow: isActive ? `0 0 24px ${activeColor}60` : 'none',
                fontWeight: isActive ? 700 : 400,
                fontSize: `${fontSize}rem`,
                willChange: 'transform, opacity, filter',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="flex items-center gap-3 whitespace-nowrap">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
