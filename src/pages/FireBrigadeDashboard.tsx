import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import SmartProvincialMap from '@/components/SmartProvincialMap';
import { mockWorkers } from '@/data/mockData';
import { playAlertSound, unlockAudio } from '@/lib/alertSound';
import {
  Flame, Shield, AlertTriangle, Activity, Users, Clock,
  MapPin, Radio, CheckCircle, BarChart3, Brain, Zap
} from 'lucide-react';
import { toast } from 'sonner';

const UNITS_ACTIVE = 8;
const AVG_RESPONSE = '4m 12s';
const INCIDENTS_TODAY = 14;
const STATIONS = 7;

const activeIncidents = [
  { id: 'FI-001', type: 'Structure Fire', location: 'Polokwane Industrial Zone', severity: 'critical', unit: 'Fire Unit Polokwane-1', eta: '1m 30s', status: 'en route', casualties: 0, time: '3m ago' },
  { id: 'FI-002', type: 'Veld Fire', location: 'N1 Bushveld Corridor, KM 38', severity: 'high', unit: 'Fire Unit Tzaneen-2', eta: '12m', status: 'on scene', casualties: 0, time: '18m ago' },
  { id: 'FI-003', type: 'Vehicle Fire', location: 'N1 Highway KM 14', severity: 'medium', unit: 'Fire Unit Polokwane-3', eta: 'On scene', status: 'on scene', casualties: 1, time: '31m ago' },
  { id: 'FI-004', type: 'Hazmat Spill', location: 'Mokopane Industrial Rd', severity: 'high', unit: 'Fire Unit Mokopane-1', eta: '8m', status: 'dispatched', casualties: 0, time: '7m ago' },
];

const fireStations = [
  { name: 'Polokwane Central Fire Station', units: 4, available: 2, personnel: 28, status: 'operational', district: 'Polokwane' },
  { name: 'Tzaneen Fire Station', units: 3, available: 1, personnel: 16, status: 'operational', district: 'Greater Tzaneen' },
  { name: 'Mokopane Fire Post', units: 2, available: 2, personnel: 12, status: 'operational', district: 'Mokopane' },
  { name: 'Giyani Fire Station', units: 2, available: 1, personnel: 10, status: 'operational', district: 'Giyani' },
  { name: 'Lephalale Fire Post', units: 1, available: 0, personnel: 8, status: 'limited', district: 'Lephalale' },
  { name: 'Musina Fire Station', units: 2, available: 2, personnel: 10, status: 'operational', district: 'Musina' },
  { name: 'Thohoyandou Station', units: 2, available: 2, personnel: 12, status: 'operational', district: 'Thulamela' },
];

const fireUnits = [
  { id: 'FU-001', name: 'Fire Unit Polokwane-1', type: 'Heavy Tanker', status: 'responding', location: 'Polokwane Industrial Zone', water: '80%', foam: '90%' },
  { id: 'FU-002', name: 'Fire Unit Polokwane-2', type: 'Medium Pumper', status: 'standby', location: 'Polokwane Central Station', water: '100%', foam: '100%' },
  { id: 'FU-003', name: 'Fire Unit Tzaneen-2', type: 'Veld Fire Unit', status: 'on scene', location: 'N1 Bushveld Corridor', water: '45%', foam: '60%' },
  { id: 'FU-004', name: 'Fire Unit Mokopane-1', type: 'Hazmat Specialist', status: 'responding', location: 'En route Mokopane', water: '100%', foam: '100%' },
  { id: 'FU-005', name: 'Fire Unit Polokwane-3', type: 'Light Rescue', status: 'on scene', location: 'N1 Highway KM 14', water: '70%', foam: '75%' },
];

const riskZones = [
  { area: 'Polokwane Industrial Zone', risk: 'high', hazmat: true, lastInspection: '14 days ago', incidents30d: 3 },
  { area: 'N1 Bushveld Corridor', risk: 'critical', hazmat: false, lastInspection: 'Seasonal', incidents30d: 9 },
  { area: 'Tzaneen Market Area', risk: 'medium', hazmat: false, lastInspection: '30 days ago', incidents30d: 2 },
  { area: 'Mokopane Fuel Storage', risk: 'high', hazmat: true, lastInspection: '7 days ago', incidents30d: 1 },
  { area: 'Lephalale Power Station Vicinity', risk: 'high', hazmat: true, lastInspection: '10 days ago', incidents30d: 0 },
];

const fireWorkers = mockWorkers.filter(w => w.department === 'fire');

