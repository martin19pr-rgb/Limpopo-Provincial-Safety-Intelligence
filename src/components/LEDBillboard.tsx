import { useState } from 'react';
import { Radio, AlertTriangle, Info, Zap, Eye, EyeOff, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BillboardSign {
  id: string;
  location: string;
  status: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  road?: string;
  kmMarker?: string;
  direction?: string;
  visibility?: 'high' | 'medium' | 'low';
  lastUpdated?: string;
  viewsPerHour?: number;
}

const typeIcons = {
  critical: AlertTriangle,
  warning: Zap,
  info: Info,
};

const typeBorderColors: Record<string, string> = {
  critical: 'border-destructive/40',
  warning: 'border-accent/40',
  info: 'border-info/30',
};

const typeTextColors: Record<string, string> = {
  critical: 'text-destructive',
  warning: 'text-accent',
  info: 'text-info',
};

const visibilityIcons: Record<string, { icon: typeof Eye; label: string; color: string }> = {
  high: { icon: Eye, label: 'HIGH VISIBILITY', color: 'text-success' },
  medium: { icon: Eye, label: 'MEDIUM', color: 'text-accent' },
  low: { icon: EyeOff, label: 'LOW — FOG/RAIN', color: 'text-destructive' },
};

export default function LEDBillboard({ sign }: { sign: BillboardSign }) {
  const [scrolling, setScrolling] = useState(true);
  const Icon = typeIcons[sign.type];
  const vis = visibilityIcons[sign.visibility || 'high'];
  const VisIcon = vis.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-card border ${typeBorderColors[sign.type]} rounded-lg p-4 overflow-hidden`}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none scanline opacity-20" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${sign.status === 'active' ? 'bg-success pulse-live' : 'bg-muted-foreground'}`} />
            <span className="font-display text-xs font-bold text-foreground">{sign.id}</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-display uppercase ${
            sign.status === 'active' ? 'bg-success/20 text-success' : 'bg-secondary text-muted-foreground'
          }`}>
            {sign.status}
          </span>
        </div>

        {/* Location details */}
        <div className="flex items-center gap-3 mb-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {sign.location}
          </span>
          {sign.road && (
            <span className="font-display text-foreground bg-secondary px-1.5 py-0.5 rounded">
              {sign.road} {sign.kmMarker && `KM ${sign.kmMarker}`}
            </span>
          )}
          {sign.direction && (
            <span className="text-muted-foreground">{sign.direction}</span>
          )}
        </div>

        {/* LED Message Display */}
        <div className="bg-background/80 border border-border rounded-md p-3 mb-3 overflow-hidden">
          <div className={`flex items-center gap-3 ${scrolling ? 'animate-led-scroll' : ''}`}>
            <Icon className={`w-5 h-5 shrink-0 ${typeTextColors[sign.type]}`} />
            <p className={`font-display text-sm font-bold tracking-widest uppercase whitespace-nowrap ${typeTextColors[sign.type]}`}>
              {sign.message}
            </p>
          </div>
        </div>

        {/* Visibility & Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 text-[10px] font-display ${vis.color}`}>
              <VisIcon className="w-3 h-3" /> {vis.label}
            </span>
            {sign.viewsPerHour && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Eye className="w-3 h-3" /> ~{sign.viewsPerHour.toLocaleString()}/hr
              </span>
            )}
          </div>
          {sign.lastUpdated && (
            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {sign.lastUpdated}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setScrolling(!scrolling);
              toast.info(scrolling ? 'Scroll paused' : 'Scroll resumed');
            }}
            className="flex-1 py-1.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-display tracking-wider hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
          >
            {scrolling ? 'PAUSE' : 'SCROLL'}
          </button>
          <button
            onClick={() => toast.success(`LED Billboard ${sign.id} updated`, { description: sign.message })}
            className="flex-1 py-1.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-display tracking-wider hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
          >
            <Radio className="w-3 h-3" /> PUSH TO SIGN
          </button>
        </div>
      </div>
    </motion.div>
  );
}
