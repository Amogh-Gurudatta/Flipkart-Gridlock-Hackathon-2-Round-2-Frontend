'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import type { IncidentData } from '@/context/DataContext';

interface ForecastChartProps {
  incident: IncidentData;
}

/** Generates a bell-curve dataset across N hourly time-steps.
 *  The congestion peaks at the midpoint of the predicted duration. */
function generateBellCurve(durationMins: number): Array<{ label: string; congestion: number }> {
  // We spread the curve across ~5 display points regardless of total duration
  const steps = 6; // +0 h … +5 h labels
  const peakStep = (steps - 1) / 2; // bell peak at centre
  const sigma = 1.2; // width of the bell

  return Array.from({ length: steps }, (_, i) => {
    // Gaussian bell: e^(-0.5 * ((i - peak) / sigma)^2)
    const raw = Math.exp(-0.5 * Math.pow((i - peakStep) / sigma, 2));
    // Scale so the maximum ≈ 95 (% congestion)
    const congestion = Math.round(raw * 95);
    const hours = Math.round((i / (steps - 1)) * (durationMins / 60) * 10) / 10;
    const label = hours === 0 ? 'Now' : `+${hours}h`;
    return { label, congestion };
  });
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

/** Custom tooltip shown on hover */
function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest"
      style={{
        backgroundColor: '#0c1a2e',
        border: '1px solid #1e3a5f',
        color: '#e2e8f0',
      }}
    >
      <div style={{ color: '#64748b' }}>{label}</div>
      <div style={{ color: '#1d4ed8' }}>Congestion: {payload[0].value}%</div>
    </div>
  );
}

export default function ForecastChart({ incident }: ForecastChartProps) {
  const durationMins = incident.estimated_duration_mins ?? 60;
  const severity = (incident.severity_level as string) ?? 'MODERATE';
  const accentColor = SEVERITY_COLORS[severity] ?? '#1d4ed8';
  const data = generateBellCurve(durationMins);

  return (
    <div
      className="w-full mt-3 p-3"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 80%, transparent)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Chart header */}
      <div className="flex justify-between items-center mb-3">
        <span
          className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Predicted Congestion Life-Cycle
        </span>
        <span
          className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5"
          style={{
            color: accentColor,
            border: `1px solid ${accentColor}`,
            backgroundColor: `${accentColor}15`,
          }}
        >
          {durationMins} min
        </span>
      </div>

      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="congestionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.35} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: '#475569', fontSize: 8, fontFamily: 'monospace' }}
            axisLine={{ stroke: '#1e3a5f' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 8, fontFamily: 'monospace' }}
            axisLine={{ stroke: '#1e3a5f' }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1e3a5f', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="congestion"
            stroke={accentColor}
            strokeWidth={2}
            fill="url(#congestionGradient)"
            dot={false}
            activeDot={{ r: 4, fill: accentColor, stroke: '#060d1a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <p
        className="text-[8px] font-mono uppercase tracking-widest mt-1 text-center"
        style={{ color: '#334155' }}
      >
        AI-generated forecast — actual conditions may vary
      </p>
    </div>
  );
}
