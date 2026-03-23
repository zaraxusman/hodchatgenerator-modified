import { useMemo } from "react";
import { MessageSquare } from "lucide-react";

export default function FloatingBubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        size: 12 + Math.random() * 20,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 12,
        opacity: 0.03 + Math.random() * 0.04,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {bubbles.map((b) => (
        <MessageSquare
          key={b.id}
          className="absolute text-primary"
          style={{
            left: b.left,
            bottom: "-40px",
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animation: `floatUp ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
