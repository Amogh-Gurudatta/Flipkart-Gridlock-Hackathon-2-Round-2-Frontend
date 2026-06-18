'use client';

interface DocumentFormProps {
  eventId: string;
  setEventId: (val: string) => void;
  eventCause: string;
  setEventCause: (val: string) => void;
  locationAddress: string;
  setLocationAddress: (val: string) => void;
  predictedDuration: number;
  setPredictedDuration: (val: number) => void;
  severityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  setSeverityLevel: (val: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL') => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SEVERITY_OPTIONS: Array<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'> = [
  'LOW', 'MODERATE', 'HIGH', 'CRITICAL',
];

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

export default function DocumentForm({
  eventId,
  setEventId,
  eventCause,
  setEventCause,
  locationAddress,
  setLocationAddress,
  predictedDuration,
  setPredictedDuration,
  severityLevel,
  setSeverityLevel,
  isSubmitting,
  onSubmit,
}: DocumentFormProps) {
  const inputStyle = {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    opacity: isSubmitting ? 0.5 : 1,
  };

  const focusHandlers = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!isSubmitting) e.target.style.borderColor = 'var(--accent-primary)';
  };
  const blurHandlers = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!isSubmitting) e.target.style.borderColor = 'var(--border-color)';
  };

  const isReady = !!eventId && !!eventCause && !!locationAddress && predictedDuration > 0;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full max-w-md">

      {/* Event ID */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Event ID
        </label>
        <input
          type="text"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g. BTP-EVT-005"
          className="w-full px-4 py-3 text-sm font-mono outline-none transition-colors duration-200"
          style={inputStyle}
          onFocus={focusHandlers}
          onBlur={blurHandlers}
        />
      </div>

      {/* Event Cause */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Event Cause
        </label>
        <input
          type="text"
          value={eventCause}
          onChange={(e) => setEventCause(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g. Tree Fall, Breakdown, Rally"
          className="w-full px-4 py-3 text-sm font-mono outline-none transition-colors duration-200"
          style={inputStyle}
          onFocus={focusHandlers}
          onBlur={blurHandlers}
        />
      </div>

      {/* Location Address */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Location Address
        </label>
        <input
          type="text"
          value={locationAddress}
          onChange={(e) => setLocationAddress(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g. Sankey Road, near Windsor Manor"
          className="w-full px-4 py-3 text-sm font-mono outline-none transition-colors duration-200"
          style={inputStyle}
          onFocus={focusHandlers}
          onBlur={blurHandlers}
        />
      </div>

      {/* Predicted Duration */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <label className="text-[10px] uppercase font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Predicted Duration (Mins)
          </label>
          <span className="text-[10px] font-mono tracking-widest" style={{ color: 'var(--accent-primary)' }}>
            {predictedDuration} min
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="360"
          step="5"
          value={predictedDuration}
          onChange={(e) => setPredictedDuration(Number(e.target.value))}
          disabled={isSubmitting}
          className="w-full h-8 appearance-none cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            opacity: isSubmitting ? 0.5 : 1,
          }}
        />
        <style>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 30px;
            width: 16px;
            background: var(--accent-primary);
            cursor: pointer;
            border: none;
            border-radius: 0;
          }
          input[type=range]::-moz-range-thumb {
            height: 30px;
            width: 16px;
            background: var(--accent-primary);
            cursor: pointer;
            border: none;
            border-radius: 0;
          }
        `}</style>
      </div>

      {/* Severity Level */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Severity Level
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SEVERITY_OPTIONS.map((level) => (
            <button
              key={level}
              type="button"
              disabled={isSubmitting}
              onClick={() => setSeverityLevel(level)}
              className="py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              style={{
                border: `1px solid ${severityLevel === level ? SEVERITY_COLORS[level] : 'var(--border-color)'}`,
                backgroundColor: severityLevel === level
                  ? `${SEVERITY_COLORS[level]}18`
                  : 'var(--bg-surface)',
                color: severityLevel === level ? SEVERITY_COLORS[level] : 'var(--text-muted)',
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Submit / Export Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isReady}
        className="relative w-full h-14 overflow-hidden mt-4 group cursor-pointer disabled:cursor-not-allowed"
        style={{
          border: '1px solid var(--accent-primary)',
          backgroundColor: isSubmitting
            ? 'var(--bg-surface)'
            : 'color-mix(in srgb, var(--accent-primary) 10%, transparent)',
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting && isReady) {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.backgroundColor =
              'color-mix(in srgb, var(--accent-primary) 10%, transparent)';
          }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-10 transition-colors duration-200 group-hover:text-black">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.3em]"
            style={{
              color: isSubmitting || !isReady ? 'var(--text-muted)' : 'var(--accent-primary)',
            }}
          >
            {isSubmitting ? 'GENERATING PDF...' : 'Export Deployment Order'}
          </span>
        </div>

        {isSubmitting && (
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-primary) 40%, transparent)',
              animation: 'fillProgress 2s linear forwards',
            }}
          />
        )}
      </button>

      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </form>
  );
}
