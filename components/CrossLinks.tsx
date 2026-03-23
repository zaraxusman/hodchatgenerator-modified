import { Link } from "react-router-dom";
import { MessageSquare, Instagram, Smartphone, MessageCircle, Camera } from "lucide-react";

const generators = [
  { name: "WhatsApp Generator", path: "/fake-whatsapp-chat-generator", icon: MessageSquare, color: "text-green-500" },
  { name: "Instagram DM Generator", path: "/fake-instagram-dm-generator", icon: Instagram, color: "text-pink-500" },
  { name: "iMessage Generator", path: "/fake-imessage-generator", icon: Smartphone, color: "text-blue-400" },
  { name: "SMS Generator", path: "/fake-text-message-generator", icon: MessageCircle, color: "text-green-400" },
  { name: "Chat Screenshot Hub", path: "/chat-screenshot-generator", icon: Camera, color: "text-primary" },
  { name: "Meme Library", path: "/meme-library", icon: Camera, color: "text-yellow-500" },
  { name: "HodMeta", path: "/hodmeta", icon: Camera, color: "text-primary" },
];

interface Props {
  currentPath?: string;
}

export default function CrossLinks({ currentPath }: Props) {
  const filtered = generators.filter((g) => g.path !== currentPath);

  return (
    <section className="container py-10 border-t border-border">
      <h2 className="text-lg font-display font-semibold text-foreground mb-4">Try Our Other Generators</h2>
      <div className="flex flex-wrap gap-3">
        {filtered.map(({ name, path, icon: Icon, color }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors text-sm text-foreground"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            {name}
          </Link>
        ))}
      </div>
    </section>
  );
}
