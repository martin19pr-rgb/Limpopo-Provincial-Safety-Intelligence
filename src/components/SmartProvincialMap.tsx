import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { mockAlerts, mockWorkers, heatmapZones } from '@/data/mockData';
import {
  Layers, X, Satellite, ZoomIn, ZoomOut, Maximize2, Shield,
  AlertTriangle, Construction, Users, Activity, Navigation, Ambulance, Crosshair, Map
} from 'lucide-react';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type MapLayer = 'workers' | 'alerts' | 'heatmap' | 'construction' | 'police' | 'routes';
type BaseMap = 'dark' | 'aerial' | 'topo';

// Limpopo Province — South Africa
const constructionZones = [
  { id: 'CZ-1', name: 'N1 Mokopane Resurfacing', lat: -24.19, lng: 28.99, status: 'active', eta: '3 days' },
  { id: 'CZ-2', name: 'N1 KM 28 Pothole Repairs', lat: -23.78, lng: 29.42, status: 'active', eta: '5 days' },
  { id: 'CZ-3', name: 'R71 Tzaneen Bridge Repair', lat: -23.84, lng: 30.16, status: 'scheduled', eta: '7 days' },
];

const policePostings = [
  { id: 'PP-1', name: 'SAPS Unit 247', lat: -23.91, lng: 29.47, status: 'on duty', score: 1240 },
  { id: 'PP-2', name: 'SAPS Flying Squad 12', lat: -23.78, lng: 29.47, status: 'on duty', score: 1580 },
  { id: 'PP-3', name: 'Traffic Unit 19', lat: -24.19, lng: 28.99, status: 'standby', score: 890 },
  { id: 'PP-4', name: 'K9 Unit Polokwane', lat: -23.91, lng: 29.47, status: 'on duty', score: 720 },
];

const aidInProgress = [
  { id: 'AID-1', name: 'Ambulance Unit 247', lat: -23.78, lng: 29.47, destination: 'N1 Highway Crash', eta: '3m 42s' },
  { id: 'AID-2', name: 'Fire Unit 7', lat: -24.19, lng: 28.99, destination: 'N1 Mokopane Incident', eta: '6m' },
  { id: 'AID-3', name: 'Ambulance Unit 112', lat: -23.84, lng: 30.16, destination: 'Tzaneen Area', eta: '5m 30s' },
];

const workerPositions = [
  { lat: -23.91, lng: 29.47 }, { lat: -23.78, lng: 29.47 }, { lat: -23.91, lng: 29.47 },
  { lat: -24.19, lng: 28.99 }, { lat: -23.68, lng: 27.71 }, { lat: -23.91, lng: 29.47 },
  { lat: -23.30, lng: 30.72 }, { lat: -22.35, lng: 29.99 }, { lat: -22.95, lng: 30.48 },
  { lat: -23.84, lng: 30.16 },
];

