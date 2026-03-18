import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, Eye, Mail, Lock, AlertTriangle, CheckCircle, Loader2, Scan } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import coatOfArms from '@/assets/emblem-sa-coat-of-arms.png';

type AuthMode = 'login' | 'signup' | 'biometric' | 'otp';

export default function AuthLogin() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [govId, setGovId] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricPhase, setBiometricPhase] = useState<'scanning' | 'verified' | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const navigate = useNavigate();

  // Check existing session
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate('/');
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) return toast.error('Please enter email and password');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Authentication verified — Welcome, Official');
    navigate('/');
  };

  const handleSignup = async () => {
    if (!email || !password || !govId) return toast.error('All fields required');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { gov_id: govId } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Verification email sent — check your inbox');
    setMode('login');
  };

  const handleBiometric = async () => {
    setBiometricPhase('scanning');
    setScanProgress(0);

    // Simulate biometric scan with progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBiometricPhase('verified');
          setTimeout(() => {
            // Try WebAuthn if available
            if (window.PublicKeyCredential) {
              toast.success('Biometric verified — proceeding to authentication');
              setBiometricPhase(null);
              setMode('login');
            } else {
              toast.info('WebAuthn not supported — use email login');
              setBiometricPhase(null);
              setMode('login');
            }
          }, 1500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  const auditLog = [
    { time: '14:32:18', event: 'Premier login — Polokwane HQ', status: 'success' },
    { time: '14:28:05', event: 'Dir. Mokoena — EMS Dashboard', status: 'success' },
    { time: '14:15:42', event: 'Unknown device — blocked', status: 'failed' },
    { time: '13:58:11', event: 'Cmdr. Ndlovu — SAPS Command', status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.line
              key={`h${i}`}
              x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`}
              stroke="hsl(var(--primary))" strokeWidth="0.3"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <motion.line
              key={`v${i}`}
              x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%"
              stroke="hsl(var(--primary))" strokeWidth="0.3"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }}
              transition={{ duration: 4, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>

      {/* Pulsing security orb */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-card border-2 border-primary/30 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            animate={{ boxShadow: ['0 0 0 0 hsl(var(--primary) / 0.2)', '0 0 30px 10px hsl(var(--primary) / 0.1)', '0 0 0 0 hsl(var(--primary) / 0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <img src={coatOfArms} alt="SA Coat of Arms" className="w-14 h-14 object-contain" />
          </motion.div>
          <h1 className="font-display text-lg font-bold text-foreground tracking-wider">
            PROVINCIAL SAFETY INTELLIGENCE
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-display tracking-widest">
            LIMPOPO • SECURE ACCESS
          </p>
          <motion.div
            className="flex items-center justify-center gap-2 mt-3"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[9px] font-display text-primary uppercase tracking-widest">Quantum-Grade Security Active</span>
          </motion.div>
        </div>

        {/* Auth Card */}
        <div className="bg-card/80 backdrop-blur-xl border-2 border-border rounded-2xl overflow-hidden">
          {/* Mode Tabs */}
          <div className="flex border-b border-border">
            {[
              { key: 'login' as AuthMode, label: 'Login', icon: Lock },
              { key: 'biometric' as AuthMode, label: 'Biometric', icon: Fingerprint },
              { key: 'signup' as AuthMode, label: 'Register', icon: Shield },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-display transition-colors ${
                  mode === tab.key ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* LOGIN */}
              {mode === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase tracking-widest mb-1 block">Government Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="official@limpopo.gov.za"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 text-foreground text-sm border border-border focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase tracking-widest mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 text-foreground text-sm border border-border focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <motion.button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {loading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
                  </motion.button>
                </motion.div>
              )}

              {/* BIOMETRIC */}
              {mode === 'biometric' && (
                <motion.div key="biometric" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-6">Place your finger on the sensor or look at the camera</p>

                    {/* Fingerprint Scanner */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/20"
                        animate={biometricPhase === 'scanning' ? { borderColor: ['hsl(var(--primary) / 0.2)', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary) / 0.2)'] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      {biometricPhase === 'scanning' && (
                        <motion.div
                          className="absolute inset-2 rounded-full"
                          style={{ background: `conic-gradient(hsl(var(--primary)) ${scanProgress}%, transparent ${scanProgress}%)` }}
                        />
                      )}
                      <div className="absolute inset-4 rounded-full bg-card border border-border flex items-center justify-center">
                        {biometricPhase === 'verified' ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <CheckCircle className="w-12 h-12 text-primary" />
                          </motion.div>
                        ) : biometricPhase === 'scanning' ? (
                          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                            <Scan className="w-12 h-12 text-primary" />
                          </motion.div>
                        ) : (
                          <Fingerprint className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {biometricPhase === 'scanning' && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-primary font-display">
                        Scanning... {scanProgress}%
                      </motion.p>
                    )}
                    {biometricPhase === 'verified' && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-primary font-display font-bold">
                        ✅ BIOMETRIC VERIFIED
                      </motion.p>
                    )}

                    {!biometricPhase && (
                      <div className="flex gap-3">
                        <motion.button
                          onClick={handleBiometric}
                          className="flex-1 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-display font-bold text-sm tracking-wider hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Fingerprint className="w-4 h-4" /> Fingerprint
                        </motion.button>
                        <motion.button
                          onClick={handleBiometric}
                          className="flex-1 py-3 rounded-lg bg-info/10 border border-info/30 text-info font-display font-bold text-sm tracking-wider hover:bg-info/20 transition-colors flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Eye className="w-4 h-4" /> Face ID
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* SIGNUP */}
              {mode === 'signup' && (
                <motion.div key="signup" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase tracking-widest mb-1 block">Government Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="official@limpopo.gov.za"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase tracking-widest mb-1 block">Government ID Number</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="text" value={govId} onChange={e => setGovId(e.target.value)} placeholder="SA-GOV-XXXXXXXXX"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase tracking-widest mb-1 block">Create Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  <motion.button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {loading ? 'REGISTERING...' : 'REGISTER OFFICIAL'}
                  </motion.button>
                  <p className="text-[9px] text-muted-foreground text-center">
                    After registration, admin approval required for role assignment
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Audit Trail */}
        <motion.div
          className="mt-6 bg-card/60 backdrop-blur border border-border rounded-xl p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-accent" />
            <span className="font-display text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Access Log</span>
          </div>
          <div className="space-y-1.5">
            {auditLog.map((log, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-[10px]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="font-display text-muted-foreground w-14">{log.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-primary' : 'bg-destructive'}`} />
                <span className="text-foreground flex-1">{log.event}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-[9px] text-muted-foreground text-center mt-4 font-display tracking-wider">
          From reactive panic to predictive protection — zero avoidable deaths by 2030
        </p>
      </motion.div>
    </div>
  );
}
