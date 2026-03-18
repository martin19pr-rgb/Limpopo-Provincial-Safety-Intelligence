import { motion } from 'framer-motion';
import { Smartphone, Radio, TrafficCone, Ambulance, Satellite, Brain } from 'lucide-react';

const integrations = [
  { icon: Smartphone, label: 'Citizen App', desc: 'Crash detection & safety alerts', color: 'text-primary' },
  { icon: Radio, label: 'Roadside Sensors', desc: 'LiDAR & acoustic monitoring', color: 'text-info' },
  { icon: TrafficCone, label: 'LED Billboards', desc: 'Dynamic SANRAL sign control', color: 'text-accent' },
  { icon: Ambulance, label: 'Emergency Services', desc: 'Multi-responder dispatch', color: 'text-destructive' },
  { icon: Satellite, label: 'Satellite Fallback', desc: 'Iridium rural coverage', color: 'text-success' },
  { icon: Brain, label: 'AI Command Brain', desc: 'Predictive analytics & allocation', color: 'text-accent' },
];

export default function EcosystemIntegration() {
  return (
    <div className="dashboard-card glow-border-gold">
      <h3 className="font-display text-xs font-bold text-accent uppercase tracking-widest mb-4">
        LPISTH Ecosystem Integration
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {integrations.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-3 rounded-md bg-secondary/30 border border-border/50 hover:border-accent/30 transition-colors"
          >
            <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
            <p className="text-xs font-display font-bold text-foreground">{item.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-md bg-primary/10 border border-primary/30">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-primary font-display font-bold">ZERO AVOIDABLE DEATHS BY 2030</span> — Citizens trigger alerts via app → Sensors confirm → PoW dispatches accountable workers → Dashboards provide real-time oversight. No global equivalent ensures emergency teams are always primed.
        </p>
      </div>
    </div>
  );
}
