import { useState } from "react";
import { IMessageConfig, IMessageMessage, imessageTemplates, generateRandomIMessage } from "@/types/imessage";
import { defaultWallpaper } from "@/types/wallpaper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowUp, ArrowDown, Shuffle, Upload, Sparkles } from "lucide-react";
import WallpaperPicker from "./WallpaperPicker";

interface Props {
  config: IMessageConfig;
  onChange: (config: IMessageConfig) => void;
}

export default function IMessageBuilder({ config, onChange }: Props) {
  const [newMsg, setNewMsg] = useState("");
  const [newSender, setNewSender] = useState<"me" | "other">("other");

  const updateMessages = (messages: IMessageMessage[]) => {
    onChange({ ...config, messages });
  };

  const addMessage = () => {
    if (!newMsg.trim()) return;
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours > 12 ? hours - 12 : hours || 12;
    const time = `${displayHour}:${String(mins).padStart(2, "0")} ${period}`;

    const msg: IMessageMessage = {
      id: Date.now().toString(),
      text: newMsg.trim(),
      sender: newSender,
      time,
    };
    updateMessages([...config.messages, msg]);
    setNewMsg("");
  };

  const deleteMessage = (id: string) => {
    updateMessages(config.messages.filter((m) => m.id !== id));
  };

  const moveMessage = (index: number, dir: -1 | 1) => {
    const msgs = [...config.messages];
    const target = index + dir;
    if (target < 0 || target >= msgs.length) return;
    [msgs[index], msgs[target]] = [msgs[target], msgs[index]];
    updateMessages(msgs);
  };

  const editMessage = (id: string, text: string) => {
    updateMessages(config.messages.map((m) => (m.id === id ? { ...m, text } : m)));
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...config, profilePicUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Contact Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground font-display">Contact Info</h3>
        <Input
          placeholder="Contact name"
          value={config.contactName}
          onChange={(e) => onChange({ ...config, contactName: e.target.value })}
          className="bg-muted border-border"
        />
        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Upload className="w-4 h-4" />
          Upload profile picture
          <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
        </label>
      </div>

      {/* Add Message */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground font-display">Add Message</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setNewSender("other")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              newSender === "other" ? "bg-[#3a3a3c] text-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Other Person
          </button>
          <button
            onClick={() => setNewSender("me")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              newSender === "me" ? "bg-[#0a84ff]/30 text-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Me
          </button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMessage()}
            className="bg-muted border-border flex-1"
          />
          <Button onClick={addMessage} size="icon" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground font-display">
          Messages ({config.messages.length})
        </h3>
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
          {config.messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                msg.sender === "me" ? "bg-[#0a84ff]/10" : "bg-[#3a3a3c]/30"
              }`}
            >
              <span className="text-[10px] text-muted-foreground w-6">{msg.sender === "me" ? "You" : "Them"}</span>
              <input
                className="flex-1 bg-transparent text-foreground text-sm outline-none min-w-0"
                value={msg.text}
                onChange={(e) => editMessage(msg.id, e.target.value)}
              />
              <div className="flex items-center gap-0.5 shrink-0">
                <button onClick={() => moveMessage(i, -1)} className="p-1 text-muted-foreground hover:text-foreground">
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button onClick={() => moveMessage(i, 1)} className="p-1 text-muted-foreground hover:text-foreground">
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button onClick={() => deleteMessage(msg.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
