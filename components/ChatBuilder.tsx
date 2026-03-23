import { useState } from "react";
import { ChatConfig, ChatMessage, chatTemplates, viralChatTemplates, celebrityConfigs, generateRandomChat } from "@/types/chat";
import { defaultWallpaper } from "@/types/wallpaper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowUp, ArrowDown, Shuffle, Upload, Sparkles, ImageIcon, Type, Zap, Star } from "lucide-react";
import WallpaperPicker from "./WallpaperPicker";

interface Props {
  config: ChatConfig;
  onChange: (config: ChatConfig) => void;
}

export default function ChatBuilder({ config, onChange }: Props) {
  const [newMsg, setNewMsg] = useState("");
  const [newSender, setNewSender] = useState<"me" | "other">("other");
  const [msgType, setMsgType] = useState<"text" | "image">("text");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");

  const updateMessages = (messages: ChatMessage[]) => {
    onChange({ ...config, messages });
  };

  const addMessage = () => {
    if (msgType === "text" && !newMsg.trim()) return;
    if (msgType === "image" && !imagePreview) return;

    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours > 12 ? hours - 12 : hours || 12;
    const time = `${displayHour}:${String(mins).padStart(2, "0")} ${period}`;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      text: msgType === "text" ? newMsg.trim() : (imageCaption.trim() || ""),
      sender: newSender,
      time,
      status: newSender === "me" ? "read" : undefined,
      type: msgType,
      imageUrl: msgType === "image" ? imagePreview! : undefined,
      caption: msgType === "image" ? imageCaption.trim() || undefined : undefined,
    };
    updateMessages([...config.messages, msg]);
    setNewMsg("");
    setImagePreview(null);
    setImageCaption("");
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
    updateMessages(config.messages.map((m) => (m.id === id ? { ...m, text, caption: m.type === "image" ? text || undefined : undefined } : m)));
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...config, profilePicUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const loadTemplate = (tpl: typeof chatTemplates[0]) => {
    onChange({ ...tpl.config });
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
              newSender === "other" ? "bg-whatsapp-bubble-in text-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Other Person
          </button>
          <button
            onClick={() => setNewSender("me")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              newSender === "me" ? "bg-whatsapp-bubble-out text-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Me
          </button>
        </div>

        {/* Message type toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMsgType("text")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              msgType === "text" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Text Message
          </button>
          <button
            onClick={() => setMsgType("image")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              msgType === "image" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image Message
          </button>
        </div>

        {msgType === "text" ? (
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
        ) : (
          <div className="space-y-2">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full max-h-[150px] object-cover rounded-lg border border-border" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-border rounded-lg py-6 hover:border-primary/50 transition-colors">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload image (JPG, PNG, WEBP)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
            <Input
              placeholder="Add caption (optional)..."
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              className="bg-muted border-border"
            />
            <Button onClick={addMessage} className="w-full bg-primary hover:bg-primary/90" disabled={!imagePreview}>
              <Plus className="w-4 h-4 mr-1" />
              Add Image Message
            </Button>
          </div>
        )}
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
                msg.sender === "me" ? "bg-whatsapp-bubble-out/30" : "bg-whatsapp-bubble-in/30"
              }`}
            >
              <span className="text-[10px] text-muted-foreground w-6">{msg.sender === "me" ? "You" : "Them"}</span>
              {msg.type === "image" ? (
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <img src={msg.imageUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                  <input
                    className="flex-1 bg-transparent text-foreground text-sm outline-none min-w-0"
                    value={msg.caption || msg.text}
                    onChange={(e) => editMessage(msg.id, e.target.value)}
                    placeholder="Caption..."
                  />
                </div>
              ) : (
                <input
                  className="flex-1 bg-transparent text-foreground text-sm outline-none min-w-0"
                  value={msg.text}
                  onChange={(e) => editMessage(msg.id, e.target.value)}
                />
              )}
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

      {/* Typing Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground font-display">Typing Indicator</h3>
          <button
            onClick={() => onChange({ ...config, typingIndicator: !config.typingIndicator })}
            className={`relative w-10 h-6 rounded-full transition-colors ${config.typingIndicator ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${config.typingIndicator ? "left-5" : "left-1"}`} />
          </button>
        </div>
        {config.typingIndicator && (
          <p className="text-xs text-muted-foreground">{config.contactName} is typing...</p>
        )}
      </div>

    </div>
  );
}
