import { Link } from "react-router-dom";
import { MessageSquare, Instagram, Smartphone, MessageCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";
import FloatingBubbles from "@/components/FloatingBubbles";
import ChatTypingDemo from "@/components/ChatTypingDemo";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedStats from "@/components/AnimatedStats";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingBubbles />

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <img src={logoImg} alt="HodChat Logo" className="w-6 h-6 rounded" />
            HodChat
          </div>
        </div>
      </header>

      <section className="container py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight">
              Create Viral Chat Memes in Seconds
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The most realistic fake chat generator for WhatsApp, Instagram, iMessage, and SMS.
              Perfect for memes, content creation, and storytelling.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/fake-whatsapp-chat-generator">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Create WhatsApp Chat
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ChatTypingDemo />
        </div>
      </section>

      <section className="container py-20 bg-muted/30">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-foreground">
            Choose Your Platform
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <ScrollReveal delay={0}>
            <Link to="/fake-whatsapp-chat-generator" className="group">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-lg">
                <MessageSquare className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Most popular chat platform</p>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <Link to="/fake-instagram-dm-generator" className="group">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-lg">
                <Instagram className="w-12 h-12 text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">Instagram</h3>
                <p className="text-sm text-muted-foreground">Perfect for stories and DMs</p>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <Link to="/fake-imessage-generator" className="group">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-lg">
                <Smartphone className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">iMessage</h3>
                <p className="text-sm text-muted-foreground">Apple's messaging platform</p>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <Link to="/fake-text-message-generator" className="group">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-lg">
                <MessageCircle className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">SMS</h3>
                <p className="text-sm text-muted-foreground">Classic text messages</p>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="container py-20">
        <ScrollReveal>
          <AnimatedStats />
        </ScrollReveal>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>2026 HodChat Generator. For entertainment purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
