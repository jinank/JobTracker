import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "RethinkJobs — AI-powered job application tracker for students and professionals";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #4c1d95 45%, #6b46fe 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 56, fontWeight: 800, color: "white" }}>RethinkJobs</span>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          AI-powered job application tracker for students &amp; professionals
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          Track job applications · Internship tracker · Gmail sync
        </div>
      </div>
    ),
    { ...size }
  );
}
