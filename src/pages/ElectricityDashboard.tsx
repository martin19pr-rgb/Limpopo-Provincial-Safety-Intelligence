import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '@/components/DashboardLayout';
import { mockWorkers } from '@/data/mockData';
import { playAlertSound, unlockAudio } from '@/lib/alertSound';
import {
  Zap, Activity, AlertTriangle, BarChart3, Map, CheckCircle,
  Cpu, TrendingUp, Radio, Clock, Users, Gauge, Layers, Brain
} from 'lucide-react';
import { toast } from 'sonner';

const SUBSTATIONS = 14;
const GRID_UPTIME = 97.4;
const ACTIVE_FAULTS = 3;
const LOAD_CAPACITY = 78;

const gridFaults = [
  { id: 'F-001', location: 'Polokwane North Substation', type: 'Transformer Overload', severity: 'critical', affected: '4,200 households', eta: '45 min', time: '8m ago' },
  { id: 'F-002', location: 'Tzaneen District Feeder', type: 'Line Fault', severity: 'high', affected: '1,800 households', eta: '1h 20m', time: '22m ago' },
  { id: 'F-003', location: 'Giyani Zone 3', type: 'Blown Fuse', severity: 'medium', affected: '320 households', eta: '30 min', time: '41m ago' },
  { id: 'F-004', location: 'Mokopane South Grid', type: 'Voltage Dip', severity: 'low', affected: '0 households', eta: 'Monitoring', time: '1h ago' },
];

const substationStatus = [
  { name: 'Polokwane Main (132kV)', load: 84, capacity: 100, status: 'warning', voltage: '131.8 kV', lat: -23.91, lng: 29.47 },
  { name: 'Tzaneen Substation (66kV)', load: 62, capacity: 100, status: 'good', voltage: '66.1 kV', lat: -23.84, lng: 30.16 },
  { name: 'Mokopane Grid (33kV)', load: 71, capacity: 100, status: 'good', voltage: '33.2 kV', lat: -24.19, lng: 28.99 },
  { name: 'Lephalale Sub (33kV)', load: 55, capacity: 100, status: 'good', voltage: '33.0 kV', lat: -23.68, lng: 27.71 },
  { name: 'Musina North (66kV)', load: 91, capacity: 100, status: 'critical', voltage: '66.4 kV', lat: -22.35, lng: 29.99 },
  { name: 'Giyani East (33kV)', load: 68, capacity: 100, status: 'good', voltage: '33.1 kV', lat: -23.30, lng: 30.72 },
  { name: 'Thohoyandou (33kV)', load: 77, capacity: 100, status: 'warning', voltage: '33.0 kV', lat: -22.95, lng: 30.48 },
  { name: 'Burgersfort (33kV)', load: 60, capacity: 100, status: 'good', voltage: '33.1 kV', lat: -24.65, lng: 30.33 },
];

const loadShedSchedule = [
  { area: 'Polokwane South — Zone 4', startTime: '10:00', endTime: '12:30', stage: 'Stage 2', status: 'active' },
  { area: 'Tzaneen North — Zone 7', startTime: '14:00', endTime: '16:30', stage: 'Stage 1', status: 'scheduled' },
  { area: 'Musina East — Zone 2', startTime: '18:00', endTime: '20:00', stage: 'Stage 3', status: 'scheduled' },
];

const repairTeams = [
  { id: 'RT-001', name: 'Eskom Crew Alpha', location: 'Polokwane North Substation', task: 'Transformer replacement', eta: 'On site', status: 'active' },
  { id: 'RT-002', name: 'Eskom Crew Bravo', location: 'Tzaneen Feeder Line', task: 'Line fault repair', eta: '18 min', status: 'en route' },
  { id: 'RT-003', name: 'Eskom Crew Charlie', location: 'Giyani Zone 3', task: 'Fuse replacement', eta: 'On site', status: 'active' },
  { id: 'RT-004', name: 'Eskom Inspection Unit', location: 'Musina Grid', task: 'Load monitoring', eta: '35 min', status: 'en route' },
];

const electricityWorkers = mockWorkers.filter(w => w.department === 'electricity');

