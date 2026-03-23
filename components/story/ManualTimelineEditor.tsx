import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ManualTimelineItem, MediaType, MAX_TIMELINES, MAX_DURATION, MIN_DURATION, ACCEPTED_VIDEO_FORMATS, ACCEPTED_IMAGE_FORMATS } from "@/types/story";
import { Film, Image, Camera, Upload, Replace, Trash2, Plus, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";

interface Props {
  items: ManualTimelineItem[];
  activeItemId: string | null;
  onUpdate: (id: string, updates: Partial<ManualTimelineItem>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onAssign: (id: string) => void;
  onUploadToItem: (id: string, file: File) => void;
}

const mediaIcons: Record<MediaType, React.ReactNode> = {
  clip: <Film className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  screenshot: <Camera className="w-4 h-4" />,
};

export default function ManualTimelineEditor({ items, activeItemId, onUpdate, onRemove, onAdd, onAssign, onUploadToItem }: Props) {
  const canAdd = items.length < MAX_TIMELINES;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Timeline</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <TimelineCard
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            onUpdate={(updates) => onUpdate(item.id, updates)}
            onRemove={() => onRemove(item.id)}
            onAssign={() => onAssign(item.id)}
            onUpload={(f) => onUploadToItem(item.id, f)}
            canRemove={items.length > 1}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed h-9 text-xs"
        onClick={onAdd}
        disabled={!canAdd}
      >
        <Plus className="w-3.5 h-3.5 mr-1.5" />
        {canAdd ? "Add Timeline" : "Maximum 10 timelines reached."}
      </Button>
    </div>
  );
}

function TimelineCard({ item, isActive, onUpdate, onRemove, onAssign, onUpload, canRemove }: {
  item: ManualTimelineItem;
  isActive: boolean;
  onUpdate: (updates: Partial<ManualTimelineItem>) => void;
  onRemove: () => void;
  onAssign: () => void;
  onUpload: (f: File) => void;
  canRemove: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const acceptFormats = item.mediaType === "clip"
    ? ACCEPTED_VIDEO_FORMATS
    : `${ACCEPTED_IMAGE_FORMATS}`;

  const handleDurationChange = (val: string) => {
    let num = Number(val);
    if (isNaN(num)) return;
    if (num > MAX_DURATION) num = MAX_DURATION;
    if (num < MIN_DURATION) num = MIN_DURATION;
    onUpdate({ duration: num });
  };

  return (
    <Card className={`transition-all ${isActive ? "border-primary ring-1 ring-primary/30" : "border-border"}`}>
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0">
                {item.order}
              </div>
              <Select value={item.mediaType} onValueChange={(v: MediaType) => onUpdate({ mediaType: v, asset: null })}>
                <SelectTrigger className="h-7 text-xs w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clip"><span className="flex items-center gap-1.5"><Film className="w-3 h-3" /> Clip</span></SelectItem>
                  <SelectItem value="image"><span className="flex items-center gap-1.5"><Image className="w-3 h-3" /> Image</span></SelectItem>
                  <SelectItem value="screenshot"><span className="flex items-center gap-1.5"><Camera className="w-3 h-3" /> Screenshot</span></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Duration:</span>
              <Input
                type="number"
                min={MIN_DURATION}
                max={MAX_DURATION}
                value={item.duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="w-14 h-7 text-[10px] px-1.5"
              />
              <span className="text-[10px] text-muted-foreground">s</span>
            </div>
          </div>

          {/* Asset preview */}
          {item.asset ? (
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              {item.asset.type === "video" ? (
                item.asset.url ? (
                  <video src={item.asset.url} className="w-12 h-8 rounded object-cover" muted />
                ) : (
                  <div className="w-12 h-8 rounded bg-muted flex items-center justify-center">
                    <Film className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                )
              ) : (
                <img src={item.asset.thumbnailUrl || item.asset.url || ""} alt="" className="w-12 h-8 rounded object-cover" />
              )}
              <p className="text-xs text-foreground truncate flex-1">{item.asset.title}</p>
            </div>
          ) : null}

          {/* Action buttons */}
          <div className="flex gap-1.5 flex-wrap">
            <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={onAssign}>
              {item.asset ? <><Replace className="w-3 h-3 mr-1" />Replace</> : <>{mediaIcons[item.mediaType]} <span className="ml-1">Assign</span></>}
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={() => fileRef.current?.click()}>
              <Upload className="w-3 h-3 mr-1" />Upload
            </Button>
            <input ref={fileRef} type="file" accept={acceptFormats} hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
            {item.asset && (
              <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 text-destructive hover:text-destructive" onClick={() => onUpdate({ asset: null })}>
                <Trash2 className="w-3 h-3 mr-1" />Remove
              </Button>
            )}
            {canRemove && (
              <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 text-destructive hover:text-destructive ml-auto" onClick={onRemove}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Text overlay toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-[10px] text-muted-foreground cursor-pointer">Text Overlay</Label>
            </div>
            <Switch
              checked={item.textEnabled}
              onCheckedChange={(v) => onUpdate({ textEnabled: v })}
              className="scale-75"
            />
          </div>

          {/* Text fields */}
          {item.textEnabled && (
            <div className="space-y-2 pl-1">
              <Input
                placeholder="Main text..."
                value={item.mainText}
                onChange={(e) => onUpdate({ mainText: e.target.value })}
                className="h-8 text-xs"
              />
              <Input
                placeholder="Subtitle (optional)..."
                value={item.subtitle}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                className="h-8 text-xs"
              />
              <div className="flex gap-1">
                {(["left", "center", "right"] as const).map((a) => (
                  <Button
                    key={a}
                    size="sm"
                    variant={item.alignment === a ? "default" : "ghost"}
                    className="h-7 w-7 p-0"
                    onClick={() => onUpdate({ alignment: a })}
                  >
                    {a === "left" ? <AlignLeft className="w-3 h-3" /> : a === "center" ? <AlignCenter className="w-3 h-3" /> : <AlignRight className="w-3 h-3" />}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
