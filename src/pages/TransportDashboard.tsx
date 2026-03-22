import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import SmartProvincialMap from '@/components/SmartProvincialMap';
import LEDBillboard from '@/components/LEDBillboard';
import TrafficLightControl from '@/components/TrafficLightControl';
import EcosystemIntegration from '@/components/EcosystemIntegration';
import { trafficSigns } from '@/data/mockData';
import { playAlertSound, unlockAudio } from '@/lib/alertSound';
import {
  Cpu, Radio, Monitor, TrafficCone, Zap, Activity, Brain, BarChart3,
  Gauge, ArrowUpDown, AlertTriangle, Network, Layers, Map
} from 'lucide-react';
import { toast } from 'sonner';

const AI_PREDICTIONS_ACTIVE = 24;
const GREEN_WAVES_ACTIVE = 7;
const LIDAR_SENSORS = 8;
const SIGNAL_OVERRIDE_COUNT = 3;

const aiPredictions = [
  { id: 'AI-T01', road: 'A1 — KM 8–18 Maseru', prediction: 'Traffic surge in 14 min', action: 'Green wave active', confidence: 91, severity: 'high' },
  { id: 'AI-T02', road: 'A2 Mountain Pass', prediction: 'Fog advisory — reduce speed', action: 'LED sign updated', confidence: 88, severity: 'medium' },
  { id: 'AI-T03', road: 'Kingsway CBD Ring Road', prediction: 'School rush peak — 15:00', action: 'Signal re-timed', confidence: 94, severity: 'medium' },
  { id: 'AI-T04', road: 'A2 Highland Bridge', prediction: 'Flood risk — bridge closure', action: 'Road closed signal sent', confidence: 96, severity: 'critical' },
  { id: 'AI-T05', road: 'A3 Teyateyaneng', prediction: 'Construction overrun +2hrs', action: 'Diversion route updated', confidence: 82, severity: 'low' },
];

const signalOverrides = [
  { intersection: 'A1 / Kingsway Off-Ramp', reason: 'Emergency EMS corridor', duration: '8 min', status: 'active', color: 'green' },
  { intersection: 'A2 Semonkong Pass', reason: 'Accident clearance', duration: '22 min', status: 'active', color: 'red' },
  { intersection: 'Kingsway / Pioneer Rd', reason: 'VIP motorcade', duration: '4 min', status: 'pending', color: 'amber' },
];

const sensorReadings = [
  { id: 'L-A1-12', name: 'LiDAR A1 KM 12', type: 'Crash Detection', speed: '112 km/h avg', volume: '847 v/h', status: 'online', alert: true },
  { id: 'L-A2-42', name: 'LiDAR A2 KM 42', type: 'Speed Monitor', speed: '68 km/h avg', volume: '322 v/h', status: 'online', alert: false },
  { id: 'A-A2-18', name: 'Acoustic A2 Bridge', type: 'Flood Level', speed: 'N/A', volume: 'Flood: 2.1m', status: 'alert', alert: true },
  { id: 'L-A3-4', name: 'LiDAR A3 KM 4', type: 'Impact Detection', speed: '91 km/h avg', volume: '512 v/h', status: 'online', alert: false },
  { id: 'L-A4-8', name: 'LiDAR A4 KM 8', type: 'Construction Zone', speed: '32 km/h avg', volume: '208 v/h', status: 'online', alert: false },
  { id: 'A-A1-22', name: 'Acoustic A1 KM 22', type: 'Speed Monitor', speed: '138 km/h peak', volume: '1,241 v/h', status: 'online', alert: true },
];