// Eskom Limpopo grid lines (transmission lines between substations)
const gridLines = [
  { from: { lat: -23.91, lng: 29.47 }, to: { lat: -23.84, lng: 30.16 }, label: 'Polokwane–Tzaneen 132kV', status: 'active' },
  { from: { lat: -23.91, lng: 29.47 }, to: { lat: -24.19, lng: 28.99 }, label: 'Polokwane–Mokopane 66kV', status: 'active' },
  { from: { lat: -23.91, lng: 29.47 }, to: { lat: -23.68, lng: 27.71 }, label: 'Polokwane–Lephalale 66kV', status: 'active' },
  { from: { lat: -22.35, lng: 29.99 }, to: { lat: -22.95, lng: 30.48 }, label: 'Musina–Thohoyandou 66kV', status: 'critical' },
  { from: { lat: -22.95, lng: 30.48 }, to: { lat: -23.30, lng: 30.72 }, label: 'Thohoyandou–Giyani 33kV', status: 'active' },
  { from: { lat: -23.84, lng: 30.16 }, to: { lat: -23.30, lng: 30.72 }, label: 'Tzaneen–Giyani 33kV', status: 'active' },
  { from: { lat: -23.84, lng: 30.16 }, to: { lat: -24.65, lng: 30.33 }, label: 'Tzaneen–Burgersfort 33kV', status: 'active' },
  { from: { lat: -24.19, lng: 28.99 }, to: { lat: -24.65, lng: 30.33 }, label: 'Mokopane–Burgersfort 33kV', status: 'active' },
  { from: { lat: -23.91, lng: 29.47 }, to: { lat: -22.35, lng: 29.99 }, label: 'Polokwane–Musina 132kV', status: 'warning' },
];

function EskomGridMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: false }).setView([-23.5, 29.5], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    const style = document.createElement('style');
    style.textContent = `.eskom-tooltip { font-family:'JetBrains Mono',monospace !important; font-size:9px !important; background:rgba(0,0,0,0.9) !important; border:1px solid #D4AF3740 !important; color:#f39c12 !important; border-radius:6px !important; padding:3px 6px !important; } .leaflet-popup-content-wrapper { background:rgba(15,20,25,0.95) !important; border:1px solid #333 !important; border-radius:8px !important; color:#e8e6e3 !important; } .leaflet-popup-tip { background:rgba(15,20,25,0.95) !important; }`;
    document.head.appendChild(style);

    // Draw grid lines
    gridLines.forEach(line => {
      const color = line.status === 'critical' ? '#e74c3c' : line.status === 'warning' ? '#f39c12' : '#f1c40f';
      const dashArray = line.status === 'critical' ? '4 4' : line.status === 'warning' ? '8 4' : undefined;
      L.polyline([[line.from.lat, line.from.lng], [line.to.lat, line.to.lng]], {
        color,
        weight: 2.5,
        opacity: 0.8,
        dashArray,
      }).bindTooltip(line.label, { className: 'eskom-tooltip' }).addTo(map);
    });

    // Draw substation markers
    substationStatus.forEach(sub => {
      const color = sub.status === 'critical' ? '#e74c3c' : sub.status === 'warning' ? '#f39c12' : '#f1c40f';
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="position:relative;"><div style="width:16px;height:16px;background:${color};border:2px solid #fff;border-radius:3px;box-shadow:0 0 10px ${color}80;display:flex;align-items:center;justify-content:center;"><span style="font-size:7px;color:#000;font-weight:900;">⚡</span></div></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      L.marker([sub.lat, sub.lng], { icon })
        .bindPopup(`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;"><b>⚡ ${sub.name}</b><br>Load: <span style="color:${color};">${sub.load}%</span><br>Voltage: ${sub.voltage}<br>Status: <span style="color:${color};">${sub.status.toUpperCase()}</span></div>`)
        .addTo(map);
    });

    // Latitude/longitude grid lines (visual grid overlay)
    for (let lat = -25; lat <= -22; lat += 0.5) {
      L.polyline([[lat, 27], [lat, 32]], { color: '#f1c40f08', weight: 1, opacity: 0.3 }).addTo(map);
    }
    for (let lng = 27; lng <= 32; lng += 0.5) {
      L.polyline([[-25, lng], [-22, lng]], { color: '#f1c40f08', weight: 1, opacity: 0.3 }).addTo(map);
    }

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; style.remove(); };
  }, []);

  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 pulse-live" />
          <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Eskom Grid Map — Limpopo</h3>
        </div>
        <div className="flex items-center gap-2">
          {[
            { color: '#e74c3c', label: 'Critical' },
            { color: '#f39c12', label: 'Warning' },
            { color: '#f1c40f', label: 'Active' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1 text-[9px] font-display text-muted-foreground">
              <span className="w-6 h-0.5 inline-block" style={{ background: l.color }} />{l.label}
            </span>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{ height: 420 }} />
    </div>
  );
}

