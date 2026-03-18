import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Brain, X, Sparkles } from 'lucide-react';

const aiRemarks = [
  { text: "🚨 High crash probability detected on N1 KM 305 — dispatching nearest SAPS unit.", type: "alert" as const },
  { text: "📊 Response time improved 12% this week. PoW compliance trending upward across EMS.", type: "insight" as const },
  { text: "🛰️ Iridium fallback activated for rural R81 corridor — coverage unbreakable.", type: "system" as const },
  { text: "🚑 Ambulance Unit 247 ETA updated to 3min 42s. LiDAR confirmed crash severity.", type: "dispatch" as const },
  { text: "⚠️ R71 Mountain Pass: Fog advisory issued. LED billboards updated automatically.", type: "alert" as const },
  { text: "✅ Zero Deaths 2030 progress: 1,234 lives saved. Fatality rate down 34% YoY.", type: "insight" as const },
  { text: "🔵 SAPS Unit 34 repositioned to Mall of the North — PoW score: 1,240 pts.", type: "dispatch" as const },
  { text: "🌊 Flood sensor triggered at R81 Bridge Tzaneen. Traffic rerouted via R36.", type: "alert" as const },
  { text: "📡 Starlink coverage expanded to Thohoyandou. 42 new sensors online.", type: "system" as const },
  { text: "🏥 Dr. Mokoena on standby at Provincial Hospital. Medical readiness: 98%.", type: "dispatch" as const },
  { text: "🚧 Construction zone M10 KM 4: Single lane active. Expected completion 3 days.", type: "system" as const },
  { text: "📈 AI prediction: 78% chance of incident spike on N1 between 17:00-19:00 today.", type: "insight" as const },
];

const typeColors = {
  alert: 'text-destructive',
  insight: 'text-primary',
  system: 'text-info',
  dispatch: 'text-accent',
};

const typeBorderColors = {
  alert: 'border-destructive/30',
  insight: 'border-primary/30',
  system: 'border-info/30',
  dispatch: 'border-accent/30',
};

export default function FloatingAIMic() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [remarks, setRemarks] = useState<typeof aiRemarks>([]);
  const [currentRemark, setCurrentRemark] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-feed AI remarks to simulate live
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemarks(prev => {
        const next = aiRemarks[currentRemark % aiRemarks.length];
        setCurrentRemark(c => c + 1);
        const updated = [next, ...prev].slice(0, 8);
        return updated;
      });
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentRemark]);

  // Scroll to top on new remark
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [remarks.length]);

  return (
    <>
      {/* Floating Mic Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isListening
            ? ['0 0 0 0 hsl(145 65% 38% / 0.4)', '0 0 0 20px hsl(145 65% 38% / 0)', '0 0 0 0 hsl(145 65% 38% / 0.4)']
            : '0 10px 30px -10px hsl(145 65% 38% / 0.3)',
        }}
        transition={isListening ? { duration: 2, repeat: Infinity } : {}}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-primary-foreground" />
        ) : (
          <div className="relative">
            <Mic className="w-5 h-5 text-primary-foreground" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[480px] bg-card border border-border rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="font-display text-xs font-bold text-foreground tracking-wider">AI INTELLIGENCE</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] font-display text-primary">LIVE</span>
                </motion.div>
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-1.5 rounded-md transition-colors ${isListening ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}
                >
                  {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Listening indicator */}
            {isListening && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                className="px-3 py-2 bg-primary/5 border-b border-primary/10 flex items-center gap-2"
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-primary rounded-full"
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-primary font-display">Listening for voice commands...</span>
              </motion.div>
            )}

            {/* Remarks feed */}
            <div ref={scrollRef} className="overflow-y-auto max-h-[340px] p-2 space-y-2">
              {remarks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Sparkles className="w-6 h-6 mb-2 text-accent" />
                  <p className="text-xs font-display">AI scanning province...</p>
                  <p className="text-[10px] mt-1">Remarks will appear here</p>
                </div>
              )}
              <AnimatePresence mode="popLayout">
                {remarks.map((remark, i) => (
                  <motion.div
                    key={`${remark.text}-${i}`}
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`p-2.5 rounded-lg bg-secondary/30 border ${typeBorderColors[remark.type]} text-xs text-foreground leading-relaxed`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 ${typeColors[remark.type]}`}>
                        <Brain className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] leading-[1.5]">{remark.text}</p>
                        <p className="text-[9px] text-muted-foreground mt-1 font-display">
                          {i === 0 ? 'Just now' : `${(i + 1) * 4}s ago`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border bg-secondary/20">
              <p className="text-[9px] text-muted-foreground text-center font-display">
                Provincial Safety Intelligence • AI Engine v2.1
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
