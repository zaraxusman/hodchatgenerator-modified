import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimelineItem, TextSlideConfig } from "@/types/story";
import { Film, MessageSquare, Type, Image, Replace, Trash2, Upload, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useRef } from "react";

interface Props {
  timeline: TimelineItem[];
  onAssignAsset: (slotId: string) => void;
  onRemoveAsset: (slotId: string) => void;
  onUploadToSlot: (slotId: string, file: File) => void;
  onUpdateText: (slotId: string, config: TextSlideConfig) => void;
  onUpdateDuration: (slotId: string, duration: number) => void;
  onUploadTextBackground: (slotId: string, file: File) => void;
  onRemoveTextBackground: (slotId: string) => void;
  activeSlotId: string | null;
}

const slotIcons: Record<string, React.ReactNode> = {
  opening_text: <Type className="w-4 h-4" />,
  video_clip: <Film className="w-4 h-4" />,
  image_slide: <Image className="w-4 h-4" />,
  chat_slide: <MessageSquare className="w-4 h-4" />,
  reaction_image: <Image className="w-4 h-4" />,
  text_slide: <Type className="w-4 h-4" />,
  ending_slide: <Type className="w-4 h-4" />,
  ending_clip: <Film className="w-4 h-4" />,
};

export default function TimelineEditor({ timeline, onAssignAsset, onRemoveAsset, onUploadToSlot, onUpdateText, onUpdateDuration, onUploadTextBackground, onRemoveTextBackground, activeSlotId }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Timeline</h3>
      <div className="space-y-2">
        {timeline.map((item, idx) => (
          <TimelineSlotCard
            key={item.slotId}
            item={item}
            index={idx}
            isActive={activeSlotId === item.slotId}
            onAssign={() => onAssignAsset(item.slotId)}
            onRemove={() => onRemoveAsset(item.slotId)}
            onUpload={(f) => onUploadToSlot(item.slotId, f)}
            onUpdateText={(c) => onUpdateText(item.slotId, c)}
            onUpdateDuration={(d) => onUpdateDuration(item.slotId, d)}
            onUploadBg={(f) => onUploadTextBackground(item.slotId, f)}
            onRemoveBg={() => onRemoveTextBackground(item.slotId)}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineSlotCard({ item, index, isActive, onAssign, onRemove, onUpload, onUpdateText, onUpdateDuration, onUploadBg, onRemoveBg }: {
  item: TimelineItem; index: number; isActive: boolean;
  onAssign: () => void; onRemove: () => void; onUpload: (f: File) => void;
  onUpdateText: (c: TextSlideConfig) => void; onUpdateDuration: (d: number) => void;
  onUploadBg: (f: File) => void; onRemoveBg: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isText = ["opening_text", "text_slide", "ending_slide"].includes(item.slotType);
  const hasAsset = !!item.asset || (isText && item.textConfig);

  return (
    <Card className={`transition-all ${isActive ? "border-primary ring-1 ring-primary/30" : "border-border"} ${!item.required ? "opacity-80" : ""}`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0 text-muted-foreground">
            {slotIcons[item.slotType]}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-foreground">{index + 1}. {item.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{item.slotType.replace(/_/g, " ")} · {item.duration}s {!item.required && "· Optional"}</p>
              </div>
            </div>

            {isText ? (
              <TextSlotEditor config={item.textConfig} onChange={onUpdateText} onUploadBg={onUploadBg} onRemoveBg={onRemoveBg} />
            ) : hasAsset && item.asset ? (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                {item.asset.thumbnailUrl ? (
                  <img src={item.asset.thumbnailUrl} alt="" className="w-12 h-8 rounded object-cover" />
                ) : (
                  <div className="w-12 h-8 rounded bg-muted flex items-center justify-center">
                    <Film className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                )}
                <p className="text-xs text-foreground truncate flex-1">{item.asset.title}</p>
              </div>
            ) : null}

            <div className="flex gap-1.5 flex-wrap">
              {!isText && (
                <>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={onAssign}>
                    {hasAsset ? <><Replace className="w-3 h-3 mr-1" />Replace</> : <><Image className="w-3 h-3 mr-1" />Assign</>}
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={() => fileRef.current?.click()}>
                    <Upload className="w-3 h-3 mr-1" />Upload
                  </Button>
                  <input ref={fileRef} type="file" accept=".mp4,.mov,.webm,.png,.jpg,.jpeg,.webp" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
                </>
              )}
              {hasAsset && (
                <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 text-destructive hover:text-destructive" onClick={onRemove}>
                  <Trash2 className="w-3 h-3 mr-1" />Remove
                </Button>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[10px] text-muted-foreground">Duration:</span>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={item.duration}
                  onChange={(e) => onUpdateDuration(Number(e.target.value))}
                  className="w-14 h-7 text-[10px] px-1.5"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TextSlotEditor({ config, onChange, onUploadBg, onRemoveBg }: { config?: TextSlideConfig; onChange: (c: TextSlideConfig) => void; onUploadBg: (f: File) => void; onRemoveBg: () => void }) {
  const bgRef = useRef<HTMLInputElement>(null);
  const c = config || { title: "", subtitle: "", alignment: "center" as const, duration: 3 };
  const bgAsset = c.backgroundAsset;

  return (
    <div className="space-y-2">
      {/* Background media preview */}
      {bgAsset ? (
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
          {bgAsset.type === "video" ? (
            <div className="w-16 h-10 rounded bg-muted flex items-center justify-center">
              <Film className="w-4 h-4 text-muted-foreground/40" />
            </div>
          ) : (
            <img src={bgAsset.thumbnailUrl || bgAsset.url || ""} alt="" className="w-16 h-10 rounded object-cover" />
          )}
          <p className="text-[10px] text-foreground truncate flex-1">{bgAsset.title}</p>
          <Button size="sm" variant="ghost" className="h-6 text-[10px] px-1.5 text-destructive hover:text-destructive" onClick={onRemoveBg}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" className="h-7 text-[10px] px-2 w-full" onClick={() => bgRef.current?.click()}>
          <Upload className="w-3 h-3 mr-1" /> Add Background Clip / Image
        </Button>
      )}
      <input ref={bgRef} type="file" accept=".mp4,.mov,.webm,.png,.jpg,.jpeg,.webp" hidden onChange={(e) => e.target.files?.[0] && onUploadBg(e.target.files[0])} />

      <Input
        placeholder="Title text..."
        value={c.title}
        onChange={(e) => onChange({ ...c, title: e.target.value })}
        className="h-8 text-xs"
      />
      <Input
        placeholder="Subtitle (optional)..."
        value={c.subtitle}
        onChange={(e) => onChange({ ...c, subtitle: e.target.value })}
        className="h-8 text-xs"
      />
      <div className="flex gap-1">
        {(["left", "center", "right"] as const).map((a) => (
          <Button
            key={a}
            size="sm"
            variant={c.alignment === a ? "default" : "ghost"}
            className="h-7 w-7 p-0"
            onClick={() => onChange({ ...c, alignment: a })}
          >
            {a === "left" ? <AlignLeft className="w-3 h-3" /> : a === "center" ? <AlignCenter className="w-3 h-3" /> : <AlignRight className="w-3 h-3" />}
          </Button>
        ))}
      </div>
    </div>
  );
}
