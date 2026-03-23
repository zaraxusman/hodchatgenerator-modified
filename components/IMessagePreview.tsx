import { IMessageConfig } from "@/types/imessage";
import { ChevronLeft, Phone, Video, User } from "lucide-react";
import WallpaperLayer from "./WallpaperLayer";

interface Props {
  config: IMessageConfig;
}

export default function IMessagePreview({ config }: Props) {
  const { contactName, profilePicUrl, messages } = config;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "#000000",
        fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Status bar spacer */}
      <div className="h-[54px] shrink-0" style={{ backgroundColor: "#000000" }} />

      {/* iMessage Header */}
      <div
        className="flex items-center px-2 shrink-0"
        style={{
          backgroundColor: "#1c1c1e",
          height: "48px",
          borderBottom: "0.5px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center gap-[2px] shrink-0" style={{ color: "#0a84ff" }}>
          <ChevronLeft className="w-[28px] h-[28px]" strokeWidth={2.5} />
        </div>
        <div className="flex-1 flex flex-col items-center min-w-0">
          <div
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center overflow-hidden mb-[1px]"
            style={{ backgroundColor: "#3a3a3c" }}
          >
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4" style={{ color: "#8e8e93" }} />
            )}
          </div>
          <p
            className="text-[11px] font-medium truncate max-w-[180px]"
            style={{ color: "#ffffff", lineHeight: "13px" }}
          >
            {contactName}
          </p>
        </div>
        <div className="flex items-center gap-[14px] shrink-0" style={{ color: "#0a84ff" }}>
          <Phone className="w-[20px] h-[20px]" />
          <Video className="w-[22px] h-[22px]" />
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-[12px] py-3 space-y-[4px] relative"
        style={{ backgroundColor: "#000000" }}
      >
        <WallpaperLayer wallpaper={config.wallpaper} />
        {messages.map((msg, i) => {
          const isMe = msg.sender === "me";
          const prevMsg = messages[i - 1];
          const showTail = !prevMsg || prevMsg.sender !== msg.sender;

          return (
            <div key={msg.id}>
              <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[70%] px-[12px] py-[7px] text-[16px]"
                  style={{
                    backgroundColor: isMe ? "#0a84ff" : "#3a3a3c",
                    color: "#ffffff",
                    lineHeight: "21px",
                    borderRadius: showTail
                      ? isMe
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px"
                      : "18px",
                    letterSpacing: "-0.1px",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
                  }}
                >
                  <span className="break-words">{msg.text}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Delivered indicator */}
        {messages.length > 0 && messages[messages.length - 1].sender === "me" && (
          <div className="flex justify-end pr-1 pt-[2px]">
            <span className="text-[11px] font-medium" style={{ color: "#8e8e93" }}>
              Delivered
            </span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        className="px-2 shrink-0 flex items-center gap-[6px]"
        style={{
          backgroundColor: "#000000",
          borderTop: "0.5px solid rgba(255,255,255,0.1)",
          height: "50px",
        }}
      >
        <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#3a3a3c" }}>
          <span className="text-[18px]">+</span>
        </div>
        <div
          className="flex-1 flex items-center rounded-full px-3"
          style={{
            border: "1px solid #3a3a3c",
            height: "34px",
          }}
        >
          <span className="text-[15px]" style={{ color: "#8e8e93" }}>
            iMessage
          </span>
        </div>
        <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0" style={{ color: "#0a84ff" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>

      {/* Home bar spacer */}
      <div className="h-[34px] shrink-0" style={{ backgroundColor: "#000000" }} />
    </div>
  );
}
