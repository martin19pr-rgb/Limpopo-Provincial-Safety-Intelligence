import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import SmartProvincialMap from '@/components/SmartProvincialMap';
import { mockAlerts, mockWorkers } from '@/data/mockData';
import { playAlertSound, unlockAudio } from '@/lib/alertSound';
import {
  Shield, Brain, Cpu, Camera, Radio, Eye, AlertTriangle, CheckCircle,
  Zap, Lock, Fingerprint, Activity, TrendingUp, Users, Crosshair,
  Drone, Scan, BarChart3, CircleAlert, Siren
} from 'lucide-react';
import { toast } from 'sonner';

const CRIME_STREAMS = 7423;
const AI_ACCURACY = 87;
const BLOCKCHAIN_OFFICERS = 500;
const BLOCKCHAIN_COMPLIANCE = 87;

const preCrimeAlerts = [
  { id: 'PC-001', zone: 'Maseru CBD Market', risk: 94, type: 'Armed Robbery', eta: '12 min', confidence: 91, officers: 3 },
  { id: 'PC-002', zone: 'A1 KM 12 Corridor', risk: 87, type: 'Carjacking', eta: '8 min', confidence: 85, officers: 2 },
  { id: 'PC-003', zone: 'Leribe Night Market', risk: 76, type: 'Gang Activity', eta: '22 min', confidence: 79, officers: 4 },
  { id: 'PC-004', zone: 'Maseru Old Town', risk: 68, type: 'Pickpocketing', eta: '35 min', confidence: 72, officers: 1 },
];

const lprMatches = [
  { plate: 'LSO 421 A', status: 'STOLEN', location: 'A1 N/B KM 12', threat: 'critical', time: '2m ago' },
  { plate: 'LSO 882 B', status: 'WANTED', location: 'A2 Teyateyaneng', threat: 'high', time: '7m ago' },
  { plate: 'LSO 339 C', status: 'FLAGGED', location: 'Maseru City Centre', threat: 'medium', time: '14m ago' },
];

const droneFeed = [
  { id: 'DR-01', status: 'airborne', location: 'A1 Highway Sector 3', battery: 78, altitude: '120m', task: 'Incident surveillance' },
  { id: 'DR-02', status: 'airborne', location: 'Maseru CBD Market', battery: 91, altitude: '85m', task: 'Pre-crime patrol' },
  { id: 'DR-03', status: 'standby', location: 'Maseru LMPS HQ Pad', battery: 100, altitude: '0m', task: 'On standby' },
];

const activeOfficers = mockWorkers.filter(w => w.department === 'saps');

