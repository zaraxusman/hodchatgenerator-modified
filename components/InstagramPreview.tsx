import { IGConfig, igThemes } from "@/types/instagram";
import { ChevronLeft, Phone, Video, User, Camera, Heart, ImageIcon } from "lucide-react";
import WallpaperLayer from "./WallpaperLayer";

interface Props {
  config: IGConfig;
}

export default function InstagramPreview({ config }: Props) {
  const { username, profilePicUrl, messages, seen, activeNow, verified } = config;
  const fontSize = config.fontSize || "16px";
  const currentTheme = igThemes.find(t => t.name === config.theme) || igThemes[0];

  const getMeBubbleStyle = () => {
    const base: React.CSSProperties = { color: currentTheme.meText };
    if (currentTheme.meBgGradient) {
      base.background = currentTheme.meBgGradient;
    } else {
      base.backgroundColor = currentTheme.meBg;
    }
    return base;
  };

  const getOtherBubbleStyle = (): React.CSSProperties => ({
    backgroundColor: currentTheme.otherBg,
    color: currentTheme.otherText,
  });

  const VerifiedBadge = () => (
    <svg className="w-[14px] h-[14px] shrink-0 ml-[3px]" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#0095F6" />
      <path d="M17.5 27L10 19.5L12.5 17L17.5 22L27.5 12L30 14.5L17.5 27Z" fill="white" />
    </svg>
  );

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "#000000",
        fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "subpixel-antialiased",
        MozOsxFontSmoothing: "auto",
        textRendering: "optimizeSpeed",
      }}
    >
      {/* Status bar spacer */}
      <div className="h-[54px] shrink-0" style={{ backgroundColor: "#000000" }} />

      {/* Instagram Header */}
      <div
        className="flex items-center gap-[10px] px-3 shrink-0"
        style={{
          backgroundColor: "#000000",
          height: "48px",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <ChevronLeft className="w-[26px] h-[26px] shrink-0" style={{ color: "#ffffff" }} />
        <div
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0"
          style={{
            background:
              "linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
            padding: "2px",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#000" }}>
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt=""
                className="w-[26px] h-[26px] rounded-full object-cover"
              />
            ) : (
              <div
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#262626" }}
              >
                <User className="w-3.5 h-3.5" style={{ color: "#a8a8a8" }} />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 pt-[1px]">
          <div className="flex items-center min-w-0">
            <p
              className="text-[15px] font-semibold truncate"
              style={{ color: "#ffffff", lineHeight: "19px" }}
            >
              {username}
            </p>
            {verified && <VerifiedBadge />}
          </div>
          {activeNow && (
            <p className="text-[12px]" style={{ color: "#8e8e8e", lineHeight: "15px" }}>
              Active now
            </p>
          )}
        </div>
        <div className="flex items-center gap-[18px] shrink-0" style={{ color: "#ffffff" }}>
          <Phone className="w-[22px] h-[22px]" />
          <Video className="w-[24px] h-[24px]" />
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-[6px] relative"
        style={{ backgroundColor: "#000000" }}
      >
        <WallpaperLayer wallpaper={config.wallpaper} />
        {/* Profile intro card */}
        <div className="flex flex-col items-center mb-4 pt-3 relative" style={{ zIndex: 1 }}>
          <div
            className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center mb-2"
            style={{ backgroundColor: "#262626" }}
          >
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-9 h-9" style={{ color: "#a8a8a8" }} />
            )}
          </div>
          <div className="flex items-center justify-center gap-[2px]">
            <p className="text-[14px] font-semibold" style={{ color: "#ffffff" }}>
              {username}
            </p>
            {verified && <VerifiedBadge />}
          </div>
          <p className="text-[12px]" style={{ color: "#8e8e8e" }}>
            Instagram · {username}
          </p>
          <button
            className="mt-2 px-4 py-[6px] rounded-lg text-[13px] font-semibold"
            style={{ backgroundColor: "#363636", color: "#ffffff" }}
          >
            View profile
          </button>
        </div>

        {messages.map((msg) => {
          const isImage = msg.type === "image" && msg.imageUrl;
          const isStoryReply = msg.type === "story_reply" && msg.storyImageUrl;

          return (
            <div key={msg.id} data-msg-id={msg.id} className={`relative ${msg.reaction ? "mb-3" : ""}`} style={{ zIndex: 1 }}>
              <div
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "other" && (
                  <div
                    className="w-[22px] h-[22px] rounded-full overflow-hidden flex items-center justify-center mr-[6px] mt-auto mb-[2px] shrink-0"
                    style={{ backgroundColor: "#262626" }}
                  >
                    {profilePicUrl ? (
                      <img
                        src={profilePicUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-3 h-3" style={{ color: "#a8a8a8" }} />
                    )}
                  </div>
                )}
                <div className="relative max-w-[75%]">
                  {isStoryReply ? (
                    /* Story Reply Layout */
                    <div className="flex flex-col">
                      {/* "Replied to your/their story" label */}
                      <p
                        className="text-[11px] mb-[3px]"
                        style={{
                          color: "#8e8e8e",
                          textAlign: msg.sender === "me" ? "right" : "left",
                        }}
                      >
                        {msg.sender === "me"
                          ? `Replied to ${msg.storyOwner || username}'s story`
                          : "Replied to your story"}
                      </p>
                      {/* Story thumbnail card */}
                      <div
                        className="overflow-hidden mb-[4px]"
                        style={{
                          borderRadius: "12px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          width: "140px",
                          alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                        }}
                      >
                        <img
                          src={msg.storyImageUrl}
                          alt=""
                          className="w-full object-cover"
                          style={{ height: "180px" }}
                        />
                      </div>
                      {/* Reply bubble */}
                      {msg.text && (
                        <div
                          className="px-3 py-[7px]"
                          style={{
                            ...(msg.sender === "me" ? getMeBubbleStyle() : getOtherBubbleStyle()),
                            fontSize,
                            lineHeight: "20px",
                            borderRadius:
                              msg.sender === "me"
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",
                            alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                          }}
                        >
                          <span className="break-words">{msg.text}</span>
                        </div>
                      )}
                    </div>
                  ) : isImage ? (
                    <div
                      className="overflow-hidden"
                      style={{
                        borderRadius:
                          msg.sender === "me"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                      }}
                    >
                      <img
                        src={msg.imageUrl}
                        alt=""
                        className="w-full object-cover"
                        style={{ maxHeight: "220px", minWidth: "160px" }}
                      />
                      {msg.caption && (
                        <div
                          className="px-3 py-[6px]"
                          style={{
                            ...(msg.sender === "me" ? getMeBubbleStyle() : getOtherBubbleStyle()),
                            fontSize,
                            lineHeight: "20px",
                          }}
                        >
                          <span className="break-words">{msg.caption}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="px-3 py-[7px]"
                      style={{
                        ...(msg.sender === "me" ? getMeBubbleStyle() : getOtherBubbleStyle()),
                        fontSize,
                        lineHeight: "20px",
                        borderRadius:
                          msg.sender === "me"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                        boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
                      }}
                    >
                      <span className="break-words">{msg.text}</span>
                    </div>
                  )}
                  {msg.reaction && (
                    <div
                      className="absolute -bottom-[10px] text-[12px] leading-none px-[2px]"
                      style={{
                        backgroundColor: "#262626",
                        borderRadius: "10px",
                        border: "2px solid #000",
                        [msg.sender === "me" ? "right" : "left"]: "8px",
                      }}
                    >
                      {msg.reaction}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Seen */}
        {seen &&
          messages.length > 0 &&
          messages[messages.length - 1].sender === "me" && (
            <div className="flex justify-end pr-1 pt-[2px]" style={{ zIndex: 1 }}>
              <div
                className="w-[14px] h-[14px] rounded-full overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "#262626" }}
              >
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-[7px] h-[7px]" style={{ color: "#a8a8a8" }} />
                )}
              </div>
            </div>
          )}
      </div>

      {/* Input bar */}
      <div
        className="px-3 shrink-0 flex items-center gap-[8px]"
        style={{
          backgroundColor: "#000000",
          borderTop: "0.5px solid rgba(255,255,255,0.08)",
          height: "50px",
        }}
      >
        <div
          className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0"
          style={{ border: "2px solid #3797f0" }}
        >
          <Camera className="w-[18px] h-[18px]" style={{ color: "#3797f0" }} />
        </div>
        <div
          className="flex-1 flex items-center rounded-full px-3"
          style={{
            border: "1px solid #363636",
            height: "36px",
          }}
        >
          <span className="text-[15px]" style={{ color: "#8e8e8e" }}>
            Message...
          </span>
          <div
            className="ml-auto flex items-center gap-[12px]"
            style={{ color: "#ffffff" }}
          >
            <ImageIcon className="w-[22px] h-[22px]" />
            <Heart className="w-[22px] h-[22px]" />
          </div>
        </div>
      </div>

      {/* Home bar spacer */}
      <div className="h-[34px] shrink-0" style={{ backgroundColor: "#000000" }} />
    </div>
  );
}
