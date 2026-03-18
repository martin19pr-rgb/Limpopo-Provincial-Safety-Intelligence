import { heatmapZones } from '@/data/mockData';

export default function HeatmapGrid() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {heatmapZones.map(zone => {
        const riskColor = zone.risk >= 80 ? 'bg-destructive/20 border-destructive/40' :
          zone.risk >= 60 ? 'bg-accent/20 border-accent/40' :
          zone.risk >= 40 ? 'bg-info/20 border-info/30' :
          'bg-success/10 border-success/20';
        return (
          <div key={zone.name} className={`p-3 rounded-md border ${riskColor}`}>
            <p className="text-xs font-medium text-foreground">{zone.name}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="font-display text-lg font-bold text-foreground">{zone.risk}%</span>
              <span className="text-[10px] text-muted-foreground">{zone.incidents} incidents</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${zone.risk >= 80 ? 'bg-destructive' : zone.risk >= 60 ? 'bg-accent' : zone.risk >= 40 ? 'bg-info' : 'bg-success'}`}
                style={{ width: `${zone.risk}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
