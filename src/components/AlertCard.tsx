import { MapPin, Clock, Radio, Satellite, CheckCircle } from 'lucide-react';
import type { Alert } from '@/data/mockData';

const severityStyles: Record<string, string> = {
  critical: 'border-destructive/50',
  high: 'border-accent/40',
  medium: 'border-info/30',
  low: 'border-border',
};

const typeLabels: Record<string, string> = {
  crash: '🚗 CRASH', robbery: '🔫 ROBBERY', medical: '🏥 MEDICAL',
  fire: '🔥 FIRE', flood: '🌊 FLOOD', pothole: '🕳️ POTHOLE',
};

export default function AlertCard({ alert, onDispatch }: { alert: Alert; onDispatch?: (id: string) => void }) {
  return (
    <div className={`dashboard-card border ${severityStyles[alert.severity]} space-y-2`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-bold text-foreground">
          {typeLabels[alert.type]} — {alert.id}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-display uppercase tracking-wider ${
          alert.status === 'active' ? 'bg-destructive/20 text-destructive' :
          alert.status === 'dispatched' ? 'bg-accent/20 text-accent' :
          'bg-success/20 text-success'
        }`}>
          {alert.status}
        </span>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {alert.location}</p>
        <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> ETA: <span className="text-foreground font-display">{alert.eta}</span></p>
        {alert.responders.length > 0 && (
          <p className="flex items-center gap-1.5"><Radio className="w-3 h-3" /> {alert.responders.join(', ')}</p>
        )}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Satellite className="w-3 h-3" />
            {alert.satelliteStatus === 'active' ? <span className="text-success">Iridium ✓</span> : <span className="text-accent">Fallback</span>}
          </span>
          {alert.sensorConfirmed && (
            <span className="flex items-center gap-1 text-success"><CheckCircle className="w-3 h-3" /> Sensor Confirmed</span>
          )}
        </div>
      </div>
      {alert.status === 'active' && onDispatch && (
        <button
          onClick={() => onDispatch(alert.id)}
          className="w-full mt-2 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-display font-bold tracking-wider hover:bg-primary/90 transition-colors"
        >
          DISPATCH TOP 3 READY
        </button>
      )}
    </div>
  );
}
