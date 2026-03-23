import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendingChat {
  id: string;
  title: string;
  chat_type: string;
  likes_count: number;
  views_count: number;
}

const typeColor: Record<string, string> = {
  whatsapp: "bg-green-500/10 text-green-400",
  instagram: "bg-pink-500/10 text-pink-400",
  imessage: "bg-blue-400/10 text-blue-400",
  sms: "bg-emerald-400/10 text-emerald-400",
};

const typeLabel: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  imessage: "iMessage",
  sms: "SMS",
};

export default function TrendingChats() {
  const [chats, setChats] = useState<TrendingChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("published_chats" as any)
      .select("id, title, chat_type, likes_count, views_count")
      .eq("status", "published")
      .order("likes_count", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setChats(data as any);
        setLoading(false);
      });
  }, []);

  if (loading || chats.length === 0) return null;

  return (
    <section className="container pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          🔥 Trending Meme Chats
        </h2>
        <Link to="/meme-chat-library">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
          >
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[chat.chat_type] || "bg-muted text-muted-foreground"}`}>
              {typeLabel[chat.chat_type] || chat.chat_type}
            </span>
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mt-3 mb-3 line-clamp-2">
              {chat.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {chat.likes_count}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {chat.views_count}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