export default function ElectricityDashboard() {
  const [tab, setTab] = useState<'overview' | 'faults' | 'substations' | 'shedding' | 'crews'>('overview');

  useEffect(() => {
    document.addEventListener('click', unlockAudio, { once: true });
    const interval = setInterval(() => {
      if (Math.random() > 0.82) {
        playAlertSound('high');
        toast.error('⚡ GRID ALERT — Substation fault detected', { duration: 4000 });
      }
    }, 20000);
    return () => { clearInterval(interval); document.removeEventListener('click', unlockAudio); };
  }, []);

  const tabs = [
    { key: 'overview', label: 'Grid Map', icon: Map },
    { key: 'faults', label: 'Grid Faults', icon: AlertTriangle },
    { key: 'substations', label: 'Substations', icon: Gauge },
    { key: 'shedding', label: 'Load Shedding', icon: Clock },
    { key: 'crews', label: 'Repair Crews', icon: Users },
  ];

  const severityColor: Record<string, string> = {
    critical: 'text-destructive border-destructive/30 bg-destructive/10',
    high: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    medium: 'text-accent border-accent/30 bg-accent/10',
    low: 'text-muted-foreground border-border bg-secondary/30',
  };

  const loadColor = (load: number) =>
    load >= 90 ? 'bg-destructive' : load >= 75 ? 'bg-accent' : 'bg-yellow-400';

  return (
    <DashboardLayout title="Eskom — Limpopo Grid Command Centre" deptBg="dept-bg-roads">
      <div className="space-y-5">

        {/* Hero */}
        <motion.div className="glass-card p-5 relative overflow-hidden" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 via-transparent to-yellow-800/10 pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(48 96% 53% / 0.3), hsl(40 90% 50% / 0.2))' }}
                animate={{ boxShadow: ['0 0 0 0 hsl(48 96% 53% / 0.4)', '0 0 30px 8px hsl(48 96% 53% / 0.1)', '0 0 0 0 hsl(48 96% 53% / 0.4)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Zap className="w-7 h-7 text-yellow-400" />
              </motion.div>
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wider">ESKOM — LIMPOPO GRID COMMAND</h1>
                <p className="text-[10px] text-muted-foreground font-display mt-0.5">ESKOM SOC LTD • LIMPOPO OPERATING UNIT • AI-MONITORED • REAL-TIME</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Activity, label: `Uptime ${GRID_UPTIME}%`, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
                { icon: Cpu, label: `${SUBSTATIONS} Substations`, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
                { icon: AlertTriangle, label: `${ACTIVE_FAULTS} Active Faults`, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20' },
                { icon: Gauge, label: `Load: ${LOAD_CAPACITY}%`, color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
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
            { label: 'Grid Uptime', value: `${GRID_UPTIME}%`, icon: Activity, color: 'text-primary' },
            { label: 'Active Faults', value: ACTIVE_FAULTS, icon: AlertTriangle, color: 'text-destructive' },
            { label: 'Load Capacity', value: `${LOAD_CAPACITY}%`, icon: Gauge, color: 'text-accent' },
            { label: 'Substations', value: SUBSTATIONS, icon: Zap, color: 'text-yellow-400' },
            { label: 'Repair Crews', value: repairTeams.length, icon: Users, color: 'text-info' },
            { label: 'Shedding Zones', value: loadShedSchedule.length, icon: Clock, color: 'text-muted-foreground' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label} className="glass-card p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
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
                tab === t.key ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'text-muted-foreground border border-border hover:bg-secondary/50'
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
                <EskomGridMap />
                <div className="dashboard-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-4 h-4 text-yellow-400" />
                    <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">AI Grid Analysis</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { insight: 'Musina substation at 91% — trip risk within 2hrs without load reduction. Stage 3 recommended.', severity: 'critical' },
                      { insight: 'Evening peak demand forecast: +18% above current load 17:00–20:00. Pre-emptive shedding advised.', severity: 'high' },
                      { insight: 'Tzaneen feeder restoration on schedule — estimated 14:20 reconnection for 1,800 households.', severity: 'medium' },
                      { insight: 'Polokwane Main grid stable. Voltage within ±2% tolerance. N1 corridor feeders nominal.', severity: 'low' },
                    ].map((item, i) => (
                      <div key={i} className={`p-3 rounded-lg border text-[11px] leading-relaxed ${
                        item.severity === 'critical' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                        item.severity === 'high' ? 'bg-orange-400/10 border-orange-400/30 text-orange-400' :
                        item.severity === 'medium' ? 'bg-accent/10 border-accent/30 text-accent' :
                        'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                      }`}>
                        {item.insight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'faults' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Active Grid Faults</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/30 text-[9px] text-destructive font-display">{gridFaults.length} ACTIVE</span>
                </div>
                {gridFaults.map(fault => (
                  <motion.div
                    key={fault.id}
                    className={`dashboard-card border-l-4 ${fault.severity === 'critical' ? 'border-l-destructive' : fault.severity === 'high' ? 'border-l-orange-400' : fault.severity === 'medium' ? 'border-l-accent' : 'border-l-muted-foreground'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-display text-muted-foreground">{fault.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-display uppercase ${severityColor[fault.severity]}`}>{fault.severity}</span>
                        </div>
                        <p className="text-xs font-display font-bold text-foreground">{fault.location}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{fault.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-foreground font-display">{fault.affected}</p>
                        <p className="text-[9px] text-muted-foreground">ETA: {fault.eta}</p>
                        <p className="text-[9px] text-muted-foreground">{fault.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { playAlertSound('dispatch'); toast.success(`Eskom crew dispatch confirmed — ${fault.id}`); }}
                      className="mt-2 w-full py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] font-display hover:bg-yellow-400/20 transition-colors"
                    >
                      DISPATCH ESKOM REPAIR CREW
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'substations' && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Substation Load Monitor — Limpopo</h3>
                {substationStatus.map((sub, i) => (
                  <motion.div key={sub.name} className="dashboard-card" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{sub.name}</p>
                        <p className="text-[9px] text-muted-foreground">{sub.voltage}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-display border ${
                        sub.status === 'critical' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                        sub.status === 'warning' ? 'bg-accent/10 border-accent/30 text-accent' :
                        'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                      }`}>{sub.load}% LOAD</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${loadColor(sub.load)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.load}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'shedding' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Load Shedding Schedule — Limpopo</h3>
                </div>
                {loadShedSchedule.map(sched => (
                  <motion.div key={sched.area} className="dashboard-card border-l-4 border-l-accent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{sched.area}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{sched.startTime} – {sched.endTime}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-display bg-accent/10 border border-accent/30 text-accent">{sched.stage}</span>
                        <p className={`text-[9px] mt-1 font-display ${sched.status === 'active' ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {sched.status === 'active' ? '● ACTIVE' : '○ SCHEDULED'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="dashboard-card bg-yellow-400/5 border-yellow-400/20">
                  <p className="text-[10px] font-display text-yellow-400">⚡ Eskom Stage definitions: Stage 1 = 1h slot, Stage 2 = 2h slot, Stage 3 = emergency 2h slot.</p>
                  <p className="text-[9px] text-muted-foreground mt-1">SMS alerts automatically dispatched to registered households 30 minutes before shedding begins.</p>
                </div>
              </div>
            )}

            {tab === 'crews' && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Eskom Repair Crews — Limpopo</h3>
                {repairTeams.map(crew => (
                  <motion.div key={crew.id} className="dashboard-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{crew.name}</p>
                        <p className="text-[10px] text-muted-foreground">{crew.location}</p>
                        <p className="text-[10px] text-accent mt-0.5">{crew.task}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-display border ${
                          crew.status === 'active' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-accent/10 border-accent/30 text-accent'
                        }`}>{crew.status === 'active' ? 'ON SITE' : 'EN ROUTE'}</span>
                        <p className="text-[9px] text-muted-foreground mt-1">ETA: {crew.eta}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="dashboard-card">
                  <h4 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Eskom Personnel</h4>
                  {electricityWorkers.length > 0 ? electricityWorkers.map(worker => (
                    <div key={worker.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-xs font-display text-foreground">{worker.name}</p>
                        <p className="text-[9px] text-muted-foreground">{worker.role} • {worker.location}</p>
                      </div>
                      <span className={`text-[8px] font-display px-1.5 py-0.5 rounded ${
                        worker.status === 'online' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                      }`}>{worker.status.toUpperCase()}</span>
                    </div>
                  )) : (
                    <p className="text-[10px] text-muted-foreground">No additional personnel data available.</p>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
