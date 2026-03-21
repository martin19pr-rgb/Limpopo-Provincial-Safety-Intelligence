import { Shield, Radio, Activity, Truck, Heart, Construction, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DepartmentEmblem from './DepartmentEmblem';

const deptConfig: Record<string, { 
  icon: React.ElementType; 
  name: string; 
  subtitle: string;
  accentClass: string;
  bgClass: string;
}> = {
  command: {
    icon: Shield,
    name: 'LSISTH',
    subtitle: 'National Command Center',
    accentClass: 'text-primary',
    bgClass: 'bg-primary/10 border-primary/20',
  },
  premier: {
    icon: Building2,
    name: "OFFICE OF THE PRIME MINISTER",
    subtitle: 'Lesotho National Government',
    accentClass: 'text-accent',
    bgClass: 'bg-accent/10 border-accent/20',
  },
  saps: {
    icon: Radio,
    name: 'LESOTHO MOUNTED POLICE SERVICE',
    subtitle: 'LMPS • To Protect and Serve',
    accentClass: 'text-info',
    bgClass: 'bg-info/10 border-info/20',
  },
  lmps: {
    icon: Radio,
    name: 'LESOTHO MOUNTED POLICE SERVICE',
    subtitle: 'LMPS • To Protect and Serve',
    accentClass: 'text-info',
    bgClass: 'bg-info/10 border-info/20',
  },
  ems: {
    icon: Activity,
    name: 'EMERGENCY MEDICAL SERVICES',
    subtitle: 'Lesotho EMS • Saving Lives',
    accentClass: 'text-emergency',
    bgClass: 'bg-emergency/10 border-emergency/20',
  },
  transport: {
    icon: Truck,
    name: 'MINISTRY OF TRANSPORT',
    subtitle: 'Lesotho • Safe Roads for All',
    accentClass: 'text-accent',
    bgClass: 'bg-accent/10 border-accent/20',
  },
  health: {
    icon: Heart,
    name: 'MINISTRY OF HEALTH',
    subtitle: 'Lesotho • A Long & Healthy Life for All',
    accentClass: 'text-success',
    bgClass: 'bg-success/10 border-success/20',
  },
  roads: {
    icon: Construction,
    name: 'ROADS DIRECTORATE LESOTHO',
    subtitle: 'RDL • Building Better Roads',
    accentClass: 'text-warning',
    bgClass: 'bg-warning/10 border-warning/20',
  },
};

export default function DepartmentBadge({ department }: { department: string }) {
  const config = deptConfig[department] || deptConfig.command;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg border ${config.bgClass} relative overflow-hidden`}
    >
      {/* Animated background shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.02] to-transparent"
        animate={{ x: [-200, 400] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ width: '200px' }}
      />

      <DepartmentEmblem department={department} size="md" showLabel={false} />
      <div className="relative z-10">
        <p className={`font-display text-[10px] font-bold ${config.accentClass} tracking-widest`}>{config.name}</p>
        <p className="text-[9px] text-muted-foreground">{config.subtitle}</p>
        <p className="text-[8px] text-muted-foreground mt-0.5">Kingdom of Lesotho 🇱🇸</p>
      </div>
    </motion.div>
  );
}
