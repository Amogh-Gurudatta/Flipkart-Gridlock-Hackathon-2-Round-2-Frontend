'use client';

import { useState } from 'react';
import DocumentForm from '@/components/generator/DocumentForm';
import LivePreview from '@/components/generator/LivePreview';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export default function GeneratorPage() {
  const [eventId, setEventId] = useState('');
  const [eventCause, setEventCause] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [predictedDuration, setPredictedDuration] = useState(60);
  const [severityLevel, setSeverityLevel] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('MODERATE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventId || !eventCause || !locationAddress || isSubmitting) return;

    setIsSubmitting(true);

    // Subtle confirmation audio cue (Web Audio API — no external assets needed)
    try {
      const AudioCtx = (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.12);
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // Ignore if Audio API is blocked
    }

    // PDF Generation
    try {
      const docElement = document.getElementById('warrant-document');
      if (docElement) {
        const canvas = await html2canvas(docElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#060d1a',
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
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

        const xOffset = (pageWidth - finalWidth) / 2;
        const yOffset = (pageHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        pdf.save('BTP_Deployment_Order.pdf');

        toast.success('DEPLOYMENT ORDER EXPORTED', {
          description: `${eventId} — ${eventCause} saved as BTP_Deployment_Order.pdf`,
          className: 'font-mono uppercase text-xs',
        });
      }
    } catch (error) {
      console.error('PDF Generation failed', error);
      toast.error('PDF EXPORT FAILED', {
        description: 'Could not generate document. Try again.',
        className: 'font-mono uppercase text-xs',
      });
    }

    // Reset after 2 seconds
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen relative p-6 pt-20 lg:p-12 lg:pt-12 pb-24 overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1
            className="text-xl font-mono tracking-[0.3em] uppercase mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Deployment Order Generator
          </h1>
          <p
            className="text-xs font-mono tracking-widest uppercase opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            Draft and export an official BTP Traffic Event Deployment Order.
          </p>
        </div>

        {/* Split Screen */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mt-8">

          {/* Left: Form */}
          <div className="flex flex-col h-full w-full">
            <DocumentForm
              eventId={eventId}
              setEventId={setEventId}
              eventCause={eventCause}
              setEventCause={setEventCause}
              locationAddress={locationAddress}
              setLocationAddress={setLocationAddress}
              predictedDuration={predictedDuration}
              setPredictedDuration={setPredictedDuration}
              severityLevel={severityLevel}
              setSeverityLevel={setSeverityLevel}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Right: Live Preview */}
          <div className="flex flex-col w-full items-center lg:justify-center pt-2 lg:pt-0 lg:sticky lg:top-24 relative z-0">
            <LivePreview
              eventId={eventId}
              eventCause={eventCause}
              locationAddress={locationAddress}
              predictedDuration={predictedDuration}
              severityLevel={severityLevel}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
