import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '@/components/DashboardLayout';
import { playAlertSound, unlockAudio } from '@/lib/alertSound';
import {
  Map, Shield, AlertTriangle, Activity, Users, Radio,
  Eye, Crosshair, Navigation, Zap, Clock, Brain, Lock
} from 'lucide-react';
import { toast } from 'sonner';

const DRONES_ACTIVE = 6;
const BORDER_LENGTH_KM = 420;
const INCIDENTS_TODAY = 7;
const COVERAGE_PCT = 94;

// Limpopo borders Zimbabwe (north) and Botswana (northwest) and Mozambique (northeast)
// Key border crossing and patrol points along Limpopo River
const borderPoints = [
  { id: 'BP-001', name: 'Beit Bridge Border Post', lat: -22.215, lng: 29.985, type: 'official', status: 'active', vehicles: 340 },
  { id: 'BP-002', name: 'Pont Drift Border Post', lat: -22.415, lng: 29.002, type: 'official', status: 'active', vehicles: 45 },
  { id: 'BP-003', name: 'Stockpoort Border', lat: -22.980, lng: 28.530, type: 'official', status: 'active', vehicles: 30 },
  { id: 'BP-004', name: 'Groblersbrug Border', lat: -23.910, lng: 27.860, type: 'official', status: 'active', vehicles: 58 },
  { id: 'BP-005', name: 'Zanzibar River Crossing', lat: -22.650, lng: 30.210, type: 'unofficial', status: 'alert', vehicles: 0 },
  { id: 'BP-006', name: 'Limpopo River Sector 4', lat: -22.350, lng: 30.450, type: 'unofficial', status: 'monitoring', vehicles: 0 },
];

const borderIncidents = [
  { id: 'BI-001', type: 'Illegal Crossing', location: 'Limpopo River — Sector 4', severity: 'high', time: '14m ago', status: 'active', units: 2 },
  { id: 'BI-002', type: 'Smuggling Attempt', location: 'Zanzibar River Crossing', severity: 'critical', time: '3m ago', status: 'responding', units: 4 },
  { id: 'BI-003', type: 'Vehicle Overstay', location: 'Beit Bridge Post', severity: 'medium', time: '1h ago', status: 'processing', units: 1 },
  { id: 'BI-004', type: 'Document Fraud', location: 'Pont Drift Post', severity: 'high', time: '45m ago', status: 'detained', units: 2 },
];

// Drones patrol routes (animated)
const droneFleets = [
  {
    id: 'DR-LP-01', name: 'Drone LP-01', type: 'Surveillance', battery: 82, altitude: '150m',
    waypoints: [[-22.215, 29.985], [-22.350, 30.100], [-22.450, 30.300], [-22.350, 30.450]],
    color: '#00BFFF', status: 'airborne',
  },
  {
    id: 'DR-LP-02', name: 'Drone LP-02', type: 'Thermal Imaging', battery: 67, altitude: '200m',
    waypoints: [[-22.350, 30.450], [-22.500, 30.200], [-22.650, 30.100], [-22.650, 30.210]],
    color: '#2ecc71', status: 'airborne',
  },
  {
    id: 'DR-LP-03', name: 'Drone LP-03', type: 'Surveillance', battery: 91, altitude: '120m',
    waypoints: [[-22.215, 29.985], [-22.350, 29.700], [-22.600, 29.400], [-22.980, 28.530]],
    color: '#D4AF37', status: 'airborne',
  },
  {
    id: 'DR-LP-04', name: 'Drone LP-04', type: 'Interdiction', battery: 54, altitude: '80m',
    waypoints: [[-22.650, 30.210], [-22.450, 30.100], [-22.215, 29.985], [-22.215, 29.800]],
    color: '#e74c3c', status: 'airborne',
  },
  {
    id: 'DR-LP-05', name: 'Drone LP-05', type: 'Surveillance', battery: 100, altitude: '180m',
    waypoints: [[-22.980, 28.530], [-22.700, 28.700], [-22.415, 29.002], [-22.215, 29.300]],
    color: '#9b59b6', status: 'airborne',
  },
  {
    id: 'DR-LP-06', name: 'Drone LP-06', type: 'Comms Relay', battery: 88, altitude: '300m',
    waypoints: [[-23.910, 27.860], [-23.200, 28.300], [-22.700, 28.900], [-22.415, 29.002]],
    color: '#f39c12', status: 'airborne',
  },
];

