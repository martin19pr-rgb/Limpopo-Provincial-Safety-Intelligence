import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { KPI } from '@/data/mockData';

export default function KPICard({ kpi }: { kpi: KPI }) {
  const trendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor = kpi.label.includes('False') || kpi.label.includes('Response')
    ? (kpi.trend === 'down' ? 'text-success' : 'text-destructive')
    : (kpi.trend === 'up' ? 'text-success' : kpi.trend === 'down' ? 'text-destructive' : 'text-muted-foreground');

  // Determine a progress percentage for the mini bar
  const numVal = parseFloat(kpi.value.replace(/,/g, ''));
  const numTarget = parseFloat(kpi.target.replace(/[<>]/g, ''));
  const progress = !isNaN(numVal) && !isNaN(numTarget) && numTarget > 0
    ? Math.min((numVal / numTarget) * 100, 100)
    : 50;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      className="dashboard-card cursor-default relative overflow-hidden group"
    >
      {/* Subtle animated scanline */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none"
        animate={{ y: [-40, 80] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ height: '40px' }}
      />

      <div className="relative z-10">
        <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-display">{kpi.label}</p>
        <div className="flex items-end justify-between mb-2">
          <motion.p
            className="kpi-value text-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {kpi.value}
            <span className="text-sm text-muted-foreground ml-1">{kpi.unit}</span>
          </motion.p>
          <motion.div
            className={`flex items-center gap-1 text-xs ${trendColor}`}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendIcon className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-1.5">
          <motion.div
            className="h-full bg-primary/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[9px] text-muted-foreground">
          Target: <span className="text-foreground font-display">{kpi.target}</span>
        </p>
      </div>
    </motion.div>
  );
}
