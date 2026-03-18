import { Camera, MapPin } from 'lucide-react';
import type { Worker } from '@/data/mockData';

const statusColors: Record<string, string> = {
  online: 'status-dot-online',
  standby: 'status-dot-standby',
  offline: 'status-dot-offline',
  responding: 'status-dot-online pulse-live',
};

export default function WorkerRow({ worker }: { worker: Worker }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <span className={`status-dot ${statusColors[worker.status]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{worker.name}</p>
          {worker.bodycamActive && <Camera className="w-3 h-3 text-destructive pulse-live" />}
        </div>
        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {worker.location}
          {worker.distance && <span className="text-info"> → {worker.distance}</span>}
          {worker.eta && <span className="text-accent"> → ETA {worker.eta}</span>}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-display text-foreground">{worker.points} pts</p>
        <p className="text-[10px] text-muted-foreground">Standby {worker.standbyCompliance}%</p>
      </div>
    </div>
  );
}
