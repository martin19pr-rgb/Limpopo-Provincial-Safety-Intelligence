import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Command, Zap, Search, Map, BarChart3, AlertTriangle, Users } from 'lucide-react';
import { toast } from 'sonner';

const voiceCommands = [
  { command: '"Show risky roads"', description: 'Highlights high-risk corridors on the map', icon: Map, category: 'Navigation' },
  { command: '"Show busy roads"', description: 'Displays congestion heatmap overlay', icon: BarChart3, category: 'Navigation' },
  { command: '"Active incidents"', description: 'Lists all unresolved alerts by severity', icon: AlertTriangle, category: 'Alerts' },
  { command: '"Worker status"', description: 'Shows PoW compliance & standby readiness', icon: Users, category: 'Workers' },
  { command: '"Response times"', description: 'Displays avg ETA chart by department', icon: Zap, category: 'Analytics' },
  { command: '"Search [location]"', description: 'Finds incidents, workers near a location', icon: Search, category: 'Search' },
];

const categories = [...new Set(voiceCommands.map(c => c.category))];

export default function VoiceCommandPanel() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleListening = useCallback(() => {
    if (isListening) {
      setIsListening(false);
      setTranscript('');
      toast.info('Voice command deactivated');
    } else {
      setIsListening(true);
      toast.success('Listening for commands...', { description: 'Say a command like "Show risky roads"' });
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript('show risky roads');
        setTimeout(() => {
          toast.success('Command recognized: Show risky roads', { description: 'Highlighting risk corridors on map...' });
          setIsListening(false);
          setTranscript('');
        }, 1500);
      }, 2000);
    }
  }, [isListening]);

  const filteredCommands = activeCategory
    ? voiceCommands.filter(c => c.category === activeCategory)
    : voiceCommands;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="dashboard-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Voice Command Center
        </h3>
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleListening}
          className={`relative p-3 rounded-full transition-colors ${
            isListening
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {isListening && (
            <motion.span
              className="absolute inset-0 rounded-full bg-destructive/30"
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {isListening ? <MicOff className="w-4 h-4 relative z-10" /> : <Mic className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Active listening indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="bg-secondary/50 rounded-md p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs text-destructive font-display uppercase tracking-wider">Listening...</span>
              </div>
              {/* Audio waveform visualization */}
              <div className="flex items-center gap-0.5 h-6">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                    transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
              {transcript && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-foreground font-display"
                >
                  &gt; {transcript}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filters */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-[10px] px-2 py-1 rounded font-display uppercase tracking-wider transition-colors ${
            !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`text-[10px] px-2 py-1 rounded font-display uppercase tracking-wider transition-colors ${
              activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Command list */}
      <div className="space-y-1.5">
        {filteredCommands.map((cmd, i) => (
          <motion.div
            key={cmd.command}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30, delay: i * 0.05 }}
            whileHover={{ x: 4 }}
            onClick={() => toast.info(`Try saying: ${cmd.command}`)}
            className="flex items-center gap-3 p-2 rounded-md bg-secondary/30 hover:bg-secondary/60 transition-colors cursor-pointer group"
          >
            <cmd.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display text-foreground">{cmd.command}</p>
              <p className="text-[10px] text-muted-foreground truncate">{cmd.description}</p>
            </div>
            <Command className="w-3 h-3 text-muted-foreground/40" />
          </motion.div>
        ))}
      </div>

      <p className="text-[9px] text-muted-foreground text-center">
        Voice commands integrate with Web Speech API • Satellite fallback via Iridium
      </p>
    </motion.div>
  );
}
