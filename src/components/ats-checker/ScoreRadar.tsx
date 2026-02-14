import { motion } from 'framer-motion';
import { ScoreBreakdown } from '@/lib/atsScorer';

interface ScoreRadarProps {
    breakdown: ScoreBreakdown;
}

/**
 * Pure SVG radar chart — no dependencies.
 * 5 axes for the scoring dimensions, animated polygon fill.
 */
export default function ScoreRadar({ breakdown }: ScoreRadarProps) {
    const dimensions = [
        { key: 'keywordMatch', label: 'Keywords', shortLabel: 'KW' },
        { key: 'formatting', label: 'Formatting', shortLabel: 'FMT' },
        { key: 'sectionCompleteness', label: 'Sections', shortLabel: 'SEC' },
        { key: 'actionVerbs', label: 'Verbs', shortLabel: 'VRB' },
        { key: 'quantifiedAchievements', label: 'Metrics', shortLabel: 'MTR' },
    ] as const;

    const cx = 150; // center x
    const cy = 150; // center y
    const maxR = 100; // max radius
    const rings = [25, 50, 75, 100]; // concentric rings
    const n = dimensions.length;
    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2; // start from top

    // Compute vertex positions for a given radius
    const getPoint = (index: number, radius: number) => {
        const angle = startAngle + index * angleStep;
        return {
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
        };
    };

    // Data polygon points
    const dataPoints = dimensions.map((dim, i) => {
        const score = breakdown[dim.key].score;
        const r = (score / 100) * maxR;
        return getPoint(i, r);
    });
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    // Ring polygons
    const ringPaths = rings.map(pct => {
        const r = (pct / 100) * maxR;
        const points = Array.from({ length: n }, (_, i) => getPoint(i, r));
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    });

    // Axis lines
    const axisLines = Array.from({ length: n }, (_, i) => {
        const outer = getPoint(i, maxR);
        return { x1: cx, y1: cy, x2: outer.x, y2: outer.y };
    });

    // Label positions (slightly outside the chart)
    const labelPoints = dimensions.map((_, i) => getPoint(i, maxR + 20));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="card-elevated rounded-xl p-6"
        >
            <h4 className="text-sm font-medium text-[#A0A0AB] uppercase tracking-wide mb-4 text-center">
                Dimension Radar
            </h4>

            <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
                {/* Concentric rings */}
                {ringPaths.map((path, i) => (
                    <path
                        key={i}
                        d={path}
                        fill="none"
                        stroke="rgba(160,160,171,0.1)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis lines */}
                {axisLines.map((line, i) => (
                    <line
                        key={i}
                        x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                        stroke="rgba(160,160,171,0.15)"
                        strokeWidth="1"
                    />
                ))}

                {/* Data polygon fill */}
                <motion.path
                    d={dataPath}
                    fill="rgba(0,229,255,0.15)"
                    stroke="#00E5FF"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                />

                {/* Data points */}
                {dataPoints.map((p, i) => (
                    <motion.circle
                        key={i}
                        cx={p.x} cy={p.y} r="4"
                        fill="#00E5FF"
                        stroke="#0A0A0F"
                        strokeWidth="2"
                        initial={{ r: 0 }}
                        animate={{ r: 4 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                    />
                ))}

                {/* Labels */}
                {dimensions.map((dim, i) => {
                    const lp = labelPoints[i];
                    const score = Math.round(breakdown[dim.key].score);
                    const color = score >= 70 ? '#00FF88' : score >= 40 ? '#FFB800' : '#FF3366';
                    return (
                        <g key={dim.key}>
                            <text
                                x={lp.x} y={lp.y - 6}
                                textAnchor="middle"
                                className="text-[10px] font-medium"
                                fill="#A0A0AB"
                            >
                                {dim.shortLabel}
                            </text>
                            <text
                                x={lp.x} y={lp.y + 8}
                                textAnchor="middle"
                                className="text-[11px] font-bold"
                                fill={color}
                            >
                                {score}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </motion.div>
    );
}
