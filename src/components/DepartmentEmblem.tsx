import { motion } from 'framer-motion';
import { Shield, Radio, Activity, Truck, Heart, Construction, Building2 } from 'lucide-react';

const emblemConfig: Record<string, {
  icon: React.ElementType;
  name: string;
  motto: string;
  ringColor: string;
  glowColor: string;
  bgGradient: string;
}> = {
  command: {
    icon: Shield,
    name: 'LPISTH',
    motto: 'Provincial Command',
    ringColor: 'stroke-primary',
    glowColor: 'drop-shadow-[0_0_8px_hsl(145,65%,38%,0.5)]',
    bgGradient: 'from-primary/10 to-primary/5',
  },
  premier: {
    icon: Building2,
    name: 'PREMIER',
    motto: 'Office of the Premier',
    ringColor: 'stroke-accent',
    glowColor: 'drop-shadow-[0_0_8px_hsl(43,96%,52%,0.5)]',
    bgGradient: 'from-accent/10 to-accent/5',
  },
  saps: {
    icon: Radio,
    name: 'SAPS',
    motto: 'To Protect & Serve',
    ringColor: 'stroke-info',
    glowColor: 'drop-shadow-[0_0_8px_hsl(210,80%,42%,0.5)]',
    bgGradient: 'from-info/10 to-info/5',
  },
  ems: {
    icon: Activity,
    name: 'EMS',
    motto: 'Saving Lives',
    ringColor: 'stroke-destructive',
    glowColor: 'drop-shadow-[0_0_8px_hsl(0,85%,50%,0.5)]',
    bgGradient: 'from-destructive/10 to-destructive/5',
  },
  transport: {
    icon: Truck,
    name: 'TRANSPORT',
    motto: 'Safe Roads for All',
    ringColor: 'stroke-accent',
    glowColor: 'drop-shadow-[0_0_8px_hsl(43,96%,52%,0.5)]',
    bgGradient: 'from-accent/10 to-accent/5',
  },
  health: {
    icon: Heart,
    name: 'HEALTH',
    motto: 'A Healthy Life for All',
    ringColor: 'stroke-success',
    glowColor: 'drop-shadow-[0_0_8px_hsl(145,65%,38%,0.5)]',
    bgGradient: 'from-success/10 to-success/5',
  },
  roads: {
    icon: Construction,
    name: 'RAL',
    motto: 'Building Better Roads',
    ringColor: 'stroke-warning',
    glowColor: 'drop-shadow-[0_0_8px_hsl(30,70%,45%,0.5)]',
    bgGradient: 'from-warning/10 to-warning/5',
  },
};

interface Props {
  department: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function DepartmentEmblem({ department, size = 'md', showLabel = true }: Props) {
  const config = emblemConfig[department] || emblemConfig.command;
  const Icon = config.icon;

  const sizes = {
    sm: { outer: 40, inner: 16, ring: 18, text: 'text-[8px]' },
    md: { outer: 56, inner: 22, ring: 26, text: 'text-[9px]' },
    lg: { outer: 72, inner: 28, ring: 34, text: 'text-[10px]' },
  };
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className={`relative flex items-center justify-center ${config.glowColor}`}
        style={{ width: s.outer, height: s.outer }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer rotating ring */}
        <svg width={s.outer} height={s.outer} className="absolute inset-0">
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={s.outer / 2 - 2}
            fill="none"
            className={config.ringColor}
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.5"
          />
        </svg>

        {/* Inner pulsing icon */}
        <motion.div
          className={`absolute flex items-center justify-center rounded-full bg-gradient-to-br ${config.bgGradient} border border-border`}
          style={{ width: s.ring, height: s.ring }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon style={{ width: s.inner / 1.5, height: s.inner / 1.5 }} className="text-foreground" />
          </motion.div>
        </motion.div>
      </motion.div>

      {showLabel && (
        <div className="text-center">
          <p className={`font-display font-bold text-foreground tracking-widest ${s.text}`}>{config.name}</p>
          <p className="text-[7px] text-muted-foreground tracking-wider">{config.motto}</p>
        </div>
      )}
    </div>
  );
}

export function DepartmentEmblemStrip() {
  const depts = ['saps', 'ems', 'transport', 'health', 'roads'];
  return (
    <motion.div
      className="flex items-center justify-center gap-6 py-3 px-4 rounded-lg bg-secondary/30 border border-border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-[9px] font-display text-muted-foreground uppercase tracking-widest mr-2">Departments</p>
      {depts.map((dept, i) => (
        <motion.div
          key={dept}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 300 }}
        >
          <DepartmentEmblem department={dept} size="sm" showLabel={false} />
        </motion.div>
      ))}
    </motion.div>
  );
}