export default function FireBrigadeDashboard() {
  const [tab, setTab] = useState<'overview' | 'incidents' | 'stations' | 'units' | 'risk'>('overview');

  useEffect(() => {
    document.addEventListener('click', unlockAudio, { once: true });
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        playAlertSound('critical');
        toast.error('🔥 FIRE ALERT — New incident reported', { duration: 4000 });
      }
    }, 18000);
    return () => { clearInterval(interval); document.removeEventListener('click', unlockAudio); };
  }, []);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'incidents', label: 'Active Incidents', icon: Flame },
    { key: 'stations', label: 'Fire Stations', icon: Shield },
    { key: 'units', label: 'Fire Units', icon: Radio },
    { key: 'risk', label: 'Risk Zones', icon: AlertTriangle },
  ];

  const severityColor: Record<string, string> = {
    critical: 'text-destructive border-destructive/30 bg-destructive/10',
    high: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    medium: 'text-accent border-accent/30 bg-accent/10',
    low: 'text-muted-foreground border-border bg-secondary/30',
  };

  return (
    <DashboardLayout title="Limpopo Fire & Rescue Command" deptBg="dept-bg-ems">
      <div className="space-y-5">

        {/* Hero */}
        <motion.div className="glass-card p-5 relative overflow-hidden scan-line" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-red-800/10 pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(25 95% 55% / 0.3), hsl(0 85% 50% / 0.2))' }}
                animate={{ boxShadow: ['0 0 0 0 hsl(25 95% 55% / 0.4)', '0 0 30px 8px hsl(25 95% 55% / 0.1)', '0 0 0 0 hsl(25 95% 55% / 0.4)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Flame className="w-7 h-7 text-orange-400" />
              </motion.div>
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wider">LIMPOPO FIRE & RESCUE SERVICE</h1>
                <p className="text-[10px] text-muted-foreground font-display mt-0.5">LIMPOPO PROVINCE — AI-DISPATCHED • REAL-TIME COORDINATION</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Activity, label: `Response: ${AVG_RESPONSE}`, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
                { icon: Flame, label: `${INCIDENTS_TODAY} Today`, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
                { icon: Radio, label: `${UNITS_ACTIVE} Units Active`, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20' },
                { icon: Shield, label: `${STATIONS} Stations`, color: 'text-info', bg: 'bg-info/10 border-info/20' },
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
            { label: 'Active Incidents', value: activeIncidents.length, icon: Flame, color: 'text-destructive' },
            { label: 'Avg Response', value: AVG_RESPONSE, icon: Clock, color: 'text-accent' },
            { label: 'Units Deployed', value: UNITS_ACTIVE, icon: Radio, color: 'text-orange-400' },
            { label: 'Stations Online', value: STATIONS, icon: Shield, color: 'text-info' },
            { label: 'Incidents Today', value: INCIDENTS_TODAY, icon: Activity, color: 'text-primary' },
            { label: 'High Risk Zones', value: riskZones.filter(r => r.risk === 'high' || r.risk === 'critical').length, icon: AlertTriangle, color: 'text-destructive' },
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
                tab === t.key ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30' : 'text-muted-foreground border border-border hover:bg-secondary/50'
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SmartProvincialMap />
                <div className="space-y-3">
                  <div className="dashboard-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-orange-400" />
                      <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">AI Fire Intelligence</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { insight: 'N1 bushveld corridor veld fire expanding — wind speed 32km/h NW. Additional 2 units recommended urgently.', severity: 'critical' },
                        { insight: 'High fire weather index for next 48hrs — Limpopo bushveld areas on elevated alert. Lephalale district at risk.', severity: 'high' },
                        { insight: 'Polokwane industrial zone incident contained. 0 casualties. Structure loss: partial', severity: 'medium' },
                        { insight: 'All 7 fire stations within response threshold. Average crew readiness: 97%', severity: 'low' },
                      ].map((item, i) => (
                        <div key={i} className={`p-2.5 rounded-lg border text-[10px] leading-relaxed ${
                          item.severity === 'critical' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                          item.severity === 'high' ? 'bg-orange-400/10 border-orange-400/30 text-orange-400' :
                          item.severity === 'medium' ? 'bg-accent/10 border-accent/30 text-accent' :
                          'bg-primary/10 border-primary/30 text-primary'
                        }`}>
                          {item.insight}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="dashboard-card">
                    <h4 className="font-display text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Fire Personnel</h4>
                    {fireWorkers.map(worker => (
                      <div key={worker.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-xs font-display text-foreground">{worker.name}</p>
                          <p className="text-[9px] text-muted-foreground">{worker.role} • {worker.location}</p>
                        </div>
                        <span className={`text-[8px] font-display px-1.5 py-0.5 rounded ${
                          worker.status === 'online' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                        }`}>{worker.status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'incidents' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-destructive" />
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Active Incidents — Limpopo</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/30 text-[9px] text-destructive font-display">{activeIncidents.length} ACTIVE</span>
                </div>
                {activeIncidents.map(incident => (
                  <motion.div
                    key={incident.id}
                    className={`dashboard-card border-l-4 ${incident.severity === 'critical' ? 'border-l-destructive' : incident.severity === 'high' ? 'border-l-orange-400' : 'border-l-accent'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-display text-muted-foreground">{incident.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-display uppercase ${severityColor[incident.severity]}`}>{incident.severity}</span>
                          <span className="text-[8px] font-display text-muted-foreground">{incident.time}</span>
                        </div>
                        <p className="text-xs font-display font-bold text-foreground">{incident.type}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> {incident.location}
                        </p>
                        <p className="text-[10px] text-info mt-1">Unit: {incident.unit}</p>
                        {incident.casualties > 0 && (
                          <p className="text-[10px] text-destructive mt-0.5">⚠ {incident.casualties} casualty reported</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] text-muted-foreground">ETA: {incident.eta}</p>
                        <span className={`text-[8px] font-display px-1.5 py-0.5 rounded mt-1 block ${
                          incident.status === 'on scene' ? 'bg-primary/10 text-primary' :
                          incident.status === 'en route' ? 'bg-accent/10 text-accent' :
                          'bg-info/10 text-info'
                        }`}>{incident.status.toUpperCase()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { playAlertSound('dispatch'); toast.success(`Additional unit dispatched — ${incident.id}`); }}
                      className="mt-2 w-full py-1.5 rounded-lg bg-orange-400/10 border border-orange-400/30 text-orange-400 text-[10px] font-display hover:bg-orange-400/20 transition-colors"
                    >
                      DISPATCH ADDITIONAL UNIT
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'stations' && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Fire Stations — Limpopo Province</h3>
                {fireStations.map((station, i) => (
                  <motion.div key={station.name} className="dashboard-card" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{station.name}</p>
                        <p className="text-[9px] text-muted-foreground">{station.district} District</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-[9px] text-info">{station.units} units total</span>
                          <span className="text-[9px] text-primary">{station.available} available</span>
                          <span className="text-[9px] text-muted-foreground">{station.personnel} personnel</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-display border ${
                        station.status === 'operational' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-accent/10 border-accent/30 text-accent'
                      }`}>{station.status.toUpperCase()}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${station.available === 0 ? 'bg-destructive' : station.available < station.units ? 'bg-accent' : 'bg-primary'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(station.available / station.units) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                    <p className="text-[8px] text-muted-foreground mt-0.5">Unit availability: {station.available}/{station.units}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'units' && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Fire Unit Status</h3>
                {fireUnits.map((unit, i) => (
                  <motion.div key={unit.id} className="dashboard-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{unit.name}</p>
                        <p className="text-[9px] text-muted-foreground">{unit.type} • {unit.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-display border ${
                        unit.status === 'responding' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                        unit.status === 'on scene' ? 'bg-accent/10 border-accent/30 text-accent' :
                        'bg-primary/10 border-primary/30 text-primary'
                      }`}>{unit.status.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ label: 'Water', value: unit.water }, { label: 'Foam', value: unit.foam }].map(supply => (
                        <div key={supply.label}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[8px] text-muted-foreground">{supply.label}</span>
                            <span className="text-[8px] text-foreground">{supply.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${parseInt(supply.value) < 50 ? 'bg-destructive' : parseInt(supply.value) < 75 ? 'bg-accent' : 'bg-primary'}`}
                              style={{ width: supply.value }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'risk' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Fire Risk Zones — Limpopo</h3>
                </div>
                {riskZones.map((zone, i) => (
                  <motion.div
                    key={zone.area}
                    className={`dashboard-card border-l-4 ${zone.risk === 'critical' ? 'border-l-destructive' : zone.risk === 'high' ? 'border-l-orange-400' : 'border-l-accent'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-display font-bold text-foreground">{zone.area}</p>
                        <div className="flex gap-2 mt-1">
                          {zone.hazmat && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-destructive/10 border border-destructive/30 text-destructive font-display">HAZMAT</span>
                          )}
                          <span className="text-[9px] text-muted-foreground">Last inspection: {zone.lastInspection}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{zone.incidents30d} incidents in last 30 days</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-display uppercase border ${severityColor[zone.risk]}`}>{zone.risk} risk</span>
                    </div>
                  </motion.div>
                ))}
                <div className="dashboard-card bg-orange-400/5 border-orange-400/20">
                  <p className="text-[10px] font-display text-orange-400">🔥 Fire Weather: HIGH index forecast. All veld-adjacent units on standby alert.</p>
                  <p className="text-[9px] text-muted-foreground mt-1">Coordinating with DAFF (Dept of Agriculture, Forestry & Fisheries) on Limpopo mountain and bushveld zone monitoring. Wind gusts up to 45km/h expected in the lowveld.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
