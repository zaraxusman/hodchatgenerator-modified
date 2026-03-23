import { ReactNode, RefObject } from "react";

interface IPhoneFrameProps {
  children: ReactNode;
  showFrame: boolean;
  statusBarTime: string;
  batteryPercent: number;
  theme?: "light" | "dark";
  innerRef?: RefObject<HTMLDivElement>;
}

export default function IPhoneFrame({
  children,
  showFrame,
  statusBarTime,
  batteryPercent,
  theme = "dark",
  innerRef,
}: IPhoneFrameProps) {
  const isWhite = theme === "light";
  const statusColor = isWhite ? "#000000" : "#ffffff";

  if (!showFrame) {
    return (
      <div
        ref={innerRef}
        className="w-full max-w-[393px] mx-auto overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[28px]"
        style={{ backgroundColor: isWhite ? "#ffffff" : "#000000" }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="scale-[0.82] sm:scale-[0.85] lg:scale-100 origin-top">
      <div
        ref={innerRef}
        className="relative"
        style={{
          width: "393px",
          borderRadius: "50px",
          background: "#1c1c1e",
          padding: "10px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 0 0 3px #0a0a0a, 0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Side buttons — volume */}
        <div
          style={{
            position: "absolute",
            left: "-3px",
            top: "120px",
            width: "3px",
            height: "28px",
            background: "#2a2a2c",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-3px",
            top: "160px",
            width: "3px",
            height: "48px",
            background: "#2a2a2c",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-3px",
            top: "218px",
            width: "3px",
            height: "48px",
            background: "#2a2a2c",
            borderRadius: "2px 0 0 2px",
          }}
        />
        {/* Power button */}
        <div
          style={{
            position: "absolute",
            right: "-3px",
            top: "175px",
            width: "3px",
            height: "68px",
            background: "#2a2a2c",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Screen */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "42px",
            backgroundColor: isWhite ? "#ffffff" : "#000000",
            height: "852px",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.12), inset 0 0 2px rgba(0,0,0,0.06)",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: "11px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "126px",
              height: "36px",
              backgroundColor: "#000000",
              borderRadius: "20px",
              zIndex: 30,
            }}
          />

          {/* iOS Status Bar */}
          <div
            className="absolute top-0 left-0 right-0 z-20 flex items-end justify-between"
            style={{
              height: "54px",
              paddingLeft: "28px",
              paddingRight: "22px",
              paddingBottom: "0px",
            }}
          >
            {/* Time — left side */}
            <span
              style={{
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.2px",
                color: statusColor,
                fontFamily:
                  "'SF Pro Text', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                lineHeight: "20px",
              }}
            >
              {statusBarTime}
            </span>

            {/* Right icons */}
            <div className="flex items-center gap-[6px]" style={{ paddingBottom: "1px" }}>
              {/* Cellular */}
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <rect x="0.5" y="8.5" width="2.5" height="3" rx="0.5" fill={statusColor} />
                <rect x="4.5" y="5.5" width="2.5" height="6" rx="0.5" fill={statusColor} />
                <rect x="8.5" y="2.5" width="2.5" height="9" rx="0.5" fill={statusColor} />
                <rect x="12.5" y="0" width="2.5" height="11.5" rx="0.5" fill={statusColor} />
              </svg>

              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  d="M8 10.2a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z"
                  fill={statusColor}
                />
                <path
                  d="M4.93 7.07a4.35 4.35 0 016.14 0"
                  stroke={statusColor}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M2.34 4.46a7.65 7.65 0 0111.32 0"
                  stroke={statusColor}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Battery */}
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="22"
                  height="12"
                  rx="2.5"
                  stroke={statusColor}
                  strokeOpacity="0.35"
                />
                <rect
                  x="2"
                  y="2"
                  width={Math.max(2, (batteryPercent / 100) * 19)}
                  height="9"
                  rx="1.5"
                  fill={batteryPercent <= 20 ? "#FF3B30" : statusColor}
                />
                <path
                  d="M24 4.5c.8 0 1.5.56 1.5 1.25v1.5c0 .69-.7 1.25-1.5 1.25"
                  stroke={statusColor}
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* Chat content */}
          <div className="relative h-full">{children}</div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center" style={{ paddingTop: "6px", paddingBottom: "4px" }}>
          <div
            style={{
              width: "134px",
              height: "5px",
              borderRadius: "100px",
              backgroundColor: "rgba(255,255,255,0.25)",
            }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
