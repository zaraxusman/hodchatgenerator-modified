import { Facebook, Twitter, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  text?: string;
}

export default function ShareButtons({ text = "Check out this fake chat I made with HodChat Generator!" }: Props) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encoded = encodeURIComponent(text + " " + url);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")}
      >
        <Facebook className="w-3.5 h-3.5 mr-1" />
        Facebook
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank")}
      >
        <Twitter className="w-3.5 h-3.5 mr-1" />
        Twitter
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() => window.open(`https://www.tiktok.com/`, "_blank")}
      >
        <Share2 className="w-3.5 h-3.5 mr-1" />
        TikTok
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: "HodChat Generator", text, url });
          } else {
            navigator.clipboard.writeText(url);
          }
        }}
      >
        <Share2 className="w-3.5 h-3.5 mr-1" />
        Share
      </Button>
    </div>
  );
}
