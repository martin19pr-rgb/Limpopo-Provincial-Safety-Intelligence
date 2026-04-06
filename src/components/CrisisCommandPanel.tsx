import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, Shield, Flame, UserX, Zap, Radio, Volume2, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const crisisProtocols = [
  {
    id: 'mass-casualty',
    label: 'MASS CASUALTY',
    icon: Siren,
    color: 'text-destructive',
    bg: 'bg-destructive/10 border-destructive/30',
    desc: 'A1 Pileup — Deploy 6 police + 8 ambulances + 3 drones + traffic lockdown',
    resources: ['6 SAPS Units', '8 Ambulances', '3 Drones', 'Full Traffic Lockdown'],
  },
  {
    id: 'heist-response',
    label: 'HEIST LOCKDOWN',
    icon: Shield,
    color: 'text-info',
    bg: 'bg-info/10 border-info/30',
    desc: 'Perimeter 2km + drone swarm + LPR tracking active',
    resources: ['2km Perimeter', 'Drone Swarm', 'LPR Network', 'K9 Units'],
  },
  {
    id: 'fire-emergency',
    label: 'FIRE / HAZMAT',
    icon: Flame,
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/30',
    desc: 'Fire/rescue + hospitals + road closures activated',
    resources: ['Fire Units', 'Hospitals Alert', 'Road Closures', 'Evacuation'],
  },
  {
    id: 'officer-down',
    label: 'OFFICER DOWN',
    icon: UserX,
    color: 'text-destructive',
    bg: 'bg-destructive/10 border-destructive/30',
    desc: 'Silent response — backup + ambulance + supervisor dispatched (No radio)',
    resources: ['Silent Backup', 'Ambulance', 'Supervisor', 'Bodycam Priority'],
  },
];

const liveComms = [
  { time: '14:32', from: 'SAPS Unit 247', msg: 'Suspect vehicle sighted A1 North — pursuing', type: 'urgent' },
  { time: '14:30', from: 'EMS Dispatch', msg: 'Ambulance en route A1 KM 12 — ETA 3m42s', type: 'info' },
  { time: '14:28', from: 'Traffic Command', msg: 'LED billboards updated: CRASH AHEAD EXIT A2', type: 'system' },
  { time: '14:25', from: 'AI Engine', msg: 'Prediction: 78% incident spike A1 17:00-19:00', type: 'ai' },
  { time: '14:22', from: 'Drone Unit 3', msg: 'Thermal scan complete — 2 victims located', type: 'urgent' },
];

export default function CrisisCommandPanel() {
  const [activating, setActivating] = useState<string | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const handleActivate = (id: string) => {
    setActivating(id);
    setTimeout(() => {
      setActivating(null);
      const protocol = crisisProtocols.find(p => p.id === id);
      toast.success(`🚨 ${protocol?.label} PROTOCOL ACTIVATED`, {
        description: protocol?.resources.join(' • '),
      });
    }, 2000);
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    toast.success('📡 Broadcast sent to all units', { description: broadcastMsg });
    setBroadcastMsg('');
  };

  return (
    <div className="space-y-4">
      {/* Crisis Protocols */}
      <div className="dashboard-card">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-destructive" />
          <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">One-Click Crisis Protocols</h3>
          <motion.div
            className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/20"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
            <span className="text-[9px] font-display text-destructive">ARMED</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {crisisProtocols.map(protocol => (
            <motion.button
              key={protocol.id}
              onClick={() => handleActivate(protocol.id)}
              disabled={!!activating}
              className={`p-4 rounded-lg border text-left transition-colors ${protocol.bg} hover:opacity-90 disabled:opacity-50`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {activating === protocol.id ? (
                  <Loader2 className={`w-5 h-5 ${protocol.color} animate-spin`} />
                ) : (
                  <protocol.icon className={`w-5 h-5 ${protocol.color}`} />
                )}
                <span className={`font-display text-xs font-bold ${protocol.color} tracking-wider`}>
                  {activating === protocol.id ? 'ACTIVATING...' : protocol.label}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{protocol.desc}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {protocol.resources.map(r => (
                  <span key={r} className="px-1.5 py-0.5 rounded text-[8px] bg-secondary/50 text-muted-foreground font-display">{r}</span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Live Communications */}
      <div className="dashboard-card">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-4 h-4 text-info" />
          <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">Live Communications</h3>
        </div>

        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {liveComms.map((comm, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-2 p-2 rounded-lg ${
                comm.type === 'urgent' ? 'bg-destructive/5 border border-destructive/20' :
                comm.type === 'ai' ? 'bg-primary/5 border border-primary/20' :
                'bg-secondary/30 border border-border'
              }`}
            >
              <span className="text-[9px] font-display text-muted-foreground w-10 shrink-0">{comm.time}</span>
              <div className="flex-1">
                <span className="text-[10px] font-display font-bold text-foreground">{comm.from}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{comm.msg}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Broadcast */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Volume2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={broadcastMsg}
              onChange={e => setBroadcastMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBroadcast()}
              placeholder="Broadcast to all units..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-secondary/50 text-foreground text-xs border border-border focus:border-primary focus:outline-none"
            />
          </div>
          <motion.button
            onClick={handleBroadcast}
            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
