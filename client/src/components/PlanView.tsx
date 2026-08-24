/**
 * PlanView - SVG plan drawing of the working platform and rig footprint
 * Shows platform extent, the two rig tracks, and the minimum edge margin.
 */
interface PlanViewProps {
  trackWidth: number; // m (W)
  trackLength: number; // m (L1)
  thickness: number; // mm — used for the edge margin note
}

export default function PlanView({ trackWidth, trackLength, thickness }: PlanViewProps) {
  const svgW = 400;
  const svgH = 300;
  const margin = 24;

  // Platform extent
  const platX = margin;
  const platY = margin;
  const platW = svgW - 2 * margin;
  const platH = svgH - 2 * margin;

  // Edge margin (2 m or 1x thickness) — drawn as dashed inner zone
  const inset = 30;

  // Rig tracks — scaled to fit inside the inner zone
  const maxTrackLen = platH - 2 * inset - 40;
  const scale = Math.min(maxTrackLen / Math.max(trackLength, 1), 50);
  const tLen = Math.max(trackLength * scale, 70);
  const tW = Math.max(trackWidth * scale, 14);
  const gap = Math.max(tW * 2.4, 56);
  const cx = svgW / 2;
  const cy = svgH / 2;

  const edgeMarginM = Math.max(2, thickness / 1000).toFixed(1);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card p-3">
      <p className="text-xs font-heading font-semibold text-muted-foreground mb-2 text-center uppercase tracking-wider">
        Platform Plan &amp; Rig Footprint
      </p>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: 280 }}>
        {/* Platform extent */}
        <rect x={platX} y={platY} width={platW} height={platH} fill="#FDF6E3" stroke="#4A4A4A" strokeWidth={2} />
        <text x={platX + 8} y={platY + 16} className="text-[9px]" fill="#8a7a55" fontFamily="Space Grotesk, sans-serif" fontWeight={600}>
          WORKING PLATFORM EXTENT
        </text>

        {/* Plant working zone (dashed) */}
        <rect
          x={platX + inset}
          y={platY + inset}
          width={platW - 2 * inset}
          height={platH - 2 * inset}
          fill="none"
          stroke="#E8590C"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />

        {/* Rig tracks */}
        {[-1, 1].map(side => (
          <rect
            key={side}
            x={cx + (side * gap) / 2 - tW / 2}
            y={cy - tLen / 2}
            width={tW}
            height={tLen}
            fill="#C8CDD3"
            stroke="#4A4A4A"
            strokeWidth={1.5}
          />
        ))}
        <text x={cx} y={cy + 3} textAnchor="middle" className="text-[10px]" fill="#333" fontFamily="Space Grotesk, sans-serif" fontWeight={700}>
          RIG TRACKS
        </text>

        {/* Dimensions */}
        <text
          x={cx + gap / 2 + tW / 2 + 8}
          y={cy}
          className="text-[9px]"
          fill="#555"
          fontFamily="monospace"
        >
          L1 = {trackLength} m
        </text>
        <text
          x={cx - gap / 2}
          y={cy - tLen / 2 - 8}
          textAnchor="middle"
          className="text-[9px]"
          fill="#555"
          fontFamily="monospace"
        >
          W = {trackWidth} m
        </text>

        {/* Edge margin note */}
        <text x={cx} y={platY + platH - 12} textAnchor="middle" className="text-[8.5px]" fill="#E8590C" fontFamily="Space Grotesk, sans-serif">
          Platform extends min. {edgeMarginM} m beyond tracks in all working positions
        </text>
      </svg>
    </div>
  );
}
