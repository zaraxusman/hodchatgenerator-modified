import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { target: 500000, label: "Chats Generated", suffix: "+" },
  { target: 120000, label: "Meme Creators", suffix: "+" },
  { target: 1000000, label: "Screenshots Downloaded", suffix: "+" },
];

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toString();
}

function StatItem({ target, label, suffix, started }: { target: number; label: string; suffix: string; started: boolean }) {
  const value = useCountUp(target, 1500, started);
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-display font-bold text-foreground">
        {formatNum(value)}{suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function AnimatedStats() {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto py-12">
      {stats.map((s) => (
        <StatItem key={s.label} {...s} started={visible} />
      ))}
    </div>
  );
}
