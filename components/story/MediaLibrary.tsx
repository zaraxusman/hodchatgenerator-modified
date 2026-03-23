import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Film, Image, Play, Plus, X } from "lucide-react";
import { StoryAsset, ACCEPTED_VIDEO_FORMATS, ACCEPTED_IMAGE_FORMATS, ASSET_CATEGORIES } from "@/types/story";

interface Props {
  mode: "clip" | "image";
  assets: StoryAsset[];
  onUpload: (files: FileList) => void;
  onSelect: (asset: StoryAsset) => void;
  onRemove: (id: string) => void;
}

export default function MediaLibrary({ mode, assets, onUpload, onSelect, onRemove }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isClip = mode === "clip";
  const Icon = isClip ? Film : Image;
  const accept = isClip ? ACCEPTED_VIDEO_FORMATS : ACCEPTED_IMAGE_FORMATS;
  const label = isClip ? "Clip" : "Image";
  const presets = assets.filter((a) => a.category !== "upload");
  const uploads = assets.filter((a) => a.category === "upload");

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Icon className="w-4 h-4" /> {label} Library
      </h3>
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="presets" className="flex-1 text-xs">Presets</TabsTrigger>
          <TabsTrigger value="uploads" className="flex-1 text-xs">My Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="presets">
          {presets.length === 0 ? (
            <EmptyState message={`No preset ${label.toLowerCase()}s added yet.`} icon={<Icon className="w-8 h-8 text-muted-foreground/40" />} />
          ) : (
            <ScrollArea className="h-[500px]">
              <AssetGrid assets={presets} onSelect={onSelect} onRemove={onRemove} />
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="uploads">
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" /> Upload {label}s
            </Button>
            <input ref={fileRef} type="file" accept={accept} multiple hidden onChange={(e) => e.target.files && onUpload(e.target.files)} />
            {uploads.length === 0 ? (
              <EmptyState message={`Upload ${label.toLowerCase()}s to start building.`} icon={<Upload className="w-8 h-8 text-muted-foreground/40" />} />
            ) : (
              <ScrollArea className="h-[500px]">
                <AssetGrid assets={uploads} onSelect={onSelect} onRemove={onRemove} />
              </ScrollArea>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon}
      <p className="text-sm text-muted-foreground mt-2">{message}</p>
    </div>
  );
}

function AssetGrid({ assets, onSelect, onRemove }: { assets: StoryAsset[]; onSelect: (a: StoryAsset) => void; onRemove: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {assets.map((a) => (
        <Card key={a.id} className="group relative overflow-hidden border-border hover:border-primary/50 transition-all cursor-pointer" onClick={() => onSelect(a)}>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
              {a.thumbnailUrl ? (
                <img src={a.thumbnailUrl} alt={a.title} className="w-full h-full object-cover" />
              ) : (
                <Film className="w-6 h-6 text-muted-foreground/40" />
              )}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
              {a.duration && <p className="text-[10px] text-muted-foreground">{a.duration}s</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(a.id); }}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
