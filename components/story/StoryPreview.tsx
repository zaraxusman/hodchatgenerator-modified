import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TimelineItem } from "@/types/story";
import { Play, RotateCcw, Pause, Film, MessageSquare, Type, Image } from "lucide-react";

interface Props {
  timeline: TimelineItem[];
}

export default function StoryPreview({ timeline }: Props) {
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const filledSlots = timeline.filter((t) => t.asset || t.textConfig);
  const totalDuration = timeline.reduce((sum, t) => sum + t.duration, 0);
  const currentItem = timeline[currentIdx];

  const restart = useCallback(() => {
    setCurrentIdx(0);
    setElapsed(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= currentItem?.duration) {
          if (currentIdx < timeline.length - 1) {
            setCurrentIdx((i) => i + 1);
            return 0;
          } else {
            setPlaying(false);
            return prev;
          }
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, currentIdx, currentItem, timeline.length]);

  const globalElapsed = timeline.slice(0, currentIdx).reduce((s, t) => s + t.duration, 0) + elapsed;
  const progress = totalDuration > 0 ? (globalElapsed / totalDuration) * 100 : 0;

  return (
    <div className="sticky top-20 space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Preview</h3>

      {/* 9:16 Phone Frame */}
      <div className="mx-auto" style={{ maxWidth: 280 }}>
        <div className="relative rounded-[24px] border-2 border-border bg-card overflow-hidden" style={{ aspectRatio: "9/16" }}>
          {/* Progress segments */}
          <div className="absolute top-0 left-0 right-0 z-10 flex gap-0.5 p-2">
            {timeline.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full bg-muted-foreground/20 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{
                    width: i < currentIdx ? "100%" : i === currentIdx ? `${(elapsed / currentItem?.duration) * 100}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Slide content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {currentItem ? (
              <SlideRenderer item={currentItem} />
            ) : (
              <div className="text-center p-6">
                <Film className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Select a template to start</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button size="sm" variant="outline" onClick={restart} className="h-8">
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
        <Button size="sm" onClick={() => setPlaying(!playing)} className="h-8 px-4">
          {playing ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
          {playing ? "Pause" : "Play"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{timeline.length}</p>
          <p className="text-[10px] text-muted-foreground">Slides</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{totalDuration}s</p>
          <p className="text-[10px] text-muted-foreground">Duration</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{filledSlots.length}/{timeline.length}</p>
          <p className="text-[10px] text-muted-foreground">Filled</p>
        </div>
      </div>

      {filledSlots.length === timeline.filter((t) => t.required).length && timeline.filter((t) => t.required).length > 0 ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-primary font-medium">Ready to render</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">Fill required slots to export</p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center italic">
        Live preview is for reference only. Final rendered video may vary slightly.
      </p>
    </div>
  );
}

function SlideRenderer({ item }: { item: TimelineItem }) {
  const isText = ["opening_text", "text_slide", "ending_slide"].includes(item.slotType);

  if (isText && item.textConfig) {
    const bg = item.textConfig.backgroundAsset;
    const align = item.textConfig.alignment === "left" ? "items-start text-left" : item.textConfig.alignment === "right" ? "items-end text-right" : "items-center text-center";
    return (
      <div className="relative w-full h-full">
        {/* Background media */}
        {bg?.type === "video" && bg.url ? (
          <video src={bg.url} className="absolute inset-0 w-full h-full object-cover" muted autoPlay loop />
        ) : bg?.url || bg?.thumbnailUrl ? (
          <img src={bg.url || bg.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-background" />
        )}
        {/* Dark overlay for text readability when background exists */}
        {bg && <div className="absolute inset-0 bg-black/40" />}
        {/* Text overlay */}
        <div className={`relative z-10 w-full h-full flex flex-col justify-center p-8 ${align}`}>
          <h2 className={`text-xl font-bold leading-tight ${bg ? "text-white drop-shadow-lg" : "text-foreground"}`}>
            {item.textConfig.title || "Title"}
          </h2>
          {item.textConfig.subtitle && (
            <p className={`text-sm mt-2 ${bg ? "text-white/80 drop-shadow-md" : "text-muted-foreground"}`}>
              {item.textConfig.subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (item.asset?.thumbnailUrl) {
    return <img src={item.asset.thumbnailUrl} alt={item.asset.title} className="w-full h-full object-cover" />;
  }

  if (item.asset?.url && item.asset.type === "video") {
    return <video src={item.asset.url} className="w-full h-full object-cover" muted autoPlay loop />;
  }

  // Empty slot
  const icons: Record<string, React.ReactNode> = {
    video_clip: <Film className="w-8 h-8" />,
    chat_slide: <MessageSquare className="w-8 h-8" />,
    image_slide: <Image className="w-8 h-8" />,
    reaction_image: <Image className="w-8 h-8" />,
    opening_text: <Type className="w-8 h-8" />,
    text_slide: <Type className="w-8 h-8" />,
    ending_slide: <Type className="w-8 h-8" />,
    ending_clip: <Film className="w-8 h-8" />,
  };

  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
      {icons[item.slotType] || <Film className="w-8 h-8" />}
      <p className="text-[10px]">{item.name}</p>
    </div>
  );
}