export default function TransportDashboard() {
  const [tab, setTab] = useState<'overview' | 'ai' | 'signals' | 'sensors' | 'led'>('overview');

  useEffect(() => {
    document.addEventListener('click', unlockAudio, { once: true });
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        playAlertSound('medium');
        toast.warning('🚦 AI TRAFFIC ALERT — Signal override required', { duration: 3500 });
      }
    }, 20000);
    return () => { clearInterval(interval); document.removeEventListener('click', unlockAudio); };
  }, []);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Map },
    { key: 'ai', label: 'AI Predictions', icon: Brain },
    { key: 'signals', label: 'Signal Control', icon: TrafficCone },
    { key: 'sensors', label: 'LiDAR Sensors', icon: Radio },
    { key: 'led', label: 'LED Billboards', icon: Monitor },
  ];

  return (
    <DashboardLayout title="Transport — Traffic Intelligence" deptBg="dept-bg-transport">
      <div className="space-y-5">

        {/* Hero */}
        <motion.div className="glass-card p-5 relative overflow-hidden" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/15 via-transparent to-yellow-800/8 pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(43 96% 52% / 0.25), hsl(43 96% 52% / 0.1))' }}
                animate={{ boxShadow: ['0 0 0 0 hsl(43 96% 52% / 0.4)', '0 0 30px 8px hsl(43 96% 52% / 0.1)', '0 0 0 0 hsl(43 96% 52% / 0.4)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Cpu className="w-7 h-7 text-accent" />
              </motion.div>
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wider">TRAFFIC INFRASTRUCTURE COMMAND</h1>
                <p className="text-[10px] text-muted-foreground font-display mt-0.5">AI-ADAPTIVE • LIDAR FUSION • GREEN-WAVE OVERRIDE</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: `${AI_PREDICTIONS_ACTIVE} AI active`, color: 'text-primary bg-primary/10 border-primary/20' },
                { label: `${GREEN_WAVES_ACTIVE} green waves`, color: 'text-primary bg-primary/10 border-primary/20' },
                { label: `${LIDAR_SENSORS} LiDAR online`, color: 'text-info bg-info/10 border-info/20' },
                { label: `${SIGNAL_OVERRIDE_COUNT} overrides live`, color: 'text-accent bg-accent/10 border-accent/20' },
              ].map(({ label, color }) => (
                <span key={label} className={`px-3 py-1.5 rounded-full border text-[10px] font-display ${color}`}>{label}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'AI Predictions', value: AI_PREDICTIONS_ACTIVE, icon: Brain, color: 'text-primary' },
            { label: 'Green Waves', value: GREEN_WAVES_ACTIVE, icon: Zap, color: 'text-primary' },
            { label: 'LiDAR Sensors', value: `${LIDAR_SENSORS} online`, icon: Radio, color: 'text-info' },
            { label: 'Signal Overrides', value: SIGNAL_OVERRIDE_COUNT, icon: TrafficCone, color: 'text-accent' },
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
              <SmartProvincialMap filterDept="transport" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-3">Signal Override Status</h3>
                  <div className="space-y-3">
                    {signalOverrides.map((so, i) => (
                      <div key={so.intersection} className="p-3 rounded-xl border border-border/50 bg-secondary/10 flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full shrink-0 ${so.color === 'green' ? 'bg-primary' : so.color === 'red' ? 'bg-destructive' : 'bg-accent'} pulse-live`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground font-medium truncate">{so.intersection}</p>
                          <p className="text-[9px] text-muted-foreground">{so.reason} • {so.duration}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-display border ${so.status === 'active' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-accent/20 text-accent border-accent/30'}`}>
                          {so.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-4">
                  <TrafficLightControl />
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-5">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                    <Brain className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">AI TRAFFIC PREDICTION ENGINE</h3>
                    <p className="text-[10px] text-muted-foreground">{AI_PREDICTIONS_ACTIVE} active predictions • LiDAR + sensor fusion + satellite weather</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {aiPredictions.map((pred, i) => (
                    <motion.div key={pred.id} className={`p-4 rounded-2xl border ${pred.severity === 'critical' ? 'border-destructive/40 bg-destructive/5' : pred.severity === 'high' ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-secondary/10'}`}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ x: 4 }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display text-xs font-bold text-foreground">{pred.road}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-[10px] text-primary">{pred.confidence}%</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${pred.severity === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' : pred.severity === 'high' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-secondary text-muted-foreground border-border'}`}>
                            {pred.severity}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-foreground">{pred.prediction}</p>
                      <p className="text-[10px] text-primary mt-1">→ {pred.action}</p>
                      <div className="mt-2 h-1 rounded-full bg-secondary/50">
                        <motion.div className="h-1 rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${pred.confidence}%` }} transition={{ delay: 0.5 + i * 0.1 }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'signals' && (
            <motion.div key="signals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5 space-y-4">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Dynamic Signal Control Center</h3>
                <TrafficLightControl />
                <EcosystemIntegration />
              </div>
            </motion.div>
          )}

          {tab === 'sensors' && (
            <motion.div key="sensors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-4">LiDAR + Acoustic Sensor Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sensorReadings.map((sensor, i) => (
                    <motion.div key={sensor.id} className={`p-4 rounded-2xl border ${sensor.status === 'alert' ? 'border-destructive/40 bg-destructive/5 critical-glow' : sensor.alert ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-secondary/10'}`}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${sensor.status === 'alert' ? 'bg-destructive pulse-live' : 'bg-primary'}`} />
                          <span className="font-display text-[10px] font-bold text-foreground">{sensor.name}</span>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-display">{sensor.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[9px] mt-2">
                        <div><p className="text-muted-foreground">Speed</p><p className="font-display text-info font-bold">{sensor.speed}</p></div>
                        <div><p className="text-muted-foreground">Volume</p><p className="font-display text-accent font-bold">{sensor.volume}</p></div>
                      </div>
                      {sensor.alert && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-accent" />
                          <span className="text-[9px] text-accent font-display">ANOMALY DETECTED</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'led' && (
            <motion.div key="led" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest mb-4">LED Billboard Command — SANRAL</h3>
                <div className="space-y-3">
                  {trafficSigns.map(sign => <LEDBillboard key={sign.id} sign={sign} />)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