function createIcon(color: string, size: number = 12) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${color}80;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createPulsingIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="position:relative;"><div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 12px ${color};"></div><div style="position:absolute;top:-3px;left:-3px;width:20px;height:20px;border-radius:50%;border:2px solid ${color};animation:pulse-ring 1.5s infinite;opacity:0.6;"></div></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function createLabelIcon(emoji: string, label: string, color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="display:flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(0,0,0,0.85);border:1px solid ${color}40;border-radius:6px;white-space:nowrap;"><span style="font-size:12px;">${emoji}</span><span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:${color};font-weight:600;">${label}</span></div>`,
    iconSize: [120, 24],
    iconAnchor: [60, 12],
  });
}

const baseLayers: Record<BaseMap, { url: string; attribution: string; label: string }> = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB © OpenStreetMap',
    label: 'Dark',
  },
  aerial: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri © Maxar © GeoEye',
    label: 'Aerial',
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap © OpenStreetMap',
    label: 'Topo',
  },
};

export default function SmartProvincialMap({ filterDept }: { filterDept?: string } = {}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Record<string, L.LayerGroup>>({});
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const [activeLayers, setActiveLayers] = useState<MapLayer[]>(['workers', 'alerts', 'heatmap', 'construction', 'police', 'routes']);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [baseMap, setBaseMap] = useState<BaseMap>('dark');

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Limpopo Province, South Africa
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([-23.9, 29.5], 8);

    const bl = baseLayers[baseMap];
    const tileLayer = L.tileLayer(bl.url, {
      attribution: bl.attribution,
      maxZoom: 19,
    }).addTo(map);

    baseLayerRef.current = tileLayer;
    mapRef.current = map;

    // Create layer groups
    const groups: Record<string, L.LayerGroup> = {
      workers: L.layerGroup(),
      alerts: L.layerGroup(),
      heatmap: L.layerGroup(),
      construction: L.layerGroup(),
      police: L.layerGroup(),
      routes: L.layerGroup(),
    };

    // Routes — Limpopo major roads
    const routeStyle = { color: '#D4AF37', weight: 3, opacity: 0.5, dashArray: '8 4' };
    // N1 — main north-south highway through Limpopo
    L.polyline([[-24.88, 28.29], [-24.19, 28.99], [-23.91, 29.47], [-23.78, 29.47], [-22.34, 29.99]], { ...routeStyle, weight: 4, opacity: 0.7 }).bindTooltip('N1 — Main North-South Highway', { className: 'map-tooltip' }).addTo(groups.routes);
    // R71 — east to Tzaneen
    L.polyline([[-23.91, 29.47], [-23.84, 30.16], [-23.30, 30.72]], routeStyle).bindTooltip('R71 — Tzaneen Road', { className: 'map-tooltip' }).addTo(groups.routes);
    // N11 — to Mokopane
    L.polyline([[-23.91, 29.47], [-24.19, 28.99], [-24.65, 30.33]], routeStyle).bindTooltip('N11 — Mokopane / Burgersfort', { className: 'map-tooltip' }).addTo(groups.routes);
    // R81 — Giyani road
    L.polyline([[-23.91, 29.47], [-23.30, 30.72]], { ...routeStyle, opacity: 0.3 }).bindTooltip('R81 — Giyani Road', { className: 'map-tooltip' }).addTo(groups.routes);
    // To Lephalale (west)
    L.polyline([[-23.91, 29.47], [-23.68, 27.71]], { ...routeStyle, opacity: 0.3 }).bindTooltip('R33 — Lephalale Road', { className: 'map-tooltip' }).addTo(groups.routes);

    // Heatmap zones as circles
    heatmapZones.forEach(zone => {
      const color = zone.risk > 75 ? '#e74c3c' : zone.risk > 50 ? '#f39c12' : '#2ecc71';
      L.circle([zone.lat, zone.lng], {
        radius: zone.risk * 80,
        color: color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 1,
        opacity: 0.4,
      }).bindTooltip(`${zone.name} — Risk: ${zone.risk}%`, { className: 'map-tooltip' }).addTo(groups.heatmap);
    });

    // Construction zones
    constructionZones.forEach(zone => {
      L.marker([zone.lat, zone.lng], { icon: createLabelIcon('🚧', zone.name, '#f39c12') })
        .bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b>🚧 ${zone.name}</b><br>Status: ${zone.status}<br>ETA: ${zone.eta}<br><button style="margin-top:6px;padding:3px 8px;background:#f39c1220;border:1px solid #f39c1240;border-radius:4px;color:#f39c12;font-size:9px;cursor:pointer;">Send to LED Billboard</button></div>`)
        .addTo(groups.construction);
    });

    // Police postings
    policePostings.forEach(post => {
      L.marker([post.lat, post.lng], { icon: createIcon('#00BFFF', 14) })
        .bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b>🔵 ${post.name}</b><br>Status: <span style="color:#2ecc71;">${post.status}</span><br>PoW Score: <span style="color:#D4AF37;">${post.score} pts</span></div>`)
        .addTo(groups.police);
    });

    // Alerts
    mockAlerts.filter(a => a.status !== 'resolved').forEach(alert => {
      const isCritical = alert.severity === 'critical';
      L.marker([alert.coordinates.lat, alert.coordinates.lng], {
        icon: createPulsingIcon(isCritical ? '#e74c3c' : '#f39c12'),
      }).bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b>${isCritical ? '🔴' : '🟡'} ${alert.id}</b><br>${alert.location}<br>Severity: <span style="color:${isCritical ? '#e74c3c' : '#f39c12'};">${alert.severity}</span><br>ETA: <span style="color:#00BFFF;">${alert.eta}</span><br>Responders: ${alert.responders.length}<br>Sensor: ${alert.sensorConfirmed ? '✅ Confirmed' : '⏳ Pending'}<br><div style="display:flex;gap:4px;margin-top:6px;"><button style="flex:1;padding:3px 8px;background:#2ecc7120;border:1px solid #2ecc7140;border-radius:4px;color:#2ecc71;font-size:9px;cursor:pointer;">Dispatch</button><button style="flex:1;padding:3px 8px;background:#f39c1220;border:1px solid #f39c1240;border-radius:4px;color:#f39c12;font-size:9px;cursor:pointer;">LED Alert</button></div></div>`)
        .addTo(groups.alerts);
    });

    // Aid in progress
    aidInProgress.forEach(aid => {
      L.marker([aid.lat, aid.lng], { icon: createIcon('#2ecc71', 12) })
        .bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b>🚑 ${aid.name}</b><br>→ ${aid.destination}<br>ETA: <span style="color:#00BFFF;">${aid.eta}</span></div>`)
        .addTo(groups.workers);
    });

    // Workers
    mockWorkers.filter(w => w.status !== 'offline').forEach((worker, i) => {
      const coords = workerPositions[i % workerPositions.length];
      const color = worker.status === 'responding' ? '#00BFFF' : worker.status === 'standby' ? '#f39c12' : '#2ecc71';
      L.marker([coords.lat, coords.lng], { icon: createIcon(color, 10) })
        .bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b>${worker.name}</b><br>${worker.role} • ${worker.department.toUpperCase()}<br>Status: <span style="color:${color};">${worker.status}</span><br>PoW: <span style="color:#D4AF37;">${worker.points} pts</span>${worker.distance ? `<br>→ ${worker.distance} • ETA ${worker.eta}` : ''}</div>`)
        .addTo(groups.workers);
    });

    // Add all layers
    Object.entries(groups).forEach(([key, group]) => {
      group.addTo(map);
    });

    layersRef.current = groups;

    // Add pulse animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
      .map-tooltip { font-family: 'JetBrains Mono', monospace !important; font-size: 10px !important; background: rgba(0,0,0,0.9) !important; border: 1px solid #D4AF3740 !important; color: #D4AF37 !important; border-radius: 6px !important; padding: 4px 8px !important; }
      .leaflet-popup-content-wrapper { background: rgba(15,20,25,0.95) !important; border: 1px solid #333 !important; border-radius: 8px !important; color: #e8e6e3 !important; }
      .leaflet-popup-tip { background: rgba(15,20,25,0.95) !important; }
      .leaflet-popup-close-button { color: #888 !important; }
    `;
    document.head.appendChild(style);

    return () => {
      map.remove();
      mapRef.current = null;
      baseLayerRef.current = null;
      style.remove();
    };
  }, []);

  // Switch base tile layer when baseMap changes
  useEffect(() => {
    if (!mapRef.current || !baseLayerRef.current) return;
    mapRef.current.removeLayer(baseLayerRef.current);
    const bl = baseLayers[baseMap];
    const newLayer = L.tileLayer(bl.url, { attribution: bl.attribution, maxZoom: 19 });
    newLayer.addTo(mapRef.current);
    newLayer.bringToBack();
    baseLayerRef.current = newLayer;
  }, [baseMap]);

  // Toggle overlay layers
  useEffect(() => {
    if (!mapRef.current) return;
    Object.entries(layersRef.current).forEach(([key, group]) => {
      if (activeLayers.includes(key as MapLayer)) {
        if (!mapRef.current!.hasLayer(group)) mapRef.current!.addLayer(group);
      } else {
        if (mapRef.current!.hasLayer(group)) mapRef.current!.removeLayer(group);
      }
    });
  }, [activeLayers]);

  const toggleLayer = (layer: MapLayer) => {
    setActiveLayers(prev => prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]);
  };

  const layerConfig = [
    { key: 'workers' as MapLayer, icon: Users, label: 'Workers & Aid', color: 'text-primary' },
    { key: 'alerts' as MapLayer, icon: AlertTriangle, label: 'Alerts', color: 'text-destructive' },
    { key: 'heatmap' as MapLayer, icon: Activity, label: 'Risk Heatmap', color: 'text-accent' },
    { key: 'construction' as MapLayer, icon: Construction, label: 'Construction', color: 'text-accent' },
    { key: 'police' as MapLayer, icon: Shield, label: 'SAPS Posts', color: 'text-info' },
    { key: 'routes' as MapLayer, icon: Navigation, label: 'Major Routes', color: 'text-accent' },
  ];

  return (
    <div className="glass-card p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary pulse-live" />
          <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">
            Provincial Intelligence Map
          </h3>
          <span className="text-[9px] text-muted-foreground font-display">— LIMPOPO, SOUTH AFRICA</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Base map switcher */}
          <div className="flex items-center gap-0.5 mr-1">
            {(Object.keys(baseLayers) as BaseMap[]).map(key => (
              <button
                key={key}
                onClick={() => setBaseMap(key)}
                className={`px-2 py-0.5 rounded text-[8px] font-display uppercase transition-colors ${
                  baseMap === key ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:bg-secondary border border-transparent'
                }`}
              >
                {baseLayers[key].label}
              </button>
            ))}
          </div>
          <motion.div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Satellite className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-display text-primary">LIVE SATELLITE</span>
          </motion.div>
          <button onClick={() => setShowLayerPanel(!showLayerPanel)} className="p-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: 560 }}>
        {/* Layer Panel */}
        <AnimatePresence>
          {showLayerPanel && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-2 left-2 z-[1000] bg-card/95 backdrop-blur border border-border rounded-lg p-2 space-y-1 w-44"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display text-[10px] font-bold text-foreground uppercase tracking-widest">Layers</span>
                <button onClick={() => setShowLayerPanel(false)}><X className="w-3 h-3 text-muted-foreground" /></button>
              </div>
              {layerConfig.map(layer => (
                <button
                  key={layer.key}
                  onClick={() => toggleLayer(layer.key)}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-[10px] font-display transition-colors ${
                    activeLayers.includes(layer.key) ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <layer.icon className={`w-3 h-3 ${activeLayers.includes(layer.key) ? layer.color : ''}`} />
                  {layer.label}
                  <div className={`ml-auto w-2 h-2 rounded-full ${activeLayers.includes(layer.key) ? 'bg-primary' : 'bg-muted'}`} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom Controls */}
        <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1">
          <button onClick={() => mapRef.current?.zoomIn()} className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <ZoomIn className="w-3.5 h-3.5 text-foreground" />
          </button>
          <button onClick={() => mapRef.current?.zoomOut()} className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <ZoomOut className="w-3.5 h-3.5 text-foreground" />
          </button>
          <button onClick={() => mapRef.current?.setView([-23.9, 29.5], 8)} className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-foreground" />
          </button>
          <button onClick={() => mapRef.current?.setView([-23.9045, 29.4687], 13)} className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <Crosshair className="w-3.5 h-3.5 text-foreground" />
          </button>
        </div>

        {/* Live stats */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3">
          <div className="px-2 py-1 bg-card/80 backdrop-blur border border-border rounded-md">
            <span className="text-[9px] font-display text-muted-foreground">Active Pins: </span>
            <span className="text-[9px] font-display text-primary">{mockAlerts.filter(a => a.status !== 'resolved').length + policePostings.length + constructionZones.length + aidInProgress.length}</span>
          </div>
          <motion.div
            className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-md"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-[9px] font-display text-primary">GPS UPDATE 30s</span>
          </motion.div>
        </div>

        {/* Leaflet Map Container */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />

        {/* Legend */}
        <div className="absolute bottom-2 left-2 right-2 z-[1000]">
          <div className="flex items-center gap-3 px-3 py-2 bg-card/90 backdrop-blur border border-border rounded-lg text-[9px] font-display text-muted-foreground flex-wrap">
            <span className="text-foreground font-bold uppercase tracking-widest mr-1">Legend:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Accident</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#00BFFF' }} /> SAPS</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Aid</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Construction</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Online</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#f39c12' }} /> Standby</span>
            <span className="flex items-center gap-1 ml-auto text-primary">
              <Satellite className="w-2.5 h-2.5" /> Iridium/Starlink
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
