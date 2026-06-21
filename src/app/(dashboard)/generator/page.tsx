"use client";

import { useState } from "react";
import DocumentForm from "@/components/generator/DocumentForm";
import LivePreview from "@/components/generator/LivePreview";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import type { EventRequest, ForecastResponse } from "@/types/forecast";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export default function GeneratorPage() {
  const { setLastForecast, setDraftLocation } = useData();
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [forecastPending, setForecastPending] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // ── Step 1: Call the backend and get a real forecast ──────────────────────
  const handleForecast = async (req: EventRequest) => {
    setForecastPending(true);
    setForecast(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Server returned ${res.status}: ${body}`);
      }

      const data: ForecastResponse = await res.json();
      setForecast(data);
      setLastForecast(data); // push to DataContext → MapWidget renders the overlay
      setDraftLocation(null); // clear the pending location pin now that the forecast is live

      toast.success("FORECAST RECEIVED", {
        description: `Event ${data.event_id} — ${data.predictions.severity_level} severity, ~${Math.round(data.predictions.estimated_duration_mins)} min`,
        className: "font-mono uppercase text-xs",
      });
    } catch (err) {
      console.error("Forecast failed", err);
      toast.error("FORECAST FAILED", {
        description:
          err instanceof Error ? err.message : "Backend unreachable.",
        className: "font-mono uppercase text-xs",
      });
    } finally {
      setForecastPending(false);
    }
  };

  // ── Step 2: Export the filled-in preview as a PDF ────────────────────────
  const handleExportPdf = async () => {
    if (!forecast || isExporting) return;
    setIsExporting(true);

    // Subtle audio confirmation cue (Web Audio API)
    try {
      const AudioCtx = (window.AudioContext ||
        (window as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext)!;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        660,
        audioCtx.currentTime + 0.12,
      );
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // ignore
    }

    try {
      const docElement = document.getElementById("warrant-document");
      if (!docElement) throw new Error("Preview element not found");

      const canvas = await html2canvas(docElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#060d1a",
        onclone: (clonedDoc) => {
          // Fix html2canvas font baseline bugs without breaking the live preview UI
          const heads = clonedDoc.querySelectorAll(".pdf-adjust-head");
          heads.forEach((b) => {
            (b as HTMLElement).style.paddingTop = "0px";
            (b as HTMLElement).style.paddingBottom = "3%";
          });

          const badges = clonedDoc.querySelectorAll(".pdf-adjust-badge");
          badges.forEach((b) => {
            (b as HTMLElement).style.paddingTop = "0px";
            (b as HTMLElement).style.paddingBottom = "8px";
          });

          const divs = clonedDoc.querySelectorAll(".pdf-adjust-div");
          divs.forEach((b) => {
            (b as HTMLElement).style.paddingTop = "0px";
            (b as HTMLElement).style.paddingBottom = "10px";
          });

          const backups = clonedDoc.querySelectorAll(".pdf-adjust-backup");
          backups.forEach((b) => {
            (b as HTMLElement).style.paddingTop = "0px";
            (b as HTMLElement).style.paddingBottom = "4%";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      let finalWidth = maxWidth;
      let finalHeight = (canvas.height * maxWidth) / canvas.width;
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = (canvas.width * maxHeight) / canvas.height;
      }

      pdf.addImage(
        imgData,
        "PNG",
        (pageWidth - finalWidth) / 2,
        (pageHeight - finalHeight) / 2,
        finalWidth,
        finalHeight,
      );
      pdf.save(`BTP_Deployment_Order_${forecast.event_id}.pdf`);

      toast.success("DEPLOYMENT ORDER EXPORTED", {
        description: `${forecast.event_id} saved as PDF`,
        className: "font-mono uppercase text-xs",
      });
    } catch (error) {
      console.error("PDF Generation failed", error);
      toast.error("PDF EXPORT FAILED", {
        description: "Could not generate document. Try again.",
        className: "font-mono uppercase text-xs",
      });
    } finally {
      setTimeout(() => setIsExporting(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen relative p-6 pt-20 lg:p-12 lg:pt-12 pb-24 overflow-y-auto"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1
            className="text-xl font-mono tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Deployment Order Generator
          </h1>
          <p
            className="text-xs font-mono tracking-widest uppercase opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            Submit an event to the AI forecast engine, then export an official
            BTP Deployment Order.
          </p>
        </div>

        {/* Split Screen */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mt-8">
          {/* Left: Form */}
          <div className="flex flex-col h-full w-full">
            <DocumentForm
              isSubmitting={isExporting}
              forecastPending={forecastPending}
              onForecast={handleForecast}
              onExportPdf={handleExportPdf}
              hasForecast={forecast !== null}
            />
          </div>

          {/* Right: Live Preview */}
          <div className="flex flex-col w-full items-center lg:sticky lg:top-24 relative z-0 h-full overflow-y-auto pb-32">
            <LivePreview forecast={forecast} />
          </div>
        </div>
      </div>
    </div>
  );
}
