import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockWorkers, mockAlerts, heatmapZones, trafficSigns, roadConditions } from '@/data/mockData';
import {
  MapPin, AlertTriangle, Radio, Users, Shield, Construction, Ambulance,
  ZoomIn, ZoomOut, Maximize2, X, Navigation, Car, Siren, Eye, Layers,
  Crosshair, Satellite, Activity
} from 'lucide-react';

type MapLayer = 'workers' | 'alerts' | 'heatmap' | 'construction' | 'police' | 'traffic' | 'routes';

interface MapItem {
  id: string;
  type: 'worker' | 'alert' | 'construction' | 'police' | 'aid';
  lat: number;
  lng: number;
  data: Record<string, unknown>;
}

// Additional map pins for richness
const constructionZones = [
  { id: 'CZ-1', name: 'M10 Seshego Resurfacing', lat: -23.82, lng: 29.40, status: 'active', eta: '3 days' },
  { id: 'CZ-2', name: 'R37 Pothole Repairs', lat: -23.95, lng: 29.65, status: 'active', eta: '5 days' },
  { id: 'CZ-3', name: 'N1 KM 312 Crack Repair', lat: -24.05, lng: 29.35, status: 'scheduled', eta: '7 days' },
];

const policePostings = [
  { id: 'PP-1', name: 'SAPS Unit 247', lat: -23.88, lng: 29.42, status: 'on duty', score: 1240 },
  { id: 'PP-2', name: 'SAPS Flying Squad 12', lat: -23.92, lng: 29.50, status: 'on duty', score: 1580 },
  { id: 'PP-3', name: 'Traffic Unit 19', lat: -23.87, lng: 29.70, status: 'standby', score: 890 },
  { id: 'PP-4', name: 'K9 Unit Seshego', lat: -23.84, lng: 29.38, status: 'on duty', score: 720 },
];

const aidInProgress = [
  { id: 'AID-1', name: 'Ambulance Unit 247', lat: -23.90, lng: 29.46, destination: 'N1 Highway Crash', eta: '3m 42s', moving: true },
  { id: 'AID-2', name: 'Fire Unit 7', lat: -23.93, lng: 29.90, destination: 'R71 Incident', eta: '6m', moving: true },
  { id: 'AID-3', name: 'Ambulance Unit 112', lat: -23.88, lng: 29.72, destination: 'Mankweng Area', eta: '5m 30s', moving: true },
];