const borderUnits = [
  { id: 'BU-001', name: 'Border Unit Alpha', type: 'Ground Patrol', location: 'Beit Bridge Sector', status: 'patrolling', personnel: 8 },
  { id: 'BU-002', name: 'Border Unit Bravo', type: 'Rapid Response', location: 'En route Zanzibar Crossing', status: 'responding', personnel: 6 },
  { id: 'BU-003', name: 'Border Unit Charlie', type: 'K9 Unit', location: 'Pont Drift Area', status: 'patrolling', personnel: 4 },
  { id: 'BU-004', name: 'Marine Unit Delta', type: 'River Patrol', location: 'Limpopo River Sector 4', status: 'patrolling', personnel: 5 },
  { id: 'BU-005', name: 'Surveillance Unit E', type: 'Observation Post', location: 'Beit Bridge Ridge OP', status: 'monitoring', personnel: 3 },
];

function BorderPatrolMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const droneMarkersRef = useRef<{ marker: L.Marker; waypoints: number[][]; progress: number; speed: number }[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Center on Limpopo River / Zimbabwe border
    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: false }).setView([-22.6, 29.4], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    const style = document.createElement('style');
    style.textContent = `.border-tooltip { font-family:'JetBrains Mono',monospace !important; font-size:9px !important; background:rgba(0,0,0,0.9) !important; border:1px solid #00BFFF40 !important; color:#00BFFF !important; border-radius:6px !important; padding:3px 6px !important; } .leaflet-popup-content-wrapper { background:rgba(15,20,25,0.95) !important; border:1px solid #333 !important; border-radius:8px !important; color:#e8e6e3 !important; } .leaflet-popup-tip { background:rgba(15,20,25,0.95) !important; } @keyframes drone-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(1.3); } }`;
    document.head.appendChild(style);

    // Draw Limpopo River border line (approximate)
    const limpopoRiver: [number, number][] = [
      [-23.910, 27.860], [-23.500, 28.100], [-22.980, 28.530],
      [-22.600, 29.000], [-22.415, 29.002], [-22.215, 29.985],
      [-22.100, 30.200], [-22.000, 30.400], [-21.900, 30.700],
    ];
    L.polyline(limpopoRiver, { color: '#3498db', weight: 3, opacity: 0.6, dashArray: '10 5' })
      .bindTooltip('Limpopo River — Zimbabwe Border', { className: 'border-tooltip' })
      .addTo(map);

    // Border label zones
    L.marker([-22.1, 29.5], {
      icon: L.divIcon({
        className: '',
        html: `<div style="padding:2px 8px;background:rgba(0,0,0,0.7);border:1px solid #3498db40;border-radius:4px;font-size:9px;color:#3498db;font-family:'JetBrains Mono',monospace;white-space:nowrap;">🇿🇼 ZIMBABWE</div>`,
        iconSize: [100, 20],
        iconAnchor: [50, 10],
      }),
    }).addTo(map);

    L.marker([-23.5, 29.0], {
      icon: L.divIcon({
        className: '',
        html: `<div style="padding:2px 8px;background:rgba(0,0,0,0.7);border:1px solid #2ecc7140;border-radius:4px;font-size:9px;color:#2ecc71;font-family:'JetBrains Mono',monospace;white-space:nowrap;">🇿🇦 LIMPOPO — SOUTH AFRICA</div>`,
        iconSize: [160, 20],
        iconAnchor: [80, 10],
      }),
    }).addTo(map);

    // Border patrol routes (ground)
    L.polyline(limpopoRiver, { color: '#D4AF37', weight: 1.5, opacity: 0.3, dashArray: '4 8' }).addTo(map);

    // Border posts
    borderPoints.forEach(bp => {
      const color = bp.status === 'alert' ? '#e74c3c' : bp.status === 'monitoring' ? '#f39c12' : '#2ecc71';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:${bp.type === 'official' ? '2px' : '50%'};background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 10px ${color}60;display:flex;align-items:center;justify-content:center;font-size:6px;">🔷</div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker([bp.lat, bp.lng], { icon })
        .bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b>${bp.name}</b><br>Type: ${bp.type}<br>Status: <span style="color:${color};">${bp.status.toUpperCase()}</span>${bp.vehicles ? `<br>Vehicles today: ${bp.vehicles}` : ''}</div>`)
        .bindTooltip(bp.name, { className: 'border-tooltip' })
        .addTo(map);
    });

    // Initialize drone markers
    droneFleets.forEach((drone, di) => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;"><div style="width:12px;height:12px;background:${drone.color};border:2px solid rgba(255,255,255,0.9);border-radius:50%;box-shadow:0 0 12px ${drone.color};animation:drone-pulse 1.5s ease-in-out infinite;"></div></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const start = drone.waypoints[0];
      const marker = L.marker([start[0], start[1]], { icon })
        .bindTooltip(`${drone.name} | ${drone.type} | ${drone.battery}% bat`, { className: 'border-tooltip', permanent: false })
        .addTo(map);

      // Draw drone path
      L.polyline(drone.waypoints as [number, number][], {
        color: drone.color,
        weight: 1,
        opacity: 0.25,
        dashArray: '3 6',
      }).addTo(map);

      droneMarkersRef.current.push({ marker, waypoints: drone.waypoints, progress: (di * 0.2) % 1, speed: 0.0015 + Math.random() * 0.001 });
    });

    // Animation loop
    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      droneMarkersRef.current.forEach(d => {
        d.progress += d.speed * delta * 10;
        if (d.progress >= d.waypoints.length - 1) d.progress = 0;

        const idx = Math.floor(d.progress);
        const t = d.progress - idx;
        const from = d.waypoints[Math.min(idx, d.waypoints.length - 1)];
        const to = d.waypoints[Math.min(idx + 1, d.waypoints.length - 1)];

        if (from && to) {
          const lat = from[0] + (to[0] - from[0]) * t;
          const lng = from[1] + (to[1] - from[1]) * t;
          d.marker.setLatLng([lat, lng]);
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    mapRef.current = map;
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      droneMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
      style.remove();
    };
  }, []);

  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-info pulse-live" />
          <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Border Surveillance — Limpopo/Zimbabwe</h3>
        </div>
        <div className="flex items-center gap-3">
          {droneFleets.map(d => (
            <motion.div
              key={d.id}
              className="flex items-center gap-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span className="text-[8px] font-display text-muted-foreground">{d.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{ height: 460 }} />
    </div>
  );
}

export default function BorderPatrolDashboard() {
  const [tab, setTab] = useState<'overview' | 'incidents' | 'drones' | 'units' | 'crossings'>('overview');

  useEffect(() => {
    document.addEventListener('click', unlockAudio, { once: true });
    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll > 0.85) {
        playAlertSound('critical');
        toast.error('🚨 BORDER ALERT — Unauthorized crossing detected', { duration: 4000 });
      } else if (roll > 0.7) {
        playAlertSound('ai');
        toast.warning('🛸 DRONE — Suspicious movement detected at river sector', { duration: 3000 });
      }
    }, 20000);
    return () => { clearInterval(interval); document.removeEventListener('click', unlockAudio); };
  }, []);

  const tabs = [
    { key: 'overview', label: 'Live Map', icon: Map },
    { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { key: 'drones', label: 'Drone Fleet', icon: Crosshair },
    { key: 'units', label: 'Ground Units', icon: Users },
    { key: 'crossings', label: 'Border Posts', icon: Shield },
  ];

  const severityColor: Record<string, string> = {
    critical: 'text-destructive border-destructive/30 bg-destructive/10',
    high: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    medium: 'text-accent border-accent/30 bg-accent/10',
    low: 'text-muted-foreground border-border bg-secondary/30',
  };

  return (
    <DashboardLayout title="Limpopo Border Patrol Command" deptBg="dept-bg-command">
      <div className="space-y-5">

        {/* Hero */}
        <motion.div className="glass-card p-5 relative overflow-hidden scan-line" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-teal-800/10 pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(195 100% 40% / 0.3), hsl(210 80% 42% / 0.2))' }}
                animate={{ boxShadow: ['0 0 0 0 hsl(195 100% 40% / 0.4)', '0 0 30px 8px hsl(195 100% 40% / 0.1)', '0 0 0 0 hsl(195 100% 40% / 0.4)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Map className="w-7 h-7 text-info" />
              </motion.div>
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wider">LIMPOPO BORDER PATROL — COMMAND</h1>
                <p className="text-[10px] text-muted-foreground font-display mt-0.5">SAPS BORDER UNIT • DRONE-ENABLED • 420KM LIMPOPO RIVER CORRIDOR</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Crosshair, label: `${DRONES_ACTIVE} Drones Active`, color: 'text-info', bg: 'bg-info/10 border-info/20' },
                { icon: Navigation, label: `${BORDER_LENGTH_KM}km border`, color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
                { icon: AlertTriangle, label: `${INCIDENTS_TODAY} incidents`, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20' },
                { icon: Eye, label: `${COVERAGE_PCT}% coverage`, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <motion.div
                  key={label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-display ${bg} ${color}`}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() }}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {[
            { label: 'Drones Airborne', value: DRONES_ACTIVE, icon: Crosshair, color: 'text-info' },
            { label: 'Active Incidents', value: INCIDENTS_TODAY, icon: AlertTriangle, color: 'text-destructive' },
            { label: 'Border Coverage', value: `${COVERAGE_PCT}%`, icon: Eye, color: 'text-primary' },
            { label: 'Ground Units', value: borderUnits.length, icon: Users, color: 'text-accent' },
            { label: 'Border Posts', value: borderPoints.filter(b => b.type === 'official').length, icon: Shield, color: 'text-muted-foreground' },
            { label: 'Border Length', value: `${BORDER_LENGTH_KM}km`, icon: Navigation, color: 'text-accent' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label} className="glass-card p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.03 }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-[9px] font-display text-muted-foreground uppercase tracking-wider">{label}</span>
              </div>
              <p className={`text-xl font-display font-bold ${color}`}>{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-display uppercase tracking-widest transition-all ${
                tab === t.key ? 'bg-info/20 text-info border border-info/30' : 'text-muted-foreground border border-border hover:bg-secondary/50'
              }`}
            >
              <t.icon className="w-3 h-3" />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

            {tab === 'overview' && (
              <div className="space-y-4">
                <BorderPatrolMap />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="dashboard-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-info" />
                      <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">AI Border Intelligence</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { insight: 'Thermal drone DR-LP-02 detected 4 heat signatures at Zanzibar Crossing — interception dispatched.', severity: 'critical' },
                        { insight: 'Vehicle convoy pattern detected: 3 trucks, Beit Bridge sector. Manual inspection ordered.', severity: 'high' },
                        { insight: 'River water level nominal. No flood-crossing risk in next 12 hours.', severity: 'medium' },
                        { insight: 'All 6 drones airborne. Sector coverage: 94%. No blind spots detected.', severity: 'low' },
                      ].map((item, i) => (
                        <div key={i} className={`p-2.5 rounded-lg border text-[10px] leading-relaxed ${
                          item.severity === 'critical' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                          item.severity === 'high' ? 'bg-orange-400/10 border-orange-400/30 text-orange-400' :
                          item.severity === 'medium' ? 'bg-accent/10 border-accent/30 text-accent' :
                          'bg-primary/10 border-primary/30 text-primary'
                        }`}>{item.insight}</div>
                      ))}
                    </div>
                  </div>
                  <div className="dashboard-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-info" />
                      <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Recent Incidents</h3>
                    </div>
                    <div className="space-y-2">
                      {borderIncidents.map(inc => (
                        <motion.div
                          key={inc.id}
                          className={`p-2.5 rounded-lg border ${inc.severity === 'critical' ? 'border-destructive/30 bg-destructive/5' : inc.severity === 'high' ? 'border-orange-400/30 bg-orange-400/5' : 'border-border bg-secondary/10'}`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-display font-bold text-foreground">{inc.type}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-display uppercase ${severityColor[inc.severity]}`}>{inc.severity}</span>
                          </div>
                          <p className="text-[9px] text-muted-foreground mt-0.5">{inc.location} • {inc.time}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-info">{inc.units} units dispatched</span>
                            <span className={`text-[8px] px-1 py-0.5 rounded ${inc.status === 'responding' ? 'bg-accent/10 text-accent' : inc.status === 'active' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>{inc.status.toUpperCase()}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'incidents' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Border Incidents — Limpopo</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/30 text-[9px] text-destructive font-display">{borderIncidents.length} ACTIVE</span>
                </div>
                {borderIncidents.map(incident => (
                  <motion.div
                    key={incident.id}
                    className={`dashboard-card border-l-4 ${incident.severity === 'critical' ? 'border-l-destructive' : incident.severity === 'high' ? 'border-l-orange-400' : 'border-l-accent'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-display text-muted-foreground">{incident.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-display uppercase ${severityColor[incident.severity]}`}>{incident.severity}</span>
                        </div>
                        <p className="text-xs font-display font-bold text-foreground">{incident.type}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{incident.location}</p>
                        <p className="text-[9px] text-muted-foreground">{incident.time} • {incident.units} units deployed</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-display border shrink-0 ${
                        incident.status === 'responding' ? 'bg-accent/10 border-accent/30 text-accent' :
                        incident.status === 'active' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                        'bg-primary/10 border-primary/30 text-primary'
                      }`}>{incident.status.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={() => { playAlertSound('dispatch'); toast.success(`Border response unit dispatched — ${incident.id}`); }}
                      className="mt-2 w-full py-1.5 rounded-lg bg-info/10 border border-info/20 text-info text-[10px] font-display hover:bg-info/20 transition-colors"
                    >
                      DISPATCH RAPID RESPONSE
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'drones' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crosshair className="w-4 h-4 text-info" />
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Drone Fleet — Limpopo Border</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {droneFleets.map((drone, i) => (
                    <motion.div
                      key={drone.id}
                      className="glass-card p-4 border"
                      style={{ borderColor: drone.color + '30' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-3 h-3 rounded-full"
                            style={{ background: drone.color }}
                            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                          />
                          <span className="font-display text-xs font-bold text-foreground">{drone.id}</span>
                        </div>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                          <Crosshair className="w-3.5 h-3.5" style={{ color: drone.color }} />
                        </motion.div>
                      </div>
                      <p className="text-[11px] text-foreground font-medium">{drone.name}</p>
                      <p className="text-[9px] text-muted-foreground">{drone.type}</p>
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex justify-between text-[9px] mb-0.5">
                            <span className="text-muted-foreground">Battery</span>
                            <span style={{ color: drone.color }} className="font-display">{drone.battery}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary/50">
                            <div className="h-1.5 rounded-full" style={{ width: `${drone.battery}%`, background: drone.color }} />
                          </div>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-muted-foreground">Altitude</span>
                          <span className="text-foreground font-display">{drone.altitude}</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-muted-foreground">Status</span>
                          <span className="text-primary font-display uppercase">{drone.status}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { toast.info(`Retracing ${drone.name} to base...`); }}
                        className="mt-3 w-full py-1 rounded-lg text-[9px] font-display border hover:bg-secondary/30 transition-colors"
                        style={{ borderColor: drone.color + '40', color: drone.color }}
                      >
                        RECALL TO BASE
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'units' && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Ground & Marine Units — Limpopo Border</h3>
                {borderUnits.map((unit, i) => (
                  <motion.div key={unit.id} className="dashboard-card" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{unit.name}</p>
                        <p className="text-[9px] text-muted-foreground">{unit.type} • {unit.location}</p>
                        <p className="text-[9px] text-info mt-0.5">{unit.personnel} personnel</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-display border ${
                        unit.status === 'responding' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                        unit.status === 'patrolling' ? 'bg-primary/10 border-primary/30 text-primary' :
                        'bg-info/10 border-info/30 text-info'
                      }`}>{unit.status.toUpperCase()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'crossings' && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Border Crossing Posts — Limpopo</h3>
                {borderPoints.map((bp, i) => (
                  <motion.div
                    key={bp.id}
                    className={`dashboard-card border-l-4 ${bp.status === 'alert' ? 'border-l-destructive' : bp.status === 'monitoring' ? 'border-l-accent' : 'border-l-primary'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{bp.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-display border ${bp.type === 'official' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-accent/10 border-accent/30 text-accent'}`}>{bp.type.toUpperCase()}</span>
                          {bp.vehicles > 0 && <span className="text-[9px] text-muted-foreground">{bp.vehicles} vehicles today</span>}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-display uppercase border ${
                        bp.status === 'alert' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                        bp.status === 'monitoring' ? 'bg-accent/10 border-accent/30 text-accent' :
                        'bg-primary/10 border-primary/30 text-primary'
                      }`}>{bp.status}</span>
                    </div>
                  </motion.div>
                ))}
                <div className="dashboard-card bg-info/5 border-info/20">
                  <p className="text-[10px] font-display text-info">🛸 6 drones active covering the full 420km Limpopo River border corridor. Thermal imaging active after sunset.</p>
                  <p className="text-[9px] text-muted-foreground mt-1">Coordinating with SANDF, SAPS Border Unit, and Home Affairs Department for integrated border management.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
