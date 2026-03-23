import { useState, useEffect } from "react";

const messages = [
  { sender: "Mom", text: "Where are you?", align: "left" as const },
  { sender: "You", text: "Studying", align: "right" as const },
  { sender: "Mom", text: "Send photo", align: "left" as const },
  { sender: "You", text: "😅", align: "right" as const },
];

export default function ChatTypingDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (visibleCount >= messages.length) {
      const reset = setTimeout(() => setVisibleCount(0), 2500);
      return () => clearTimeout(reset);
    }
    setTyping(true);
    const show = setTimeout(() => {
      setTyping(false);
      setVisibleCount((c) => c + 1);
    }, 1200);
    return () => clearTimeout(show);
  }, [visibleCount]);

  const nextIsLeft = visibleCount < messages.length && messages[visibleCount].align === "left";

  return (
    <div className="w-full max-w-xs mx-auto mt-8 rounded-2xl bg-card/80 border border-border backdrop-blur-sm p-4 space-y-2">
      {messages.slice(0, visibleCount).map((msg, i) => (
        <div
          key={`${i}-${visibleCount}`}
          className={`flex ${msg.align === "right" ? "justify-end" : "justify-start"} animate-fade-in`}
        >
          <div
            className={`px-3 py-1.5 rounded-2xl text-sm max-w-[75%] ${
              msg.align === "right"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary text-secondary-foreground rounded-bl-md"
            }`}
          >
            <span className="block text-[10px] opacity-60 mb-0.5">{msg.sender}</span>
            {msg.text}
          </div>
        </div>
      ))}
      {typing && visibleCount < messages.length && (
        <div className={`flex ${nextIsLeft ? "justify-start" : "justify-end"} animate-fade-in`}>
          <div className={`px-3 py-2 rounded-2xl text-sm ${nextIsLeft ? "bg-secondary rounded-bl-md" : "bg-primary rounded-br-md"}`}>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
