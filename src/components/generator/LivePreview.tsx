"use client";

import { motion } from "framer-motion";
import type { ForecastResponse } from "@/types/forecast";

interface LivePreviewProps {
  forecast: ForecastResponse | null;
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: "#22c55e",
  MODERATE: "#f59e0b",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: string;
}) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span
        className="uppercase font-mono tracking-widest shrink-0"
        style={{ color: "#475569", fontSize: "0.68em" }}
      >
        {label}:
      </span>
      <motion.span
        key={String(value)}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="font-mono font-bold uppercase tracking-wider text-right wrap-break-word max-w-[65%]"
        style={{ color: highlight ?? "#e2e8f0", fontSize: "0.9em" }}
      >
        {value}
      </motion.span>
    </div>
  );
}

export default function LivePreview({ forecast }: LivePreviewProps) {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const severityColor = forecast
    ? (SEVERITY_COLORS[forecast.predictions.severity_level] ?? "#e2e8f0")
    : "#475569";

  const isCriticalOrHigh =
    forecast?.predictions.severity_level === "CRITICAL" ||
    forecast?.predictions.severity_level === "HIGH";

  return (
    <div className="w-full h-full flex items-start justify-center p-4">
      <div
        id="warrant-document"
        className="relative w-full max-w-[350px] sm:max-w-md md:max-w-lg shadow-2xl flex flex-col p-[5%] overflow-hidden"
        style={{
          aspectRatio: "1 / 1.414",
          backgroundColor: "#060d1a",
          border: "2px solid #1e3a5f",
          fontSize: "clamp(7px, 1.8vw, 12px)",
        }}
      >
        {/* Watermark */}
        <div
          className="absolute inset-[-50%] flex items-center justify-center font-bold tracking-[0.25em] pointer-events-none whitespace-nowrap select-none"
          style={{
            color: "#1d4ed8",
            fontSize: "2.4em",
            opacity: 0.04,
            transform: "rotate(-45deg)",
          }}
        >
          BENGALURU TRAFFIC POLICE
        </div>

        <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden gap-[4%]">
          {/* ── Header ────────────────────────────────────────────────────── */}
          <div
            className="pb-[4%]"
            style={{ borderBottom: "2px solid #1e3a5f" }}
          >
            <div className="flex items-center justify-center gap-[2%] mb-[3%]">
              <svg width="1.8em" height="1.8em" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
                  fill="#1d4ed8"
                  opacity="0.9"
                />
                <path
                  d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
                <text
                  x="12"
                  y="15"
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="monospace"
                >
                  BTP
                </text>
              </svg>
              <div className="text-center">
                <div
                  className="font-mono font-bold uppercase tracking-[0.2em]"
                  style={{ color: "#e2e8f0", fontSize: "1em" }}
                >
                  BENGALURU TRAFFIC POLICE
                </div>
                <div
                  className="font-mono uppercase tracking-[0.35em]"
                  style={{ color: "#3b82f6", fontSize: "0.65em" }}
                >
                  COMMAND CENTER
                </div>
              </div>
            </div>

            <div
              className="pdf-adjust-head flex items-center justify-center text-center font-mono font-bold uppercase tracking-[0.25em] py-[1.5%] px-[2%] mt-[2%] wrap-break-word"
              style={{
                color: "#1d4ed8",
                fontSize: "0.95em",
                backgroundColor: "#0f1f3d",
                border: "1px solid #1e3a5f",
              }}
            >
              TRAFFIC EVENT DEPLOYMENT ORDER
            </div>

            <div
              className="flex justify-between mt-[3%] font-mono tracking-widest"
              style={{ color: "#475569", fontSize: "0.65em" }}
            >
              <span>DATE: {currentDate}</span>
              <span>TIME: {currentTime} IST</span>
              <span>REF: {forecast?.event_id ?? "—"}</span>
            </div>
          </div>

          {/* ── Event Details ─────────────────────────────────────────────── */}
          <div
            className="p-[4%]"
            style={{ backgroundColor: "#080f1e", border: "1px solid #1e3a5f" }}
          >
            <div
              className="font-mono uppercase tracking-widest mb-[3%]"
              style={{ color: "#475569", fontSize: "0.65em" }}
            >
              ▸ EVENT DETAILS
            </div>
            <div className="flex flex-col gap-[0.9em]">
              <Row label="Cause" value={forecast?.cause ?? "—"} />
              <Row label="Priority" value={forecast?.priority ?? "—"} />
              <Row label="Corridor" value={forecast?.corridor ?? "—"} />
              <Row label="Location" value={forecast?.location.address ?? "—"} />
              <Row
                label="Coordinates"
                value={
                  forecast
                    ? `${forecast.location.lat.toFixed(4)}° N, ${forecast.location.lng.toFixed(4)}° E`
                    : "—"
                }
              />
              <Row
                label="Est. Duration"
                value={
                  forecast
                    ? `${Math.round(forecast.predictions.estimated_duration_mins)} minutes`
                    : "—"
                }
              />

              {/* Severity */}
              <div className="flex justify-between items-center">
                <span
                  className="uppercase font-mono tracking-widest"
                  style={{ color: "#475569", fontSize: "0.68em" }}
                >
                  Severity Level:
                </span>
                <span
                  className="pdf-adjust-badge inline-flex items-center justify-center text-center font-mono font-bold uppercase tracking-widest px-3 py-0.5 wrap-break-word"
                  style={{
                    color: severityColor,
                    backgroundColor: `${severityColor}18`,
                    border: `1px solid ${severityColor}`,
                    fontSize: "0.8em",
                  }}
                >
                  {forecast?.predictions.severity_level ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Deployment Recommendations ────────────────────────────────── */}
          <div
            className="p-[4%]"
            style={{
              backgroundColor: "#080f1e",
              border: `1px solid ${isCriticalOrHigh ? "#1d4ed8" : "#1e3a5f"}`,
            }}
          >
            <div
              className="font-mono uppercase tracking-widest mb-[3%]"
              style={{ color: "#3b82f6", fontSize: "0.65em" }}
            >
              ▸ DEPLOYMENT RECOMMENDATIONS
            </div>
            <div className="flex flex-col gap-[0.9em]">
              <Row
                label="Traffic Cops"
                value={
                  forecast
                    ? `${forecast.deployment_recommendation.traffic_cops_needed} officers`
                    : "—"
                }
              />
              <Row
                label="Barricades"
                value={
                  forecast
                    ? `${forecast.deployment_recommendation.barricades} units`
                    : "—"
                }
              />
              <Row
                label="Cranes"
                value={
                  forecast
                    ? `${forecast.deployment_recommendation.cranes} units`
                    : "—"
                }
              />

              {/* Diversion status */}
              <div className="flex justify-between items-center">
                <span
                  className="uppercase font-mono tracking-widest"
                  style={{ color: "#475569", fontSize: "0.68em" }}
                >
                  Diversion:
                </span>
                <span
                  className="pdf-adjust-div inline-flex items-center justify-center text-center font-mono font-bold uppercase tracking-wider px-2 py-0.5 max-w-[55%] wrap-break-word"
                  style={{
                    color: isCriticalOrHigh ? "#ef4444" : "#22c55e",
                    backgroundColor: isCriticalOrHigh
                      ? "#ef444415"
                      : "#22c55e15",
                    border: `1px solid ${isCriticalOrHigh ? "#ef4444" : "#22c55e"}`,
                    fontSize: "0.7em",
                  }}
                >
                  {forecast?.deployment_recommendation.diversion_route ??
                    "STANDBY"}
                </span>
              </div>

              {/* Responding station */}
              <Row
                label="Responding Station"
                value={
                  forecast?.deployment_recommendation.responding_station ?? "—"
                }
              />

              {/* Multi-jurisdiction backup alert */}
              {forecast?.deployment_recommendation.needs_backup && (
                <div
                  className="pdf-adjust-backup flex items-center gap-2 p-[2%] mt-[1%]"
                  style={{
                    backgroundColor: "#ef444418",
                    border: "2px solid #ef4444",
                    animation: "backupPulse 1s ease-in-out infinite",
                  }}
                >
                  <span
                    className="flex flex-col items-center justify-center font-mono font-black uppercase tracking-wider text-center w-full wrap-break-word"
                    style={{
                      color: "#ef4444",
                      fontSize: "0.72em",
                      lineHeight: 1.4,
                    }}
                  >
                    <span>⚠️ STATION CAPACITY EXCEEDED</span>
                    <span>MULTI-JURISDICTION BACKUP REQUIRED</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div
            className="pt-[2%] text-center font-mono tracking-widest uppercase mt-auto"
            style={{
              borderTop: "1px solid #1e3a5f",
              color: "#334155",
              fontSize: "0.6em",
            }}
          >
            Bengaluru Traffic Police — Confidential Operational Document — Not
            For Public Disclosure
          </div>
        </div>

        {/* ── DISPATCH AUTHORIZED Stamp ──────────────────────────────────── */}
        {forecast && (
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none z-20"
            style={{
              transform: "translate(-50%, -50%) rotate(-12deg)",
              opacity: 0.18,
              width: "75%",
            }}
          >
            <svg width="100%" height="auto" viewBox="0 0 440 120">
              <rect
                x="5"
                y="5"
                width="430"
                height="110"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="10"
              />
              <text
                x="50%"
                y="52%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="#1d4ed8"
                style={{
                  fontSize: "30px",
                  letterSpacing: "4px",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                }}
              >
                DISPATCH AUTHORIZED
              </text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Keyframe for the backup warning flash
const _style = `
  @keyframes backupPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }
`;
if (
  typeof document !== "undefined" &&
  !document.getElementById("btp-backup-pulse")
) {
  const s = document.createElement("style");
  s.id = "btp-backup-pulse";
  s.textContent = _style;
  document.head.appendChild(s);
}
