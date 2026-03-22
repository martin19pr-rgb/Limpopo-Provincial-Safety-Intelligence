import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, ChevronDown, BarChart3, Brain } from 'lucide-react';

interface AnalysisReading {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical' | 'neutral';
  detail: string;
  trend?: 'up' | 'down' | 'stable';
  source?: string;
}

const analysisData: AnalysisReading[] = [
  { label: 'Response Efficiency', value: '92%', status: 'good', detail: '20% improvement YoY. AI routing reduced avg ETA by 1.4min. Rural satellite coverage extended to 98.2%.', trend: 'up', source: 'AI Dispatch Engine' },
  { label: 'Incident Hotspot Score', value: '78/100', status: 'warning', detail: 'A1 corridor remains highest risk. LiDAR sensors confirmed 34 incidents. Citizen reports correlate at 89%.', trend: 'up', source: 'Predictive Heatmap AI' },
  { label: 'PoW Compliance Index', value: '87%', status: 'warning', detail: '5 workers flagged below threshold (<200 pts). Auto-dispatch skips low-scorers. 45% scored Excellent (1000+).', trend: 'up', source: 'PoW Engine' },
  { label: 'False Alert Suppression', value: '98.9%', status: 'good', detail: 'AI tuning reduced false positives by 15%. Acoustic + LiDAR dual-confirm now standard. Only 1.1% false rate.', trend: 'down', source: 'Sensor Fusion AI' },
  { label: 'Fatality Reduction', value: '-34% YoY', status: 'good', detail: 'Zero Deaths 2030 on track at 25%. Rural satellite deployment cut response gaps. 1,234 lives saved in 2024.', trend: 'down', source: 'Provincial Stats' },
  { label: 'Road Hazard Index', value: '62/100', status: 'warning', detail: '23 active road hazards. A2 mountain bridge flood risk critical. 50 citizen reports pending for rural highland paths.', trend: 'up', source: 'RAL Sensors' },
];

const statusConfig = {
  good: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', glow: 'shadow-[0_0_12px_hsl(145,65%,38%,0.15)]' },
  warning: { icon: AlertTriangle, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', glow: 'shadow-[0_0_12px_hsl(43,96%,52%,0.15)]' },
  critical: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20', glow: 'shadow-[0_0_12px_hsl(0,72%,50%,0.15)]' },
  neutral: { icon: Info, color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', glow: 'shadow-[0_0_12px_hsl(210,80%,42%,0.15)]' },
};

function AnalysisCard({ reading, index }: { reading: AnalysisReading; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[reading.status];
  const StatusIcon = cfg.icon;
  const TrendIcon = reading.trend === 'up' ? TrendingUp : reading.trend === 'down' ? TrendingDown : BarChart3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
      className={`border ${cfg.border} ${cfg.bg} rounded-lg overflow-hidden ${cfg.glow} transition-shadow`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        >
          <StatusIcon className={`w-4 h-4 ${cfg.color} shrink-0`} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground font-display uppercase tracking-widest">{reading.label}</p>
          <p className={`font-display text-lg font-bold text-foreground`}>{reading.value}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TrendIcon className={`w-3 h-3 ${reading.trend === 'up' ? 'text-success' : reading.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`} />
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0">
              <div className="border-t border-border/50 pt-2">
                <p className="text-[11px] text-foreground/80 leading-relaxed">{reading.detail}</p>
                {reading.source && (
                  <p className="text-[9px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Brain className="w-2.5 h-2.5" /> Source: {reading.source}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AnalysisPanel() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Brain className="w-4 h-4 text-primary" />
        </motion.div>
        <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest">
          AI Analysis Readings — Live
        </h2>
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-success ml-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {analysisData.map((reading, i) => (
          <AnalysisCard key={reading.label} reading={reading} index={i} />
        ))}
      </div>
    </div>
  );
}
