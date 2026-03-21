import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import SmartProvincialMap from '@/components/SmartProvincialMap';
import { mockAlerts, mockWorkers } from '@/data/mockData';
import { playAlertSound, unlockAudio } from '@/lib/alertSound';
import {
  Heart, Brain, Activity, CreditCard, Shield, Users, TrendingUp,
  AlertTriangle, Zap, BarChart3, Stethoscope, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const CLAIMS_TOTAL = 8700000;
const CLAIMS_AUTO = 94;
const BEDS_AVAILABLE = 97;
const OUTBREAK_RISK = 'LOW';

const outbreakMonitor = [
  { disease: 'Cholera', region: 'Mafeteng Area', cases: 2, trend: 'stable', risk: 'low' },
  { disease: 'Malaria', region: "Mohale's Hoek District", cases: 14, trend: 'up', risk: 'medium' },
  { disease: 'COVID variants', region: 'National', cases: 87, trend: 'down', risk: 'low' },
  { disease: 'Meningitis', region: 'Maseru', cases: 0, trend: 'stable', risk: 'low' },
];

const medAI = [
  { id: 'M-AI-01', alert: 'Cardiac event cluster — Maseru North (3 in 2hrs)', severity: 'high', action: 'EMS + LMPS pre-deployed', time: '4m ago' },
  { id: 'M-AI-02', alert: 'Trauma surge predicted — A2 weekend mountain traffic', severity: 'medium', action: 'Extra trauma teams on standby', time: '12m ago' },
  { id: 'M-AI-03', alert: 'ICU capacity below 15% — Leribe Hospital', severity: 'critical', action: 'Patient rerouting activated', time: '27m ago' },
  { id: 'M-AI-04', alert: "Malaria uptick — Mohale's Hoek seasonal pattern", severity: 'medium', action: 'Community health alerts sent', time: '1h ago' },
];

const healthWorkers = mockWorkers.filter(w => w.department === 'health');

const hospitals = [
  { name: 'Queen Mamohato Memorial Hospital', beds: 42, total: 180, icu: 8, emergency: 12, status: 'available' },
  { name: 'Leribe Hospital', beds: 12, total: 140, icu: 3, emergency: 6, status: 'limited' },
  { name: 'Mafeteng Government Hospital', beds: 28, total: 80, icu: 12, emergency: 8, status: 'available' },
  { name: "Mohale's Hoek Hospital", beds: 15, total: 60, icu: 5, emergency: 4, status: 'available' },
];

const autoClaims = [
  { id: 'H-2847', patient: 'N. Molapo', amount: 'M 4,200', med: 'LNHIS', status: 'approved', diagnosis: 'Hypertension', time: '5m ago' },
  { id: 'H-2846', patient: 'D. Nthabiseng', amount: 'M 12,400', med: 'LNHIS', status: 'approved', diagnosis: 'Cardiac Catheterization', time: '22m ago' },
  { id: 'H-2845', patient: 'L. Motsoari', amount: 'M 890', med: 'LNHIS', status: 'review', diagnosis: 'Malaria Screening', time: '41m ago' },
];

export default function HealthDashboard() {
  const [tab, setTab] = useState<'overview' | 'ai' | 'claims' | 'outbreak'>('overview');

  useEffect(() => {
    document.addEventListener('click', unlockAudio, { once: true });
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        playAlertSound('high');
        toast.error('🏥 HEALTH ALERT — ICU capacity critical', { duration: 4000 });
      }
    }, 22000);
    return () => { clearInterval(interval); document.removeEventListener('click', unlockAudio); };
  }, []);

  const tabs = [
    { key: 'overview', label: 'Live Command', icon: Activity },
    { key: 'ai', label: 'AI Alerts', icon: Brain },
    { key: 'claims', label: 'Auto-Claims', icon: CreditCard },
    { key: 'outbreak', label: 'Outbreak Monitor', icon: AlertTriangle },
  ];

  return (
    <DashboardLayout title="Health — Medical Intelligence" deptBg="dept-bg-health">
      <div className="space-y-5">

        {/* Hero */}
        <motion.div className="glass-card p-5 relative overflow-hidden" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/15 via-transparent to-green-800/8 pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(145 65% 38% / 0.25), hsl(145 65% 38% / 0.1))' }}
                animate={{ boxShadow: ['0 0 0 0 hsl(145 65% 38% / 0.4)', '0 0 30px 8px hsl(145 65% 38% / 0.1)', '0 0 0 0 hsl(145 65% 38% / 0.4)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Heart className="w-7 h-7 text-primary" />
              </motion.div>
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wider">HEALTH — MEDICAL INTELLIGENCE</h1>
                <p className="text-[10px] text-muted-foreground font-display mt-0.5">AI-DIAGNOSTICS • AUTO-CLAIMS • OUTBREAK EARLY WARNING</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: `R${(CLAIMS_TOTAL / 1000000).toFixed(1)}M claims`, color: 'text-accent bg-accent/10 border-accent/20' },
                { label: `${CLAIMS_AUTO}% auto-approved`, color: 'text-primary bg-primary/10 border-primary/20' },
                { label: `${BEDS_AVAILABLE} beds free`, color: 'text-info bg-info/10 border-info/20' },
                { label: `Outbreak: ${OUTBREAK_RISK}`, color: 'text-primary bg-primary/10 border-primary/20' },
              ].map(({ label, color }) => (
                <span key={label} className={`px-3 py-1.5 rounded-full border text-[10px] font-display ${color}`}>{label}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Medical Alerts', value: mockAlerts.filter(a => a.type === 'medical').length, icon: Stethoscope, color: 'text-destructive' },
            { label: 'Beds Available', value: BEDS_AVAILABLE, icon: Shield, color: 'text-primary' },
            { label: 'Claims (R)', value: `${(CLAIMS_TOTAL / 1000000).toFixed(1)}M`, icon: CreditCard, color: 'text-accent' },
            { label: 'AI Predictions', value: medAI.length, icon: Brain, color: 'text-info' },
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-display transition-all ${tab === t.key ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>
              <t.icon className="w-3 h-3" />{t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <SmartProvincialMap filterDept="health" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-4 space-y-3">
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Hospital Capacity</h3>
                  {hospitals.map((h, i) => {
                    const pct = Math.round(h.beds / h.total * 100);
                    return (
                      <motion.div key={h.name} className={`p-3 rounded-xl border ${h.status === 'limited' ? 'border-accent/30 bg-accent/5' : 'border-primary/20 bg-primary/5'}`}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-foreground font-medium">{h.name}</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${h.status === 'available' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-accent/20 text-accent border-accent/30'}`}>{h.status}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground">{h.beds} beds available</p>
                        <div className="h-1 rounded-full bg-secondary/50 mt-1">
                          <div className={`h-1 rounded-full ${h.status === 'available' ? 'bg-primary' : 'bg-accent'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="glass-card p-4 space-y-2">
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Health Staff</h3>
                  {healthWorkers.map(w => (
                    <div key={w.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/20 border border-border/50">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${w.status === 'standby' ? 'bg-accent' : 'bg-primary'}`} />
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

          {tab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-5">
                  <Brain className="w-5 h-5 text-info" />
                  <h3 className="font-display text-sm font-bold text-foreground">AI MEDICAL ALERT SYSTEM</h3>
                </div>
                <div className="space-y-3">
                  {medAI.map((item, i) => (
                    <motion.div key={item.id} className={`p-4 rounded-2xl border ${item.severity === 'critical' ? 'border-destructive/40 bg-destructive/5 critical-glow' : item.severity === 'high' ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-secondary/10'}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ x: 4 }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${item.severity === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' : item.severity === 'high' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-info/20 text-info border-info/30'}`}>{item.severity}</span>
                        <span className="text-[9px] text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-xs text-foreground font-medium">{item.alert}</p>
                      <p className="text-[10px] text-primary mt-1">→ {item.action}</p>
                      <button onClick={() => { playAlertSound('dispatch'); toast.success(`Response deployed: ${item.id}`); }}
                        className="mt-2 w-full py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary text-[10px] font-display hover:bg-primary/30 transition-colors">
                        ACKNOWLEDGE & DEPLOY
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'claims' && (
            <motion.div key="claims" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">MEDICAL AUTO-CLAIMS</h3>
                      <p className="text-[10px] text-muted-foreground">AI-verified • {CLAIMS_AUTO}% auto-approval • Real-time processing</p>
                    </div>
                  </div>
                  <p className="font-display text-xl font-bold text-accent">R{(CLAIMS_TOTAL / 1000000).toFixed(1)}M</p>
                </div>
                <div className="space-y-3">
                  {autoClaims.map((c, i) => (
                    <motion.div key={c.id} className="p-4 rounded-2xl border border-border/50 bg-secondary/10"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display text-xs font-bold text-foreground">{c.id} — {c.med}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold text-accent">{c.amount}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${c.status === 'approved' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-accent/20 text-accent border-accent/30'}`}>
                            {c.status === 'approved' ? '✓ AUTO' : '⏳ REVIEW'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-foreground">{c.patient} — {c.diagnosis}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{c.time}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'outbreak' && (
            <motion.div key="outbreak" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-widest">Outbreak Early Warning System</h3>
                  <span className="ml-auto px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-display text-primary">AI MONITORING</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {outbreakMonitor.map((item, i) => (
                    <motion.div key={item.disease} className={`p-4 rounded-2xl border ${item.risk === 'medium' ? 'border-accent/30 bg-accent/5' : 'border-primary/20 bg-primary/5'}`}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display text-xs font-bold text-foreground">{item.disease}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-display uppercase ${item.risk === 'medium' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-primary/20 text-primary border-primary/30'}`}>{item.risk}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{item.region}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-display text-lg font-bold text-foreground">{item.cases} <span className="text-sm text-muted-foreground">cases</span></span>
                        <span className={`text-[10px] font-display ${item.trend === 'up' ? 'text-destructive' : item.trend === 'down' ? 'text-primary' : 'text-muted-foreground'}`}>
                          {item.trend === 'up' ? '↑ Rising' : item.trend === 'down' ? '↓ Declining' : '→ Stable'}
                        </span>
                      </div>
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
