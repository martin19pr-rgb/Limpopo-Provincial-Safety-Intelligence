import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import SmartProvincialMap from '@/components/SmartProvincialMap';
import HeatmapGrid from '@/components/HeatmapGrid';
import { roadConditions, mockWorkers } from '@/data/mockData';
import { playAlertSound, unlockAudio } from '@/lib/alertSound';
import {
  Construction, Cpu, AlertTriangle, BarChart3, Map, Activity,
  Gauge, Radio, Brain, Zap, CheckCircle, Clock, MapPin, Layers
} from 'lucide-react';
import { toast } from 'sonner';

const SMART_SENSORS = 42;
const AI_PREDICTIONS = 18;
const ROAD_SCORE = 72;
const POTHOLE_DETECTED_TODAY = 7;

const smartAlerts = [
  { id: 'SR-001', location: 'A2 Mountain Pass Bridge', type: 'Flood Risk', severity: 'critical', sensor: 'Acoustic + LiDAR', action: 'Road closed', time: '3m ago' },
  { id: 'SR-002', location: 'N1 KM 308', type: 'Pothole Cluster', severity: 'high', sensor: 'AI Camera', action: 'Repair crew deployed', time: '17m ago' },
  { id: 'SR-003', location: 'R71 Pass Descent', type: 'Erosion Risk', severity: 'high', sensor: 'Satellite + LiDAR', action: 'Speed limit reduced', time: '42m ago' },
  { id: 'SR-004', location: 'A3 Teyateyaneng KM 4', type: 'Pothole', severity: 'medium', sensor: 'Citizen report + AI', action: 'Scheduled repair', time: '1h ago' },
];

const infrastructureHealth = [
  { road: 'N1 National', km: 87, score: 78, status: 'fair', issues: 3 },
  { road: 'R71 Scenic Route', km: 54, score: 62, status: 'poor', issues: 7 },
  { road: 'A2 Mountain Pass', km: 42, score: 55, status: 'poor', issues: 9 },
  { road: 'R36 Escarpment', km: 36, score: 88, status: 'good', issues: 1 },
  { road: 'A3 Teyateyaneng', km: 18, score: 71, status: 'fair', issues: 4 },
  { road: 'A5 Highland Route', km: 63, score: 44, status: 'critical', issues: 12 },
];

const maintenanceCrew = [
  { id: 'C-001', name: 'Road Crew Alpha', location: 'A3 Teyateyaneng', task: 'Pothole repair', eta: 'On site', status: 'active' },
  { id: 'C-002', name: 'Road Crew Bravo', location: 'R81 Bridge', task: 'Flood barrier', eta: '15 min', status: 'en route' },
  { id: 'C-003', name: 'Road Crew Charlie', location: 'N1 KM 312', task: 'Crack sealing', eta: 'On site', status: 'active' },
  { id: 'C-004', name: 'Inspection Unit 1', location: 'R71 Pass', task: 'Erosion survey', eta: '22 min', status: 'en route' },
];

const roadsWorkers = mockWorkers.filter(w => w.department === 'roads');

