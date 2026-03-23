import { ReactNode, RefObject } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Smartphone, Save, Check, Instagram } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import logoImg from "@/assets/logo.png";
import IPhoneFrame from "./IPhoneFrame";

interface GeneratorLayoutProps {
  children: ReactNode;
  preview: ReactNode;
  rightPanel: ReactNode;
  previewRef: RefObject<HTMLDivElement>;
  showFrame: boolean;
  setShowFrame: (v: boolean) => void;
  statusBarTime: string;
  setStatusBarTime: (v: string) => void;
  batteryPercent: number;
  setBatteryPercent: (v: number) => void;
  downloading: boolean;
  saving: boolean;
  saved: boolean;
  onDownload: () => void;
  onSave: () => void;
  chatTitle: string;
  setChatTitle: (v: string) => void;
  titlePlaceholder?: string;
  accentClass?: string;
  seoContent?: ReactNode;
  footer?: ReactNode;
}

export default function GeneratorLayout({
  children,
  preview,
  rightPanel,
  previewRef,
  showFrame,
  setShowFrame,
  statusBarTime,
  setStatusBarTime,
  batteryPercent,
  setBatteryPercent,
  downloading,
  saving,
  saved,
  onDownload,
  onSave,
  chatTitle,
  setChatTitle,
  titlePlaceholder = "e.g. Funny prank chat",
  accentClass = "bg-primary hover:bg-primary/90",
  seoContent,
  footer,
}: GeneratorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-foreground">
            <img src={logoImg} alt="HodChat Logo" className="w-5 h-5 rounded" />
            HodChat
          </Link>
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/hodchat/" target="_blank" rel="noopener noreferrer" title="Follow HodChat on Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <ThemeToggle />
            <Button onClick={onSave} disabled={saving} variant="outline" size="sm">
              {saved ? <Check className="w-4 h-4 mr-1 text-primary" /> : <Save className="w-4 h-4 mr-1" />}
              {saving ? "Saving..." : saved ? "Saved!" : "Save"}
            </Button>
            <Button onClick={onDownload} disabled={downloading} className={accentClass} size="sm">
              <Download className="w-4 h-4 mr-2" />
              {downloading ? "Generating..." : "Download"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* 3-column layout: Left builder | Center preview | Right appearance */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* LEFT PANEL — Chat Content Settings */}
          <div className="w-full xl:w-[340px] shrink-0 order-2 xl:order-1">
            <div className="bg-card rounded-xl border border-border p-4 xl:sticky xl:top-20 space-y-6 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
              {/* Chat title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground font-display">Chat Title</label>
                <Input
                  placeholder={titlePlaceholder}
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              {children}
            </div>
          </div>

          {/* CENTER PANEL — Live Preview */}
          <div className="flex-1 flex flex-col items-center order-1 xl:order-2 min-w-0">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">Live Preview</h2>
            <div className="xl:sticky xl:top-20 w-full flex justify-center">
              <IPhoneFrame
                innerRef={previewRef}
                showFrame={showFrame}
                statusBarTime={statusBarTime}
                batteryPercent={batteryPercent}
                theme="dark"
              >
                {preview}
              </IPhoneFrame>
            </div>
            {/* Mobile-only action buttons */}
            <div className="flex gap-2 mt-6 xl:hidden">
              <Button onClick={onSave} disabled={saving} variant="outline" size="lg">
                {saved ? <Check className="w-5 h-5 mr-1 text-primary" /> : <Save className="w-5 h-5 mr-1" />}
                {saving ? "Saving..." : saved ? "Saved!" : "Save Chat"}
              </Button>
              <Button onClick={onDownload} disabled={downloading} className={accentClass} size="lg">
                <Download className="w-5 h-5 mr-2" />
                {downloading ? "Generating..." : "Download"}
              </Button>
            </div>
          </div>

          {/* RIGHT PANEL — Appearance Settings */}
          <div className="w-full xl:w-[300px] shrink-0 order-3">
            <div className="bg-card rounded-xl border border-border p-4 xl:sticky xl:top-20 space-y-6 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
              {/* iPhone Frame Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground font-display flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-primary" />
                  iPhone Frame
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Show iPhone frame</span>
                  <button
                    onClick={() => setShowFrame(!showFrame)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${showFrame ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${showFrame ? "left-5" : "left-1"}`} />
                  </button>
                </div>
                {showFrame && (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground w-20 shrink-0">Time</label>
                      <Input
                        value={statusBarTime}
                        onChange={(e) => setStatusBarTime(e.target.value)}
                        className="bg-muted border-border h-8 text-sm"
                        placeholder="9:41"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground w-20 shrink-0">Battery %</label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={batteryPercent}
                        onChange={(e) => setBatteryPercent(Number(e.target.value))}
                        className="bg-muted border-border h-8 text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Additional right panel content */}
              {rightPanel}
            </div>
          </div>
        </div>
      </div>

      {/* SEO + Footer */}
      {seoContent}
      {footer}
    </div>
  );
}
