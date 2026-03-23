import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ManualTimelineItem } from "@/types/story";
import { Play, RotateCcw, Pause, Film } from "lucide-react";

interface Props {
  items: ManualTimelineItem[];
}

export default function ManualPreview({ items }: Props) {
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const filledSlots = items.filter((t) => t.asset);
  const totalDuration = items.reduce((sum, t) => sum + t.duration, 0);
  const currentItem = items[currentIdx];

  const restart = useCallback(() => {
    setCurrentIdx(0);
    setElapsed(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || !currentItem) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= currentItem.duration) {
          if (currentIdx < items.length - 1) {
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
  }, [playing, currentIdx, currentItem, items.length]);

  const globalElapsed = items.slice(0, currentIdx).reduce((s, t) => s + t.duration, 0) + elapsed;
  const progress = totalDuration > 0 ? (globalElapsed / totalDuration) * 100 : 0;

  return (
    <div className="sticky top-20 space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Preview</h3>

      {/* 9:16 Phone Frame */}
      <div className="mx-auto" style={{ maxWidth: 280 }}>
        <div className="relative rounded-[24px] border-2 border-border bg-black overflow-hidden" style={{ aspectRatio: "9/16" }}>
          {/* Progress segments */}
          <div className="absolute top-0 left-0 right-0 z-10 flex gap-0.5 p-2">
            {items.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{
                    width: i < currentIdx ? "100%" : i === currentIdx ? `${(elapsed / (currentItem?.duration || 1)) * 100}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Slide content */}
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {currentItem ? (
              <SlideRenderer item={currentItem} />
            ) : (
              <div className="text-center p-6">
                <Film className="w-10 h-10 text-white/20 mx-auto mb-2" />
                <p className="text-xs text-white/40">Add media to start</p>
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
          <p className="text-lg font-bold text-foreground">{items.length}</p>
          <p className="text-[10px] text-muted-foreground">Slides</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{totalDuration}s</p>
          <p className="text-[10px] text-muted-foreground">Duration</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{filledSlots.length}/{items.length}</p>
          <p className="text-[10px] text-muted-foreground">Filled</p>
        </div>
      </div>

      {filledSlots.length > 0 && filledSlots.length === items.length ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-primary font-medium">Ready to export</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">Assign media to all slides to export</p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center italic">
        Live preview is for reference only. Final rendered video may vary slightly.
      </p>
    </div>
  );
}

function SlideRenderer({ item }: { item: ManualTimelineItem }) {
  const hasAsset = !!item.asset;
  const isVideo = item.asset?.type === "video";
  const imageUrl = item.asset?.url || item.asset?.thumbnailUrl || "";

  const alignClass = item.alignment === "left" ? "items-start text-left" : item.alignment === "right" ? "items-end text-right" : "items-center text-center";

  return (
    <div className="relative w-full h-full bg-black">
      {/* Media */}
      {hasAsset && isVideo && item.asset?.url ? (
        <video src={item.asset.url} className="absolute inset-0 w-full h-full object-cover" muted autoPlay loop />
      ) : hasAsset && imageUrl ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            src={imageUrl}
            alt={item.asset?.title || ""}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Film className="w-8 h-8 text-white/20" />
        </div>
      )}

      {/* Text overlay */}
      {item.textEnabled && (item.mainText || item.subtitle) && (
        <>
          {hasAsset && <div className="absolute inset-0 bg-black/40 z-[1]" />}
          <div className={`absolute inset-0 z-[2] flex flex-col justify-center p-6 ${alignClass}`}>
            {item.mainText && (
              <h2 className="text-lg font-bold text-white drop-shadow-lg leading-tight">
                {item.mainText}
              </h2>
            )}
            {item.subtitle && (
              <p className="text-xs text-white/80 drop-shadow-md mt-1">
                {item.subtitle}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