export default function RoadsAgencyDashboard() {
  const [tab, setTab] = useState<'overview' | 'alerts' | 'health' | 'crews'>('overview');

  useEffect(() => {
    document.addEventListener('click', unlockAudio, { once: true });
    const interval = setInterval(() => {
      if (Math.random() > 0.82) {
        playAlertSound('medium');
        toast.warning('🛣️ ROAD ALERT — New infrastructure issue detected', { duration: 3500 });
      }
    }, 25000);
    return () => { clearInterval(interval); document.removeEventListener('click', unlockAudio); };
  }, []);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Map },
    { key: 'alerts', label: 'Smart Alerts', icon: AlertTriangle },
    { key: 'health', label: 'Road Health', icon: Activity },
    { key: 'crews', label: 'Repair Crews', icon: Construction },
  ];

  const statusColor: Record<string, string> = {
    good: 'text-primary border-primary/30 bg-primary/10',
    fair: 'text-accent border-accent/30 bg-accent/10',
    poor: 'text-destructive border-destructive/30 bg-destructive/10',
    critical: 'text-destructive border-destructive/30 bg-destructive/15',
  };

  return (
    <DashboardLayout title="Roads Agency — Infrastructure Command" deptBg="dept-bg-roads">
      <div className="space-y-5">

        {/* Hero */}
        <motion.div className="glass-card p-5 relative overflow-hidden" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/15 via-transparent to-orange-800/8 pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(30 70% 45% / 0.25), hsl(30 70% 45% / 0.1))' }}
                animate={{ boxShadow: ['0 0 0 0 hsl(30 70% 45% / 0.4)', '0 0 30px 8px hsl(30 70% 45% / 0.1)', '0 0 0 0 hsl(30 70% 45% / 0.4)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Construction className="w-7 h-7 text-accent" />
              </motion.div>
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wider">ROADS — SMART INFRASTRUCTURE</h1>
                <p className="text-[10px] text-muted-foreground font-display mt-0.5">AI-MONITORING • SENSOR FUSION • PREDICTIVE REPAIR</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: `${SMART_SENSORS} sensors active`, color: 'text-info bg-info/10 border-info/20' },
                { label: `${AI_PREDICTIONS} AI predictions`, color: 'text-primary bg-primary/10 border-primary/20' },
                { label: `${POTHOLE_DETECTED_TODAY} potholes today`, color: 'text-accent bg-accent/10 border-accent/20' },
                { label: `Score: ${ROAD_SCORE}/100`, color: 'text-accent bg-accent/10 border-accent/20' },
              ].map(({ label, color }) => (
                <span key={label} className={`px-3 py-1.5 rounded-full border text-[10px] font-display ${color}`}>{label}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Smart Sensors', value: SMART_SENSORS, icon: Radio, color: 'text-info' },
            { label: 'AI Predictions', value: AI_PREDICTIONS, icon: Brain, color: 'text-primary' },
            { label: 'Active Issues', value: roadConditions.filter(r => r.status === 'active').length, icon: AlertTriangle, color: 'text-destructive' },
            { label: 'Road Health Score', value: `${ROAD_SCORE}/100`, icon: Gauge, color: 'text-accent' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label} className="glass-card p-4 ai-glow" whileHover={{ scale: 1.03 }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
              <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl glass-panel flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-display transition-all ${tab === t.key ? 'bg-accent/20 text-accent border border-accent/30' : 'text-muted-foreground hover:text-foreground'}`}>
              <t.icon className="w-3 h-3" />{t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <SmartProvincialMap filterDept="roads" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-4 space-y-3">
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Maintenance Tickets</h3>
                  {roadConditions.map((rc, i) => (
                    <motion.div key={rc.id} className="p-3 rounded-xl border border-border/50 bg-secondary/10"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display text-xs font-bold text-foreground">{rc.id} — {rc.type.toUpperCase()}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${rc.status === 'active' ? 'bg-destructive/20 text-destructive border-destructive/30' : rc.status === 'in_progress' ? 'bg-primary/20 text-primary border-primary/30' : rc.status === 'pending' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-info/20 text-info border-info/30'}`}>
                          {rc.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{rc.location}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Severity: <span className={rc.severity === 'critical' ? 'text-destructive' : rc.severity === 'high' ? 'text-accent' : 'text-info'}>{rc.severity}</span></p>
                      {rc.status === 'pending' && (
                        <button onClick={() => { playAlertSound('dispatch'); toast.success(`Scheduled repair: ${rc.id}`); }}
                          className="mt-2 w-full py-1.5 rounded-lg bg-accent/20 border border-accent/30 text-accent text-[10px] font-display hover:bg-accent/30 transition-colors">
                          SCHEDULE REPAIR
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="glass-card p-4">
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-3">Road Condition Heatmap</h3>
                  <HeatmapGrid />
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'alerts' && (
            <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-5">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-sm font-bold text-foreground">SMART INFRASTRUCTURE ALERTS</h3>
                  <span className="ml-auto text-[9px] font-display text-primary px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10">{SMART_SENSORS} SENSORS</span>
                </div>
                <div className="space-y-3">
                  {smartAlerts.map((alert, i) => (
                    <motion.div key={alert.id} className={`p-4 rounded-2xl border ${alert.severity === 'critical' ? 'border-destructive/40 bg-destructive/5 critical-glow' : alert.severity === 'high' ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-secondary/10'}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ x: 4 }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display text-xs font-bold text-foreground">{alert.type}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${alert.severity === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' : 'bg-accent/20 text-accent border-accent/30'}`}>{alert.severity}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{alert.location}</p>
                      <div className="flex items-center gap-2 mt-1 text-[9px]">
                        <span className="text-info">Sensor: {alert.sensor}</span>
                        <span className="text-muted-foreground">• {alert.time}</span>
                      </div>
                      <p className="text-[10px] text-primary mt-1">→ {alert.action}</p>
                      <button onClick={() => { playAlertSound('dispatch'); toast.success(`Crew dispatched for ${alert.id}`); }}
                        className="mt-2 w-full py-1.5 rounded-lg bg-accent/20 border border-accent/30 text-accent text-[10px] font-display hover:bg-accent/30 transition-colors">
                        DISPATCH REPAIR CREW
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'health' && (
            <motion.div key="health" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-5">Road Infrastructure Health Index</h3>
                <div className="space-y-3">
                  {infrastructureHealth.map((road, i) => (
                    <motion.div key={road.road} className="p-4 rounded-2xl border border-border/50 bg-secondary/10"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ x: 4 }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-display text-xs font-bold text-foreground">{road.road}</span>
                          <span className="text-[9px] text-muted-foreground ml-2">{road.km}km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold text-foreground">{road.score}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${statusColor[road.status]}`}>{road.status}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary/50">
                        <motion.div
                          className={`h-2 rounded-full ${road.score > 75 ? 'bg-primary' : road.score > 50 ? 'bg-accent' : 'bg-destructive'}`}
                          initial={{ width: 0 }} animate={{ width: `${road.score}%` }} transition={{ delay: 0.4 + i * 0.08 }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[9px] text-muted-foreground">
                        <span>{road.issues} active issues</span>
                        <button onClick={() => { playAlertSound('low'); toast.info(`Inspection queued: ${road.road}`); }}
                          className="px-2 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                          Schedule Inspection
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'crews' && (
            <motion.div key="crews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-5">Maintenance Crew Dispatch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  {maintenanceCrew.map((crew, i) => (
                    <motion.div key={crew.id} className={`p-4 rounded-2xl border ${crew.status === 'active' ? 'border-primary/30 bg-primary/5 ai-glow' : 'border-accent/30 bg-accent/5'}`}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display text-xs font-bold text-foreground">{crew.name}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${crew.status === 'active' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-accent/20 text-accent border-accent/30'}`}>{crew.status}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{crew.task}</p>
                      <div className="flex items-center justify-between mt-2 text-[9px]">
                        <span className="text-muted-foreground">{crew.location}</span>
                        <span className="text-info font-display">{crew.eta}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-3">Road Inspectors</h4>
                  {roadsWorkers.map(w => (
                    <div key={w.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/20 border border-border/50 mb-2">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${w.status === 'online' ? 'bg-primary' : 'bg-accent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground font-medium truncate">{w.name}</p>
                        <p className="text-[9px] text-muted-foreground">{w.role} • {w.location}</p>
                      </div>
                      <p className="font-display text-xs text-accent shrink-0">{w.points} pts</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
