import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MapPin, Timer, ArrowUpDown } from 'lucide-react';

interface Junction {
  name: string;
  road: string;
  direction: string;
  mode: 'auto' | 'override' | 'emergency';
  activeLight: 'red' | 'amber' | 'green';
  cycleTime: number; // seconds
  vehiclesPerMin: number;
  coordinates: string;
}

const defaultJunctions: Junction[] = [
  { name: 'A1/A3 Interchange', road: 'A1 Highway', direction: 'Northbound & Southbound', mode: 'auto', activeLight: 'green', cycleTime: 45, vehiclesPerMin: 82, coordinates: '23.9°S, 29.5°E' },
  { name: 'Polokwane CBD Circle', road: "Thabo Mbeki St", direction: 'All directions', mode: 'auto', activeLight: 'red', cycleTime: 60, vehiclesPerMin: 120, coordinates: '23.9°S, 29.5°E' },
  { name: 'Polokwane South Junction', road: 'A1 South Rd', direction: 'East-West', mode: 'auto', activeLight: 'amber', cycleTime: 40, vehiclesPerMin: 55, coordinates: '24.0°S, 29.5°E' },
  { name: 'A2/A3 Crossing', road: 'A3 Regional', direction: 'Eastbound to Teyateyaneng', mode: 'auto', activeLight: 'green', cycleTime: 50, vehiclesPerMin: 68, coordinates: '29.2°S, 27.7°E' },
  { name: 'Mafeteng A1 Entry', road: 'A1 Highway', direction: 'Southbound entry ramp', mode: 'auto', activeLight: 'green', cycleTime: 35, vehiclesPerMin: 45, coordinates: '29.8°S, 27.2°E' },
  { name: 'Leribe A4/A5 Fork', road: 'A4 Regional', direction: 'Northwest Split', mode: 'auto', activeLight: 'red', cycleTime: 55, vehiclesPerMin: 73, coordinates: '28.9°S, 28.1°E' },
];

export default function TrafficLightControl() {
  const [junctions, setJunctions] = useState(defaultJunctions);

  useEffect(() => {
    const interval = setInterval(() => {
      setJunctions(prev => prev.map(j => {
        if (j.mode !== 'auto') return j;
        const cycle: ('red' | 'amber' | 'green')[] = ['green', 'amber', 'red'];
        const idx = cycle.indexOf(j.activeLight);
        return { ...j, activeLight: cycle[(idx + 1) % 3] };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerOverride = (name: string) => {
    setJunctions(prev => prev.map(j =>
      j.name === name ? { ...j, mode: 'emergency', activeLight: 'red' } : j
    ));
    toast.error(`EMERGENCY OVERRIDE: ${name}`, {
      description: 'All signals set to RED — emergency corridor active',
    });
    setTimeout(() => {
      setJunctions(prev => prev.map(j =>
        j.name === name ? { ...j, mode: 'auto', activeLight: 'green' } : j
      ));
    }, 10000);
  };

  const modeColors: Record<string, string> = {
    auto: 'text-success',
    override: 'text-accent',
    emergency: 'text-destructive',
  };

  const lightGlow: Record<string, string> = {
    red: 'shadow-[0_0_8px_hsl(0,72%,50%,0.6)]',
    amber: 'shadow-[0_0_8px_hsl(43,96%,52%,0.6)]',
    green: 'shadow-[0_0_8px_hsl(145,65%,38%,0.6)]',
  };

  return (
    <div className="space-y-3">
      {junctions.map(junction => (
        <motion.div
          key={junction.name}
          layout
          className={`dashboard-card flex items-start gap-4 ${
            junction.mode === 'emergency' ? 'border-destructive/40' : ''
          }`}
        >
          {/* Traffic Light Visual */}
          <div className="traffic-light shrink-0">
            <div className={`traffic-bulb traffic-bulb-red ${junction.activeLight === 'red' ? `active ${lightGlow.red}` : ''}`} />
            <div className={`traffic-bulb traffic-bulb-amber ${junction.activeLight === 'amber' ? `active ${lightGlow.amber}` : ''}`} />
            <div className={`traffic-bulb traffic-bulb-green ${junction.activeLight === 'green' ? `active ${lightGlow.green}` : ''}`} />
          </div>

          {/* Junction Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-bold text-foreground truncate">{junction.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] font-display text-foreground bg-secondary px-1.5 py-0.5 rounded">
                {junction.road}
              </span>
              <span className={`text-[10px] font-display uppercase ${modeColors[junction.mode]}`}>
                {junction.mode === 'emergency' ? '⚠ EMERGENCY' : junction.mode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> {junction.direction}
              </span>
              <span className="flex items-center gap-0.5">
                <Timer className="w-2.5 h-2.5" /> {junction.cycleTime}s cycle
              </span>
              <span className="flex items-center gap-0.5">
                <ArrowUpDown className="w-2.5 h-2.5" /> {junction.vehiclesPerMin} veh/min
              </span>
            </div>
            <p className="text-[8px] text-muted-foreground mt-1">{junction.coordinates}</p>
          </div>

          {/* Override Button */}
          <button
            onClick={() => triggerOverride(junction.name)}
            disabled={junction.mode === 'emergency'}
            className="px-3 py-1.5 rounded-md bg-destructive/20 text-destructive text-[10px] font-display uppercase tracking-wider hover:bg-destructive/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Override
          </button>
        </motion.div>
      ))}
    </div>
  );
}
