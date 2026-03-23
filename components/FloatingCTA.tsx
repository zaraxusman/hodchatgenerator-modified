import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingCTA() {
  return (
    <Link to="/fake-whatsapp-chat-generator" className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className="rounded-full h-14 px-5 gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 animate-[pulse-glow_3s_ease-in-out_infinite]"
      >
        <MessageSquare className="w-5 h-5" />
        Create Chat
      </Button>
    </Link>
  );
}
