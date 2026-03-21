import { useState } from 'react';
import { mockWorkers, mockAlerts, heatmapZones } from '@/data/mockData';
import { MapPin, Navigation, AlertTriangle, Radio, Users } from 'lucide-react';

type MapLayer = 'workers' | 'alerts' | 'heatmap';

export default function InteractiveMap() {
  const [activeLayers, setActiveLayers] = useState<MapLayer[]>(['workers', 'alerts', 'heatmap']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleLayer = (layer: MapLayer) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  // Map bounds for Lesotho (simplified projection)
  const mapBounds = { minLat: -30.7, maxLat: -28.5, minLng: 27.0, maxLng: 29.5 };

  const toMapPos = (lat: number, lng: number) => ({
    x: ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100,
    y: ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100,
  });

  const statusColor: Record<string, string> = {
    online: 'text-success', standby: 'text-accent', responding: 'text-info', offline: 'text-muted-foreground',
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Live Tracking Map — Kingdom of Lesotho
        </h3>
        <div className="flex gap-1">
          {([
            { key: 'workers' as MapLayer, icon: Users, label: 'Workers' },
            { key: 'alerts' as MapLayer, icon: AlertTriangle, label: 'Alerts' },
            { key: 'heatmap' as MapLayer, icon: Radio, label: 'Heatmap' },
          ]).map(layer => (
            <button
              key={layer.key}
              onClick={() => toggleLayer(layer.key)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-display transition-colors ${
                activeLayers.includes(layer.key)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <layer.icon className="w-3 h-3" />
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="relative bg-secondary/30 rounded-lg overflow-hidden border border-border" style={{ height: 320 }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {[20, 40, 60, 80].map(p => (
            <g key={p}>
              <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="hsl(160, 12%, 14%)" strokeWidth="0.5" />
              <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="hsl(160, 12%, 14%)" strokeWidth="0.5" />
            </g>
          ))}
          {/* Province outline (simplified) */}
          <polygon
            points="15,10 45,5 75,15 90,35 85,60 70,80 50,90 25,85 10,65 5,40"
            fill="hsl(145, 65%, 38%, 0.05)"
            stroke="hsl(145, 65%, 38%, 0.2)"
            strokeWidth="1"
          />
          {/* Major routes */}
          <polyline points="55%,15% 48%,40% 42%,60% 38%,85%" stroke="hsl(43, 96%, 52%, 0.15)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <polyline points="42%,60% 55%,65% 68%,58%" stroke="hsl(43, 96%, 52%, 0.15)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <text x="38%" y="62%" fill="hsl(43, 96%, 52%, 0.3)" fontSize="8" fontFamily="JetBrains Mono">A1</text>
          <text x="56%" y="63%" fill="hsl(43, 96%, 52%, 0.3)" fontSize="8" fontFamily="JetBrains Mono">A2</text>
        </svg>

        {/* Heatmap zones */}
        {activeLayers.includes('heatmap') && heatmapZones.map(zone => {
          const pos = toMapPos(zone.lat, zone.lng);
          const size = Math.max(zone.risk / 3, 15);
          return (
            <div
              key={zone.name}
              className="absolute rounded-full opacity-40 animate-pulse"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: size,
                height: size,
                transform: 'translate(-50%, -50%)',
                background: zone.risk > 75
                  ? 'radial-gradient(circle, hsl(0, 72%, 50%, 0.6), transparent)'
                  : zone.risk > 50
                  ? 'radial-gradient(circle, hsl(43, 96%, 52%, 0.5), transparent)'
                  : 'radial-gradient(circle, hsl(145, 65%, 38%, 0.4), transparent)',
              }}
            />
          );
        })}

        {/* Alert markers */}
        {activeLayers.includes('alerts') && mockAlerts.filter(a => a.status !== 'resolved').map(alert => {
          const pos = toMapPos(alert.coordinates.lat, alert.coordinates.lng);
          return (
            <button
              key={alert.id}
              onClick={() => setSelectedItem(selectedItem === alert.id ? null : alert.id)}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <AlertTriangle className={`w-4 h-4 ${alert.severity === 'critical' ? 'text-destructive pulse-live' : 'text-accent'}`} />
              {selectedItem === alert.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-card border border-border rounded p-2 w-40 text-left z-20">
                  <p className="font-display text-[10px] font-bold text-foreground">{alert.id}</p>
                  <p className="text-[9px] text-muted-foreground">{alert.location}</p>
                  <p className="text-[9px] text-muted-foreground">ETA: {alert.eta}</p>
                  <p className="text-[9px] text-muted-foreground">Status: <span className="text-accent">{alert.status}</span></p>
                </div>
              )}
            </button>
          );
        })}

        {/* Worker markers */}
        {activeLayers.includes('workers') && mockWorkers.filter(w => w.status !== 'offline').map((worker, i) => {
          // Distribute workers across the map
          const workerPositions = [
            { lat: -29.31, lng: 27.48 }, { lat: -29.15, lng: 27.78 }, { lat: -29.35, lng: 27.52 },
            { lat: -28.88, lng: 28.05 }, { lat: -29.82, lng: 27.23 }, { lat: -29.32, lng: 27.50 },
            { lat: -30.15, lng: 27.47 }, { lat: -28.77, lng: 28.25 }, { lat: -29.52, lng: 28.60 },
            { lat: -29.40, lng: 27.65 },
          ];
          const coords = workerPositions[i % workerPositions.length];
          const pos = toMapPos(coords.lat, coords.lng);
          return (
            <button
              key={worker.id}
              onClick={() => setSelectedItem(selectedItem === worker.id ? null : worker.id)}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-card ${
                worker.status === 'responding' ? 'bg-info pulse-live' :
                worker.status === 'standby' ? 'bg-accent' : 'bg-success'
              }`} />
              {selectedItem === worker.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-card border border-border rounded p-2 w-44 text-left z-20">
                  <p className="font-display text-[10px] font-bold text-foreground">{worker.name}</p>
                  <p className="text-[9px] text-muted-foreground">{worker.role} • {worker.department.toUpperCase()}</p>
                  <p className="text-[9px] text-muted-foreground">{worker.location}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[9px] ${statusColor[worker.status]}`}>{worker.status.toUpperCase()}</span>
                    <span className="text-[9px] text-foreground">{worker.points} pts</span>
                  </div>
                  {worker.distance && <p className="text-[9px] text-info mt-0.5">→ {worker.distance} • ETA {worker.eta}</p>}
                </div>
              )}
            </button>
          );
        })}

        {/* Map labels */}
        <div className="absolute top-2 left-2 text-[9px] font-display text-muted-foreground">KINGDOM OF LESOTHO</div>
        <div className="absolute bottom-2 right-2 flex items-center gap-3 text-[8px] font-display text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" /> Online</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent inline-block" /> Standby</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-info inline-block" /> Responding</span>
          <span className="flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5 text-destructive" /> Alert</span>
        </div>
      </div>
    </div>
  );
}