export default function SAPSDashboard() {
  const [tab, setTab] = useState<'overview' | 'precrime' | 'blockchain' | 'lpr' | 'drones'>('overview');
  const [aiReport, setAiReport] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [alertCount, setAlertCount] = useState(preCrimeAlerts.length);
  const prevAlertCount = useRef(alertCount);

  useEffect(() => {
    document.addEventListener('click', unlockAudio, { once: true });
    return () => document.removeEventListener('click', unlockAudio);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll > 0.85) {
        setAlertCount(c => {
          const next = c + 1;
          playAlertSound('critical');
          toast.error('🔴 AI PRE-CRIME ALERT — New high-risk zone detected', { duration: 4000 });
          return next;
        });
      } else if (roll > 0.7) {
        playAlertSound('ai');
        toast.info('🧠 AI ANALYSIS — Crime pattern updated', { duration: 3000 });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const generateAIReport = () => {
    setGeneratingReport(true);
    setAiReport('');
    const report = `LSISTH AI CRISIS REPORT — LMPS LESOTHO\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nGenerated: ${new Date().toLocaleString('en-LS')}\nClassification: RESTRICTED\n\n[AI ANALYSIS — 87% ACCURACY]\nCurrent threat level: ELEVATED\nActive pre-crime predictions: ${preCrimeAlerts.length}\nHighest risk zone: Maseru CBD Market (94%)\n\n[BLOCKCHAIN STATUS]\n${BLOCKCHAIN_OFFICERS} officers tracked on-chain\nCompliance rate: ${BLOCKCHAIN_COMPLIANCE}%\nLast sync: ${new Date().toLocaleTimeString('en-LS')}\n\n[LPR INTELLIGENCE]\n${lprMatches.length} vehicles flagged in last hour\n1 stolen vehicle intercepted — A1 KM 12\n\n[DRONE NETWORK]\n2/3 drones airborne\nTotal surveillance coverage: 47km²\n\n[RECOMMENDATION]\nDeploy Flying Squad to Maseru CBD sector.\nActivate green-wave traffic for emergency response.\nAlert EMS — standby for possible medical response.`;
    let i = 0;
    const interval = setInterval(() => {
      setAiReport(report.slice(0, i));
      i += 3;
      if (i >= report.length) { clearInterval(interval); setGeneratingReport(false); }
    }, 20);
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'precrime', label: 'AI Pre-Crime', icon: Brain },
    { key: 'blockchain', label: 'Blockchain', icon: Lock },
    { key: 'lpr', label: 'LPR + Bodycam', icon: Camera },
    { key: 'drones', label: 'Drone Net', icon: Crosshair },
  ];

  return (
    <DashboardLayout title="LMPS — AI Command Centre" deptBg="dept-bg-saps">
      <div className="space-y-5">

        {/* Hero header */}
        <motion.div
          className="glass-card p-5 relative overflow-hidden scan-line"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-blue-800/10 pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, hsl(210 80% 42% / 0.3), hsl(195 100% 50% / 0.2))' }}
                animate={{ boxShadow: ['0 0 0 0 hsl(210 80% 42% / 0.4)', '0 0 30px 8px hsl(210 80% 42% / 0.1)', '0 0 0 0 hsl(210 80% 42% / 0.4)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Shield className="w-7 h-7 text-info" />
              </motion.div>
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wider">SAPS — LIMPOPO COMMAND</h1>
                <p className="text-[10px] text-muted-foreground font-display mt-0.5">AI-DRIVEN • BLOCKCHAIN-VERIFIED • DRONE-ENABLED</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Brain, label: `AI ${AI_ACCURACY}%`, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
                { icon: Cpu, label: `${CRIME_STREAMS.toLocaleString()} streams`, color: 'text-info', bg: 'bg-info/10 border-info/20' },
                { icon: Lock, label: `${BLOCKCHAIN_OFFICERS} on-chain`, color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
                { icon: Camera, label: 'LPR LIVE', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
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

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {[
            { label: 'Pre-Crime Alerts', value: alertCount, icon: Brain, color: 'text-destructive', glow: 'critical-glow' },
            { label: 'Officers On-Chain', value: BLOCKCHAIN_OFFICERS, icon: Lock, color: 'text-accent', glow: '' },
            { label: 'AI Accuracy', value: `${AI_ACCURACY}%`, icon: Cpu, color: 'text-primary', glow: 'ai-glow' },
            { label: 'Data Streams', value: CRIME_STREAMS.toLocaleString(), icon: Activity, color: 'text-info', glow: 'info-glow' },
            { label: 'Drones Airborne', value: '2/3', icon: Crosshair, color: 'text-primary', glow: '' },
            { label: 'Compliance', value: `${BLOCKCHAIN_COMPLIANCE}%`, icon: TrendingUp, color: 'text-primary', glow: '' },
          ].map(({ label, value, icon: Icon, color, glow }) => (
            <motion.div
              key={label}
              className={`glass-card p-4 ${glow}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
            >
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
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-display transition-all ${
                tab === t.key ? 'bg-info/20 text-info border border-info/30' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-3 h-3" />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <SmartProvincialMap filterDept="saps" />

              {/* Active incidents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CircleAlert className="w-4 h-4 text-destructive" />
                    <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Active Incidents</h3>
                  </div>
                  {mockAlerts.filter(a => a.status !== 'resolved').map(alert => (
                    <motion.div
                      key={alert.id}
                      className={`p-3 rounded-xl border ${alert.severity === 'critical' ? 'border-destructive/30 bg-destructive/5' : 'border-accent/20 bg-accent/5'}`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-bold text-foreground">{alert.id}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-display uppercase ${alert.severity === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{alert.location}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] text-info font-display">ETA {alert.eta}</span>
                        <span className="text-[9px] text-muted-foreground">{alert.responders.length} responders</span>
                        {alert.sensorConfirmed && <span className="text-[9px] text-primary">✓ SENSOR</span>}
                      </div>
                      <button
                        onClick={() => { playAlertSound('dispatch'); toast.success(`SAPS dispatch confirmed: ${alert.id}`); }}
                        className="mt-2 w-full py-1.5 rounded-lg bg-info/20 border border-info/30 text-info text-[10px] font-display hover:bg-info/30 transition-colors"
                      >
                        DISPATCH FLYING SQUAD
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="glass-card p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-info" />
                    <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Officer Tracking — PoW</h3>
                  </div>
                  {activeOfficers.map(w => (
                    <div key={w.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/20 border border-border/50">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${w.status === 'responding' ? 'bg-destructive pulse-live' : w.status === 'standby' ? 'bg-accent' : 'bg-primary'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground font-medium truncate">{w.name}</p>
                        <p className="text-[9px] text-muted-foreground">{w.role} • {w.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-xs text-accent">{w.points} pts</p>
                        {w.bodycamActive && <p className="text-[9px] text-info">📷 CAM</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'precrime' && (
            <motion.div key="precrime" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="glass-card p-5 relative overflow-hidden">
                <div className="absolute inset-0 holographic pointer-events-none rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                      <Brain className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">AI PRE-CRIME PREDICTION ENGINE</h3>
                      <p className="text-[10px] text-muted-foreground">{CRIME_STREAMS.toLocaleString()} live data streams • {AI_ACCURACY}% accuracy</p>
                    </div>
                    <motion.div
                      className="ml-auto px-3 py-1 rounded-full bg-primary/20 border border-primary/30"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-[9px] font-display text-primary">MODEL ACTIVE</span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {preCrimeAlerts.map((alert, i) => (
                      <motion.div
                        key={alert.id}
                        className={`p-4 rounded-2xl border relative overflow-hidden ${
                          alert.risk > 85 ? 'border-destructive/40 bg-destructive/8' : alert.risk > 70 ? 'border-accent/40 bg-accent/8' : 'border-primary/30 bg-primary/8'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-display text-[10px] font-bold text-muted-foreground">{alert.id}</span>
                          <span className={`text-sm font-display font-bold ${alert.risk > 85 ? 'text-destructive' : alert.risk > 70 ? 'text-accent' : 'text-primary'}`}>
                            {alert.risk}% RISK
                          </span>
                        </div>
                        <h4 className="font-display text-xs font-bold text-foreground">{alert.zone}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{alert.type} predicted</p>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[9px]">
                            <span className="text-muted-foreground">AI Confidence</span>
                            <span className="text-primary font-display">{alert.confidence}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary/50">
                            <motion.div
                              className="h-1.5 rounded-full bg-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${alert.confidence}%` }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[9px] text-info font-display">PREDICTED IN {alert.eta}</span>
                          <button
                            onClick={() => { playAlertSound('dispatch'); toast.success(`Pre-emptive dispatch to ${alert.zone}`); }}
                            className="px-3 py-1 rounded-lg bg-info/20 border border-info/30 text-info text-[10px] font-display hover:bg-info/30"
                          >
                            DISPATCH {alert.officers} UNITS
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Report Generator */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Generative AI Crisis Report</h3>
                  </div>
                  <button
                    onClick={generateAIReport}
                    disabled={generatingReport}
                    className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-[10px] font-display hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {generatingReport ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Cpu className="w-3 h-3" /></motion.div> : <Brain className="w-3 h-3" />}
                    {generatingReport ? 'GENERATING...' : 'GENERATE REPORT'}
                  </button>
                </div>
                {aiReport && (
                  <motion.pre
                    className="text-[10px] font-display text-primary/90 whitespace-pre-wrap leading-relaxed p-4 rounded-xl bg-primary/5 border border-primary/20 max-h-64 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {aiReport}
                  </motion.pre>
                )}
              </div>
            </motion.div>
          )}

          {tab === 'blockchain' && (
            <motion.div key="blockchain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-5">
                  <Lock className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">BLOCKCHAIN OFFICER TRACKING</h3>
                    <p className="text-[10px] text-muted-foreground">{BLOCKCHAIN_OFFICERS} officers • {BLOCKCHAIN_COMPLIANCE}% compliance • Tamper-proof</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Total Officers', value: BLOCKCHAIN_OFFICERS, color: 'text-foreground' },
                    { label: 'Compliant', value: Math.floor(BLOCKCHAIN_OFFICERS * BLOCKCHAIN_COMPLIANCE / 100), color: 'text-primary' },
                    { label: 'Non-Compliant', value: Math.ceil(BLOCKCHAIN_OFFICERS * (100 - BLOCKCHAIN_COMPLIANCE) / 100), color: 'text-destructive' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="glass-panel rounded-xl p-4 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {activeOfficers.map((w, i) => {
                    const hash = `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}...${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
                    const compliant = w.standbyCompliance >= 85;
                    return (
                      <motion.div
                        key={w.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-secondary/10"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <Lock className={`w-3.5 h-3.5 shrink-0 ${compliant ? 'text-primary' : 'text-destructive'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground font-medium truncate">{w.name}</p>
                          <p className="text-[9px] font-display text-muted-foreground font-mono truncate">{hash}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-[10px] font-display font-bold ${compliant ? 'text-primary' : 'text-destructive'}`}>
                            {w.standbyCompliance}%
                          </p>
                          <p className="text-[9px] text-muted-foreground">{compliant ? '✓ VERIFIED' : '✗ FLAGGED'}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'lpr' && (
            <motion.div key="lpr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Scan className="w-4 h-4 text-info" />
                    <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">LPR — Licence Plate Recognition</h3>
                  </div>
                  <div className="space-y-3">
                    {lprMatches.map((match, i) => (
                      <motion.div
                        key={match.plate}
                        className={`p-3 rounded-xl border ${match.threat === 'critical' ? 'border-destructive/40 bg-destructive/8 critical-glow' : match.threat === 'high' ? 'border-accent/40 bg-accent/8' : 'border-border'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold text-foreground tracking-widest">{match.plate}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-display uppercase border ${match.threat === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' : match.threat === 'high' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-secondary text-muted-foreground border-border'}`}>
                            {match.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{match.location}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] text-muted-foreground">{match.time}</span>
                          <button
                            onClick={() => { playAlertSound('high'); toast.success(`Intercept alert sent for ${match.plate}`); }}
                            className="px-2 py-1 rounded-lg bg-info/20 text-info text-[9px] font-display border border-info/30 hover:bg-info/30"
                          >
                            INTERCEPT
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Bodycam Live Sync</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {activeOfficers.filter(w => w.bodycamActive).map((w, i) => (
                      <motion.div
                        key={w.id}
                        className="relative rounded-xl overflow-hidden bg-black border border-primary/20 aspect-video"
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="w-8 h-8 text-primary/40 mx-auto mb-1" />
                            <p className="text-[8px] text-muted-foreground font-display">LIVE FEED</p>
                          </div>
                        </div>
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-destructive" animate={{ opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                          <span className="text-[8px] font-display text-destructive">REC</span>
                        </div>
                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                          <p className="text-[8px] text-white/80 font-display truncate">{w.name}</p>
                        </div>
                      </motion.div>
                    ))}
                    {activeOfficers.filter(w => !w.bodycamActive).slice(0, 2).map((w, i) => (
                      <div key={w.id} className="relative rounded-xl overflow-hidden bg-secondary/30 border border-border aspect-video flex items-center justify-center">
                        <p className="text-[8px] text-muted-foreground font-display">CAM OFFLINE</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'drones' && (
            <motion.div key="drones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Crosshair className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-widest">Provincial Drone Network</h3>
                  <span className="ml-auto text-[10px] font-display text-primary px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10">
                    2/3 AIRBORNE
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {droneFeed.map((drone, i) => (
                    <motion.div
                      key={drone.id}
                      className={`p-4 rounded-2xl border ${drone.status === 'airborne' ? 'border-primary/30 bg-primary/5 ai-glow' : 'border-border bg-secondary/10'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display text-sm font-bold text-foreground">{drone.id}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${drone.status === 'airborne' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border'}`}>
                          {drone.status}
                        </span>
                      </div>
                      {drone.status === 'airborne' && (
                        <div className="aspect-video rounded-xl bg-black border border-primary/20 mb-3 flex items-center justify-center relative overflow-hidden">
                          <motion.div
                            className="w-6 h-6 border-2 border-primary rounded-full"
                            animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                          <div className="absolute top-2 left-2 text-[8px] font-display text-primary/80">{drone.altitude} ALT</div>
                          <div className="absolute bottom-2 left-2 text-[8px] font-display text-white/60">{drone.location}</div>
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground">{drone.task}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-[9px] text-muted-foreground">Battery</span>
                        <span className={`font-display text-[10px] ${drone.battery > 60 ? 'text-primary' : 'text-destructive'}`}>{drone.battery}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-secondary/50 mt-1">
                        <div className={`h-1 rounded-full ${drone.battery > 60 ? 'bg-primary' : 'bg-destructive'}`} style={{ width: `${drone.battery}%` }} />
                      </div>
                      <button
                        onClick={() => { playAlertSound('dispatch'); toast.success(`${drone.id} command sent`); }}
                        className="mt-3 w-full py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary text-[10px] font-display hover:bg-primary/30 transition-colors"
                      >
                        {drone.status === 'airborne' ? 'REDIRECT DRONE' : 'LAUNCH DRONE'}
                      </button>
                    </motion.div>
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