export default function ProvinceMap() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeLayers, setActiveLayers] = useState<MapLayer[]>(['workers', 'alerts', 'heatmap', 'construction', 'police', 'routes']);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const mapBounds = { minLat: -24.8, maxLat: -22.2, minLng: 28.0, maxLng: 31.5 };

  const toMapPos = (lat: number, lng: number) => ({
    x: ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100,
    y: ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100,
  });

  const toggleLayer = (layer: MapLayer) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.3, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.3, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => { isDragging.current = false; };

  const layerConfig = [
    { key: 'workers' as MapLayer, icon: Users, label: 'Workers', color: 'text-primary' },
    { key: 'alerts' as MapLayer, icon: AlertTriangle, label: 'Alerts', color: 'text-destructive' },
    { key: 'heatmap' as MapLayer, icon: Activity, label: 'Risk Heatmap', color: 'text-accent' },
    { key: 'construction' as MapLayer, icon: Construction, label: 'Construction', color: 'text-accent' },
    { key: 'police' as MapLayer, icon: Shield, label: 'Police Posts', color: 'text-info' },
    { key: 'routes' as MapLayer, icon: Navigation, label: 'Major Routes', color: 'text-accent' },
  ];

  const workerPositions = [
    { lat: -23.9, lng: 29.45 }, { lat: -23.88, lng: 29.72 }, { lat: -23.85, lng: 29.41 },
    { lat: -23.94, lng: 29.94 }, { lat: -23.83, lng: 30.16 }, { lat: -23.91, lng: 29.5 },
    { lat: -24.0, lng: 29.3 }, { lat: -23.7, lng: 29.8 }, { lat: -23.95, lng: 30.0 },
    { lat: -23.85, lng: 29.6 },
  ];

  return (
    <div className="dashboard-card p-0 overflow-hidden">
      {/* Map Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary pulse-live" />
          <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">
            Provincial Safety Intelligence Map
          </h3>
          <span className="text-[9px] text-muted-foreground font-display">— LIMPOPO PROVINCE</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Satellite className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-display text-primary">LIVE FEED</span>
          </motion.div>
          <button onClick={() => setShowLayerPanel(!showLayerPanel)} className="p-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: 520 }}>
        {/* Layer Panel */}
        <AnimatePresence>
          {showLayerPanel && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-2 left-2 z-30 bg-card/95 backdrop-blur border border-border rounded-lg p-2 space-y-1 w-44"
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
        <div className="absolute top-2 right-2 z-30 flex flex-col gap-1">
          <button onClick={handleZoomIn} className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <ZoomIn className="w-3.5 h-3.5 text-foreground" />
          </button>
          <button onClick={handleZoomOut} className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <ZoomOut className="w-3.5 h-3.5 text-foreground" />
          </button>
          <button onClick={handleReset} className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-foreground" />
          </button>
          <button className="p-1.5 bg-card/90 border border-border rounded-md hover:bg-secondary transition-colors">
            <Crosshair className="w-3.5 h-3.5 text-foreground" />
          </button>
        </div>

        {/* Map Canvas */}
        <div
          ref={mapRef}
          className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ background: 'radial-gradient(ellipse at center, hsl(160 18% 8%) 0%, hsl(160 18% 4%) 100%)' }}
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: 'center', transition: isDragging.current ? 'none' : 'transform 0.3s ease' }}
          >
            {/* Grid lines with glow */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Grid */}
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(p => (
                <g key={p}>
                  <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="hsl(160 12% 12%)" strokeWidth="0.3" />
                  <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="hsl(160 12% 12%)" strokeWidth="0.3" />
                </g>
              ))}

              {/* Province outline (detailed) */}
              <polygon
                points="12,8 25,4 40,3 55,5 70,10 80,18 88,30 92,42 90,55 85,65 78,75 68,82 55,88 42,90 30,87 20,80 12,70 7,58 5,45 6,32 8,20"
                fill="hsl(145 65% 38% / 0.03)"
                stroke="hsl(145 65% 38% / 0.15)"
                strokeWidth="1.5"
                filter="url(#glow)"
              />

              {/* Major routes with neon glow */}
              {activeLayers.includes('routes') && (
                <>
                  {/* N1 Highway */}
                  <line x1="28%" y1="10%" x2="35%" y2="90%" stroke="hsl(43 96% 52% / 0.3)" strokeWidth="2.5" filter="url(#glow)" />
                  <line x1="28%" y1="10%" x2="35%" y2="90%" stroke="hsl(43 96% 52% / 0.15)" strokeWidth="1" strokeDasharray="6 3" />
                  {/* R71 */}
                  <line x1="30%" y1="42%" x2="75%" y2="38%" stroke="hsl(43 96% 52% / 0.25)" strokeWidth="2" filter="url(#glow)" />
                  <line x1="30%" y1="42%" x2="75%" y2="38%" stroke="hsl(43 96% 52% / 0.12)" strokeWidth="1" strokeDasharray="6 3" />
                  {/* R81 */}
                  <line x1="40%" y1="35%" x2="65%" y2="55%" stroke="hsl(43 96% 52% / 0.2)" strokeWidth="1.5" filter="url(#glow)" />
                  {/* R36 */}
                  <line x1="25%" y1="50%" x2="55%" y2="75%" stroke="hsl(43 96% 52% / 0.15)" strokeWidth="1.5" />
                  {/* M10 */}
                  <line x1="22%" y1="35%" x2="38%" y2="38%" stroke="hsl(43 96% 52% / 0.15)" strokeWidth="1" />
                  {/* Road labels */}
                  <text x="31%" y="48%" fill="hsl(43 96% 52% / 0.5)" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">N1</text>
                  <text x="52%" y="35%" fill="hsl(43 96% 52% / 0.4)" fontSize="8" fontFamily="JetBrains Mono">R71</text>
                  <text x="52%" y="50%" fill="hsl(43 96% 52% / 0.35)" fontSize="7" fontFamily="JetBrains Mono">R81</text>
                  <text x="36%" y="65%" fill="hsl(43 96% 52% / 0.3)" fontSize="7" fontFamily="JetBrains Mono">R36</text>
                </>
              )}

              {/* Town labels */}
              <text x="32%" y="43%" fill="hsl(0 0% 100% / 0.6)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">POLOKWANE</text>
              <text x="55%" y="40%" fill="hsl(0 0% 100% / 0.3)" fontSize="7" fontFamily="JetBrains Mono">Mankweng</text>
              <text x="62%" y="55%" fill="hsl(0 0% 100% / 0.3)" fontSize="7" fontFamily="JetBrains Mono">Tzaneen</text>
              <text x="22%" y="72%" fill="hsl(0 0% 100% / 0.3)" fontSize="7" fontFamily="JetBrains Mono">Mokopane</text>
              <text x="60%" y="18%" fill="hsl(0 0% 100% / 0.3)" fontSize="7" fontFamily="JetBrains Mono">Thohoyandou</text>
              <text x="18%" y="38%" fill="hsl(0 0% 100% / 0.25)" fontSize="6" fontFamily="JetBrains Mono">Seshego</text>
            </svg>

            {/* Heatmap zones */}
            {activeLayers.includes('heatmap') && heatmapZones.map(zone => {
              const pos = toMapPos(zone.lat, zone.lng);
              const size = Math.max(zone.risk / 2, 20);
              return (
                <motion.div
                  key={zone.name}
                  className="absolute rounded-full"
                  animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                  style={{
                    left: `${pos.x}%`, top: `${pos.y}%`,
                    width: size * 2, height: size * 2,
                    transform: 'translate(-50%, -50%)',
                    background: zone.risk > 75
                      ? 'radial-gradient(circle, hsl(0 72% 50% / 0.5) 0%, hsl(0 72% 50% / 0.15) 50%, transparent 70%)'
                      : zone.risk > 50
                      ? 'radial-gradient(circle, hsl(43 96% 52% / 0.4) 0%, hsl(43 96% 52% / 0.1) 50%, transparent 70%)'
                      : 'radial-gradient(circle, hsl(145 65% 38% / 0.3) 0%, hsl(145 65% 38% / 0.08) 50%, transparent 70%)',
                  }}
                />
              );
            })}

            {/* Construction zones */}
            {activeLayers.includes('construction') && constructionZones.map(zone => {
              const pos = toMapPos(zone.lat, zone.lng);
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedPin(selectedPin === zone.id ? null : zone.id)}
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <Construction className="w-5 h-5 text-accent drop-shadow-[0_0_6px_hsl(43_96%_52%/0.5)]" />
                  </motion.div>
                  <AnimatePresence>
                    {selectedPin === zone.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-accent/30 rounded-lg p-2.5 w-48 text-left z-20"
                      >
                        <p className="font-display text-[10px] font-bold text-accent">🚧 {zone.name}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">Status: {zone.status}</p>
                        <p className="text-[9px] text-muted-foreground">Completion: {zone.eta}</p>
                        <button className="mt-1.5 w-full py-1 rounded bg-accent/10 text-[9px] text-accent font-display hover:bg-accent/20 transition-colors">
                          Send to LED Billboard
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Police postings */}
            {activeLayers.includes('police') && policePostings.map(post => {
              const pos = toMapPos(post.lat, post.lng);
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedPin(selectedPin === post.id ? null : post.id)}
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.div whileHover={{ scale: 1.2 }} className="relative">
                    <Shield className="w-5 h-5 text-info drop-shadow-[0_0_6px_hsl(210_80%_42%/0.5)]" />
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {selectedPin === post.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-info/30 rounded-lg p-2.5 w-48 text-left z-20"
                      >
                        <p className="font-display text-[10px] font-bold text-info">🔵 {post.name}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">Status: <span className="text-primary">{post.status}</span></p>
                        <p className="text-[9px] text-muted-foreground">PoW Score: <span className="text-accent font-display">{post.score} pts</span></p>
                        <button className="mt-1.5 w-full py-1 rounded bg-info/10 text-[9px] text-info font-display hover:bg-info/20 transition-colors">
                          View Details
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Alert markers */}
            {activeLayers.includes('alerts') && mockAlerts.filter(a => a.status !== 'resolved').map(alert => {
              const pos = toMapPos(alert.coordinates.lat, alert.coordinates.lng);
              const isCritical = alert.severity === 'critical';
              return (
                <button
                  key={alert.id}
                  onClick={() => setSelectedPin(selectedPin === alert.id ? null : alert.id)}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className="relative">
                    {isCritical && (
                      <motion.div
                        className="absolute inset-0 w-8 h-8 -m-2 rounded-full"
                        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ background: 'radial-gradient(circle, hsl(0 72% 50% / 0.4), transparent)' }}
                      />
                    )}
                    <motion.div
                      animate={isCritical ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <AlertTriangle className={`w-5 h-5 ${isCritical ? 'text-destructive drop-shadow-[0_0_8px_hsl(0_72%_50%/0.8)]' : 'text-accent drop-shadow-[0_0_6px_hsl(43_96%_52%/0.5)]'}`} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {selectedPin === alert.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border ${isCritical ? 'border-destructive/40' : 'border-accent/30'} rounded-lg p-3 w-56 text-left z-30`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-display font-bold ${isCritical ? 'text-destructive' : 'text-accent'}`}>{alert.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-display uppercase ${isCritical ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'}`}>{alert.severity}</span>
                        </div>
                        <p className="text-[10px] text-foreground font-medium">{alert.location}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">ETA: <span className="text-info">{alert.eta}</span></p>
                        <p className="text-[9px] text-muted-foreground">Responders: {alert.responders.length}</p>
                        <p className="text-[9px] text-muted-foreground">Sensor: {alert.sensorConfirmed ? '✅ Confirmed' : '⏳ Pending'}</p>
                        <div className="flex gap-1 mt-2">
                          <button className="flex-1 py-1 rounded bg-primary/10 text-[9px] text-primary font-display hover:bg-primary/20 transition-colors">
                            Dispatch
                          </button>
                          <button className="flex-1 py-1 rounded bg-accent/10 text-[9px] text-accent font-display hover:bg-accent/20 transition-colors">
                            LED Alert
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Aid in progress (moving markers) */}
            {activeLayers.includes('workers') && aidInProgress.map((aid, i) => {
              const pos = toMapPos(aid.lat, aid.lng);
              return (
                <button
                  key={aid.id}
                  onClick={() => setSelectedPin(selectedPin === aid.id ? null : aid.id)}
                  className="absolute z-15 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.div
                    animate={{ x: [0, 3, -2, 1, 0], y: [0, -1, 2, -1, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-4 h-4 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                      <Ambulance className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                    {/* Tracking trail */}
                    <motion.div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-primary/30 rounded-full"
                      animate={{ opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {selectedPin === aid.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-primary/30 rounded-lg p-2.5 w-48 text-left z-20"
                      >
                        <p className="font-display text-[10px] font-bold text-primary">🚑 {aid.name}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">→ {aid.destination}</p>
                        <p className="text-[9px] text-info">ETA: {aid.eta}</p>
                        <div className="mt-1 w-full h-1 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            animate={{ width: ['20%', '80%'] }}
                            transition={{ duration: 8, repeat: Infinity }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Worker markers */}
            {activeLayers.includes('workers') && mockWorkers.filter(w => w.status !== 'offline').map((worker, i) => {
              const coords = workerPositions[i % workerPositions.length];
              const pos = toMapPos(coords.lat, coords.lng);
              return (
                <button
                  key={worker.id}
                  onClick={() => setSelectedPin(selectedPin === worker.id ? null : worker.id)}
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.div whileHover={{ scale: 1.3 }}>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-card ${
                      worker.status === 'responding' ? 'bg-info' :
                      worker.status === 'standby' ? 'bg-accent' : 'bg-success'
                    }`}>
                      {worker.status === 'responding' && (
                        <motion.div
                          className="absolute inset-0 rounded-full border border-info"
                          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                  <AnimatePresence>
                    {selectedPin === worker.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg p-2.5 w-48 text-left z-20"
                      >
                        <p className="font-display text-[10px] font-bold text-foreground">{worker.name}</p>
                        <p className="text-[9px] text-muted-foreground">{worker.role} • {worker.department.toUpperCase()}</p>
                        <p className="text-[9px] text-muted-foreground">{worker.location}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-[9px] ${worker.status === 'responding' ? 'text-info' : worker.status === 'standby' ? 'text-accent' : 'text-primary'}`}>{worker.status.toUpperCase()}</span>
                          <span className="text-[9px] text-accent font-display">{worker.points} pts</span>
                        </div>
                        {worker.distance && <p className="text-[9px] text-info mt-0.5">→ {worker.distance} • ETA {worker.eta}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <div className="flex items-center gap-3 px-3 py-2 bg-card/90 backdrop-blur border border-border rounded-lg text-[9px] font-display text-muted-foreground flex-wrap">
            <span className="text-foreground font-bold uppercase tracking-widest mr-1">Legend:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Accident</span>
            <span className="flex items-center gap-1"><Shield className="w-2.5 h-2.5 text-info" /> Police</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Aid</span>
            <span className="flex items-center gap-1"><Construction className="w-2.5 h-2.5 text-accent" /> Construction</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Online</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Standby</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-info inline-block" /> Responding</span>
            <span className="flex items-center gap-1 ml-auto text-primary">
              <Satellite className="w-2.5 h-2.5" /> Iridium/Starlink Active
            </span>
          </div>
        </div>

        {/* Live stats overlay */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <div className="px-2 py-1 bg-card/80 backdrop-blur border border-border rounded-md">
            <span className="text-[9px] font-display text-muted-foreground">Zoom: </span>
            <span className="text-[9px] font-display text-foreground">{(zoom * 100).toFixed(0)}%</span>
          </div>
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
      </div>
    </div>
  );
}
