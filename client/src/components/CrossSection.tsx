/**
 * CrossSection - SVG cross-section diagram of the working platform
 * Shows platform layers, subgrade, optional reinforcement, and dimensions
 */
interface CrossSectionProps {
  thickness: number; // mm
  trackWidth: number; // m
  subgradeType: 'cohesive' | 'granular';
  useReinforcement: boolean;
}

export default function CrossSection({ thickness, trackWidth, subgradeType, useReinforcement }: CrossSectionProps) {
  const svgW = 400;
  const svgH = 260;
  const margin = 20;

  // Layout
  const groundY = 60;
  const platformH = Math.min(120, Math.max(40, thickness / 10));
  const subgradeY = groundY + platformH;
  const subgradeH = svgH - subgradeY - margin;
  const reinfY = useReinforcement ? subgradeY - 10 : 0;

  // Track
  const trackW = 80;
  const trackH = 18;
  const trackX = svgW / 2 - trackW / 2;
  const trackY = groundY - trackH;

  // Load arrows
  const arrowSpacing = 16;
  const arrowCount = 4;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card p-3">
      <p className="text-xs font-heading font-semibold text-muted-foreground mb-2 text-center uppercase tracking-wider">
        Platform Cross-Section
      </p>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: 240 }}>
        {/* Subgrade */}
        <rect
          x={margin}
          y={subgradeY}
          width={svgW - 2 * margin}
          height={subgradeH}
          fill={subgradeType === 'cohesive' ? '#8B9DAF' : '#C4A96A'}
          rx={0}
        />
        <text
          x={svgW / 2}
          y={subgradeY + subgradeH / 2 + 4}
          textAnchor="middle"
          className="text-[10px]"
          fill="#fff"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight={600}
        >
          {subgradeType === 'cohesive' ? 'COHESIVE SUBGRADE' : 'GRANULAR SUBGRADE'}
        </text>

        {/* Platform fill */}
        <rect
          x={margin}
          y={groundY}
          width={svgW - 2 * margin}
          height={platformH}
          fill="#B8956A"
          rx={0}
        />
        {/* Gravel texture dots */}
        {Array.from({ length: 30 }).map((_, i) => {
          const cx = margin + 10 + (i % 10) * 35 + (Math.floor(i / 10) % 2) * 17;
          const cy = groundY + 10 + Math.floor(i / 10) * (platformH / 4);
          if (cy > subgradeY - 6) return null;
          return (
            <circle key={i} cx={cx} cy={cy} r={2.5} fill="#9A7B55" opacity={0.5} />
          );
        })}
        <text
          x={svgW / 2}
          y={groundY + platformH / 2 + 4}
          textAnchor="middle"
          className="text-[10px]"
          fill="#fff"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight={600}
        >
          COMPACTED GRANULAR FILL
        </text>

        {/* Reinforcement line */}
        {useReinforcement && (
          <>
            <line
              x1={margin}
              y1={reinfY}
              x2={svgW - margin}
              y2={reinfY}
              stroke="#E8590C"
              strokeWidth={2.5}
              strokeDasharray="6,3"
            />
            <text
              x={svgW - margin - 4}
              y={reinfY - 4}
              textAnchor="end"
              fill="#E8590C"
              className="text-[8px]"
              fontFamily="Space Grotesk, sans-serif"
              fontWeight={600}
            >
              GEOSYNTHETIC
            </text>
          </>
        )}

        {/* Track */}
        <rect
          x={trackX}
          y={trackY}
          width={trackW}
          height={trackH}
          fill="#555"
          rx={2}
        />
        {/* Track grousers */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={trackX + 4 + i * 10}
            y={trackY + trackH - 3}
            width={6}
            height={3}
            fill="#444"
          />
        ))}

        {/* Load arrows */}
        {Array.from({ length: arrowCount }).map((_, i) => {
          const ax = trackX + 10 + i * arrowSpacing;
          return (
            <g key={i}>
              <line x1={ax} y1={trackY - 20} x2={ax} y2={trackY - 4} stroke="#C0392B" strokeWidth={1.5} />
              <polygon
                points={`${ax - 3},${trackY - 8} ${ax + 3},${trackY - 8} ${ax},${trackY - 2}`}
                fill="#C0392B"
              />
            </g>
          );
        })}
        <text
          x={trackX + trackW / 2}
          y={trackY - 22}
          textAnchor="middle"
          fill="#C0392B"
          className="text-[8px]"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight={600}
        >
          LOAD
        </text>

        {/* Dimension: thickness D */}
        <line x1={svgW - margin + 8} y1={groundY} x2={svgW - margin + 8} y2={subgradeY} stroke="#333" strokeWidth={1} />
        <line x1={svgW - margin + 4} y1={groundY} x2={svgW - margin + 12} y2={groundY} stroke="#333" strokeWidth={1} />
        <line x1={svgW - margin + 4} y1={subgradeY} x2={svgW - margin + 12} y2={subgradeY} stroke="#333" strokeWidth={1} />
        <text
          x={svgW - margin + 16}
          y={groundY + platformH / 2 + 4}
          fill="#333"
          className="text-[9px]"
          fontFamily="JetBrains Mono, monospace"
          fontWeight={600}
        >
          D={thickness}mm
        </text>

        {/* Dimension: track width W */}
        <line x1={trackX} y1={trackY - 30} x2={trackX + trackW} y2={trackY - 30} stroke="#555" strokeWidth={0.8} />
        <line x1={trackX} y1={trackY - 34} x2={trackX} y2={trackY - 26} stroke="#555" strokeWidth={0.8} />
        <line x1={trackX + trackW} y1={trackY - 34} x2={trackX + trackW} y2={trackY - 26} stroke="#555" strokeWidth={0.8} />
        <text
          x={trackX + trackW / 2}
          y={trackY - 33}
          textAnchor="middle"
          fill="#555"
          className="text-[8px]"
          fontFamily="JetBrains Mono, monospace"
          fontWeight={500}
        >
          W={trackWidth}m
        </text>

        {/* Load spread lines */}
        <line
          x1={trackX}
          y1={groundY}
          x2={trackX - platformH * 0.6}
          y2={subgradeY}
          stroke="#fff"
          strokeWidth={1}
          strokeDasharray="4,3"
          opacity={0.6}
        />
        <line
          x1={trackX + trackW}
          y1={groundY}
          x2={trackX + trackW + platformH * 0.6}
          y2={subgradeY}
          stroke="#fff"
          strokeWidth={1}
          strokeDasharray="4,3"
          opacity={0.6}
        />
      </svg>
    </div>
  );
}
