import { motion } from 'framer-motion';
import { Smartphone, Camera, Radio, Plane, MessageSquare, Car, Activity, Zap } from 'lucide-react';

const fusionFeeds = [
  { icon: Smartphone, label: '10K Guardian Citizens', count: '10,247', desc: 'Crash videos + suspect sightings', color: 'text-primary' },
  { icon: Camera, label: '1,500 LPR Cameras', count: '1,247 online', desc: 'Vehicle tracking + stolen matches', color: 'text-info' },
  { icon: Radio, label: '500 Police Bodycams', count: '487 streaming', desc: 'Live officer feeds + stress detection', color: 'text-info' },
  { icon: Plane, label: '17 Drones', count: '12 airborne', desc: 'Thermal AR crime scene overlays', color: 'text-accent' },
  { icon: MessageSquare, label: 'Social/Crowd Intel', count: '342 signals', desc: 'WhatsApp + X predictive patterns', color: 'text-accent' },
  { icon: Car, label: 'SANRAL ITS', count: '89 sensors', desc: 'Traffic lights + pothole detection', color: 'text-primary' },
];

const fusionAlerts = [
  { text: 'Fusion Alert: 94% confidence white BMW heist vehicle R101 J14', severity: 'critical' },
  { text: 'LPR + CCTV correlation: Suspect vehicle match confirmed N1 KM 45', severity: 'high' },
  { text: 'Citizen + bodycam fusion: Crash severity upgraded to 8/10', severity: 'medium' },
];

export default function FusionIntelPanel() {
  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-accent" />
        <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-widest">
          Fusion Intelligence — 7,423 Live Feeds
        </h3>
        <motion.span
          className="ml-auto text-[9px] font-display text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          94% ACCURACY
        </motion.span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {fusionFeeds.map((feed, i) => (
          <motion.div
            key={feed.label}
            className="p-3 rounded-lg bg-secondary/30 border border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <feed.icon className={`w-3.5 h-3.5 ${feed.color}`} />
              <span className="font-display text-[10px] font-bold text-foreground">{feed.count}</span>
            </div>
            <p className="text-[9px] text-muted-foreground">{feed.label}</p>
            <p className="text-[8px] text-muted-foreground/60 mt-0.5">{feed.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Fusion Alerts */}
      <div className="space-y-1.5">
        {fusionAlerts.map((alert, i) => (
          <motion.div
            key={i}
            className={`p-2.5 rounded-lg border text-[10px] ${
              alert.severity === 'critical' ? 'bg-destructive/5 border-destructive/30 text-destructive' :
              alert.severity === 'high' ? 'bg-accent/5 border-accent/30 text-accent' :
              'bg-info/5 border-info/30 text-info'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Activity className="w-3 h-3 inline mr-1.5" />
            {alert.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
