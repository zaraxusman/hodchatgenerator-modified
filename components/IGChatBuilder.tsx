import { useState } from "react";
import { IGConfig, IGMessage, igTemplates, generateRandomIGChat } from "@/types/instagram";
import { defaultWallpaper } from "@/types/wallpaper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowUp, ArrowDown, Shuffle, Upload, Sparkles, Eye, EyeOff, ImageIcon, Type, Reply } from "lucide-react";
import WallpaperPicker from "./WallpaperPicker";

interface Props {
  config: IGConfig;
  onChange: (config: IGConfig) => void;
}

const reactions = ["❤️", "😂", "😮", "😢", "🔥", "👏"];

export default function IGChatBuilder({ config, onChange }: Props) {
  const [newMsg, setNewMsg] = useState("");
  const [newSender, setNewSender] = useState<"me" | "other">("other");
  const [msgType, setMsgType] = useState<"text" | "image" | "story_reply">("text");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [storyImagePreview, setStoryImagePreview] = useState<string | null>(null);
  const [storyOwner, setStoryOwner] = useState("");

  const updateMessages = (messages: IGMessage[]) => {
    onChange({ ...config, messages });
  };

  const addMessage = () => {
    if (msgType === "text" && !newMsg.trim()) return;
    if (msgType === "image" && !imagePreview) return;
    if (msgType === "story_reply" && !storyImagePreview) return;

    const msg: IGMessage = {
      id: Date.now().toString(),
      text: msgType === "text" ? newMsg.trim() : msgType === "story_reply" ? newMsg.trim() : (imageCaption.trim() || ""),
      sender: newSender,
      time: "now",
      type: msgType,
      imageUrl: msgType === "image" ? imagePreview! : undefined,
      caption: msgType === "image" ? imageCaption.trim() || undefined : undefined,
      storyImageUrl: msgType === "story_reply" ? storyImagePreview! : undefined,
      storyOwner: msgType === "story_reply" ? (storyOwner.trim() || config.username) : undefined,
    };
    updateMessages([...config.messages, msg]);
    setNewMsg("");
    setImagePreview(null);
    setImageCaption("");
    setStoryImagePreview(null);
    setStoryOwner("");
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

  const toggleReaction = (id: string, reaction: string) => {
    updateMessages(
      config.messages.map((m) =>
        m.id === id ? { ...m, reaction: m.reaction === reaction ? undefined : reaction } : m
      )
    );
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

  const handleStoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setStoryImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateStoryImage = (msgId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateMessages(config.messages.map((m) => (m.id === msgId ? { ...m, storyImageUrl: reader.result as string } : m)));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground font-display">Profile Info</h3>
        <Input
          placeholder="Username"
          value={config.username}
          onChange={(e) => onChange({ ...config, username: e.target.value })}
          className="bg-muted border-border"
        />
        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Upload className="w-4 h-4" />
          Upload profile picture
          <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChange({ ...config, seen: !config.seen })}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${config.seen ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}
          >
            {config.seen ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Seen
          </button>
          <button
            onClick={() => onChange({ ...config, activeNow: !config.activeNow })}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${config.activeNow ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
          >
            <div className={`w-2 h-2 rounded-full ${config.activeNow ? "bg-primary" : "bg-muted-foreground"}`} />
            Active now
          </button>
          <button
            onClick={() => onChange({ ...config, verified: !config.verified })}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${config.verified ? "bg-blue-500/20 text-blue-400" : "bg-muted text-muted-foreground"}`}
          >
            <svg className="w-3 h-3" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill={config.verified ? "#0095F6" : "currentColor"} opacity={config.verified ? 1 : 0.3} />
              <path d="M17.5 27L10 19.5L12.5 17L17.5 22L27.5 12L30 14.5L17.5 27Z" fill="white" />
            </svg>
            Verified
          </button>
        </div>
      </div>

      {/* Add Message */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground font-display">Add Message</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setNewSender("other")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              newSender === "other" ? "text-foreground" : "bg-muted text-muted-foreground"
            }`}
            style={newSender === "other" ? { backgroundColor: "#262626" } : {}}
          >
            Other Person
          </button>
          <button
            onClick={() => setNewSender("me")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              newSender === "me" ? "text-foreground" : "bg-muted text-muted-foreground"
            }`}
            style={newSender === "me" ? { backgroundColor: "#3797f0" } : {}}
          >
            Me
          </button>
        </div>

        {/* Message type toggle */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setMsgType("text")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              msgType === "text" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Text
          </button>
          <button
            onClick={() => setMsgType("image")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              msgType === "image" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image
          </button>
          <button
            onClick={() => setMsgType("story_reply")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              msgType === "story_reply" ? "bg-accent/20 text-accent border border-accent/30" : "bg-muted text-muted-foreground"
            }`}
          >
            <Reply className="w-3.5 h-3.5" />
            Story Reply
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
        ) : msgType === "image" ? (
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
        ) : (
          /* Story Reply */
          <div className="space-y-2">
            {storyImagePreview ? (
              <div className="relative">
                <img src={storyImagePreview} alt="Story" className="w-full max-h-[120px] object-cover rounded-lg border border-border" />
                <button
                  onClick={() => setStoryImagePreview(null)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Story image
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-accent/30 rounded-lg py-5 hover:border-accent/50 transition-colors">
                <Reply className="w-5 h-5 text-accent" />
                <span className="text-xs text-muted-foreground">Upload story image (JPG, PNG, WEBP)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleStoryImageUpload} />
              </label>
            )}
            <Input
              placeholder="Story owner username"
              value={storyOwner}
              onChange={(e) => setStoryOwner(e.target.value)}
              className="bg-muted border-border"
            />
            <Input
              placeholder="Reply message (e.g. 😂 this is hilarious)"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMessage()}
              className="bg-muted border-border"
            />
            <Button onClick={addMessage} className="w-full bg-accent hover:bg-accent/90" disabled={!storyImagePreview}>
              <Reply className="w-4 h-4 mr-1" />
              Add Story Reply
            </Button>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground font-display">
          Messages ({config.messages.length})
        </h3>
        <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
          {config.messages.map((msg, i) => (
            <div key={msg.id} className="space-y-1">
              <div
                className="flex items-center gap-2 p-2 rounded-lg text-sm"
                style={{ backgroundColor: msg.sender === "me" ? "rgba(55,151,240,0.15)" : "rgba(38,38,38,0.5)" }}
              >
                <span className="text-[10px] text-muted-foreground w-6">{msg.sender === "me" ? "You" : "Them"}</span>
                {msg.type === "story_reply" ? (
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                      <img src={msg.storyImageUrl} alt="" className="w-8 h-10 rounded object-cover" />
                      <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-black/50 flex items-center justify-center rounded transition-opacity">
                        <ImageIcon className="w-3 h-3 text-white" />
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => updateStoryImage(msg.id, e)} />
                      </label>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-accent block">Story Reply</span>
                      <input
                        className="w-full bg-transparent text-foreground text-sm outline-none min-w-0"
                        value={msg.text}
                        onChange={(e) => editMessage(msg.id, e.target.value)}
                        placeholder="Reply..."
                      />
                    </div>
                  </div>
                ) : msg.type === "image" ? (
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
              {/* Reaction picker */}
              <div className="flex items-center gap-1 pl-8">
                {reactions.map((r) => (
                  <button
                    key={r}
                    onClick={() => toggleReaction(msg.id, r)}
                    className={`text-xs px-1 py-0.5 rounded transition-all ${msg.reaction === r ? "bg-muted scale-110" : "opacity-50 hover:opacity-100"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
