import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoryTemplate } from "@/types/story";
import { Film, MessageSquare, Type, Image, Check } from "lucide-react";

interface Props {
  templates: StoryTemplate[];
  selectedId: string | null;
  onSelect: (t: StoryTemplate) => void;
}

function slotStats(t: StoryTemplate) {
  let clips = 0, chats = 0, texts = 0, images = 0;
  for (const s of t.slots) {
    if (s.type === "video_clip" || s.type === "ending_clip") clips++;
    else if (s.type === "chat_slide") chats++;
    else if (s.type === "opening_text" || s.type === "text_slide" || s.type === "ending_slide") texts++;
    else if (s.type === "image_slide" || s.type === "reaction_image") images++;
  }
  return { clips, chats, texts, images };
}

export default function TemplateSelector({ templates, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Choose Template</h3>
      <div className="grid gap-3">
        {templates.map((t) => {
          const stats = slotStats(t);
          const active = selectedId === t.id;
          return (
            <Card
              key={t.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${active ? "border-primary ring-1 ring-primary/30" : "border-border"}`}
              onClick={() => onSelect(t)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm truncate">{t.name}</h4>
                      {active && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                  {stats.clips > 0 && <span className="flex items-center gap-1"><Film className="w-3 h-3" />{stats.clips} clips</span>}
                  {stats.chats > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{stats.chats} chats</span>}
                  {stats.texts > 0 && <span className="flex items-center gap-1"><Type className="w-3 h-3" />{stats.texts} text</span>}
                  {stats.images > 0 && <span className="flex items-center gap-1"><Image className="w-3 h-3" />{stats.images} images</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
