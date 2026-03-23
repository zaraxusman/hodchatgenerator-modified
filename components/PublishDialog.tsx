import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublishChat, CATEGORIES, ChatCategory } from "@/hooks/usePublishChat";
import { Upload, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  chatType: string;
  config: any;
}

export default function PublishDialog({ open, onClose, title, chatType, config }: Props) {
  const { publish, publishing } = usePublishChat();
  const [pubTitle, setPubTitle] = useState(title);
  const [category, setCategory] = useState<ChatCategory>("funny");

  if (!open) return null;

  const handlePublish = async () => {
    const id = await publish({ title: pubTitle, chatType, config, category });
    if (id) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-foreground">Publish to Meme Library</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title</label>
          <Input value={pubTitle} onChange={(e) => setPubTitle(e.target.value)} placeholder="Give your chat a catchy title" className="bg-muted border-border" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handlePublish} disabled={publishing} className="w-full bg-primary hover:bg-primary/90">
          <Upload className="w-4 h-4 mr-2" />
          {publishing ? "Publishing..." : "Publish Chat"}
        </Button>
      </div>
    </div>
  );
}
