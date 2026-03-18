import { useState } from 'react';
import { departments } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, CheckCircle, MapPin, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'verify' | 'department' | 'setup' | 'complete';

export default function GovOnboarding() {
  const [step, setStep] = useState<Step>('verify');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [standbyEnabled, setStandbyEnabled] = useState(true);
  const [consents, setConsents] = useState({ gps: true, bodycam: false, medical: false });
  const navigate = useNavigate();

  const handleVerify = () => {
    if (!email || !token) return toast.error('Please enter email and invite token');
    toast.success('Token verified — Welcome!');
    setStep('department');
  };

  const handleSetup = () => {
    if (!employeeId) return toast.error('Please enter your Employee ID');
    toast.success('Onboarding complete — PoW initialized with 0 points');
    setStep('complete');
  };

  const deptRoutes: Record<string, string> = {
    premier: '/premier', saps: '/saps', ems: '/ems',
    transport: '/transport', health: '/health', roads: '/roads',
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">Government Employee Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">Provincial Intelligent Safety — Private Invite Only</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['verify', 'department', 'setup', 'complete'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display ${
                step === s ? 'bg-primary text-primary-foreground' :
                (['verify','department','setup','complete'].indexOf(step) > i) ? 'bg-success text-success-foreground' :
                'bg-secondary text-muted-foreground'
              }`}>
                {(['verify','department','setup','complete'].indexOf(step) > i) ? '✓' : i + 1}
              </div>
              {i < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dashboard-card space-y-4">
              <h2 className="font-display text-sm font-bold text-foreground">Step 1: Verify Invite</h2>
              <input
                type="email" placeholder="Government email address" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none"
              />
              <input
                type="text" placeholder="Magic invite token" value={token}
                onChange={e => setToken(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none"
              />
              <button onClick={handleVerify} className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-display font-bold tracking-wider hover:bg-primary/90 transition-colors">
                VERIFY TOKEN
              </button>
            </motion.div>
          )}

          {step === 'department' && (
            <motion.div key="dept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dashboard-card space-y-3">
              <h2 className="font-display text-sm font-bold text-foreground">Step 2: Select Department</h2>
              <div className="grid grid-cols-2 gap-2">
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => { setSelectedDept(dept.id); setStep('setup'); }}
                    className={`p-3 rounded-md border text-left hover:bg-secondary/50 transition-colors ${
                      selectedDept === dept.id ? 'border-primary bg-primary/10' : 'border-border bg-secondary/20'
                    }`}
                  >
                    <span className="text-lg">{dept.icon}</span>
                    <p className="text-xs text-foreground mt-1 font-medium">{dept.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dashboard-card space-y-4">
              <h2 className="font-display text-sm font-bold text-foreground">
                Step 3: {departments.find(d => d.id === selectedDept)?.name} Setup
              </h2>
              <input
                type="text" placeholder="Employee ID (e.g., EMP-00421)" value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none"
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={standbyEnabled} onChange={e => setStandbyEnabled(e.target.checked)} className="accent-primary" />
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Enable Standby Mode (1% battery, GPS pings 30s)
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={consents.gps} onChange={e => setConsents({...consents, gps: e.target.checked})} className="accent-primary" />
                  GPS Tracking Consent (POPIA compliant)
                </label>
                {(selectedDept === 'saps') && (
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" checked={consents.bodycam} onChange={e => setConsents({...consents, bodycam: e.target.checked})} className="accent-primary" />
                    <Radio className="w-3.5 h-3.5 text-info" />
                    Bodycam Streaming Consent
                  </label>
                )}
                {(selectedDept === 'ems' || selectedDept === 'health') && (
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" checked={consents.medical} onChange={e => setConsents({...consents, medical: e.target.checked})} className="accent-primary" />
                    Medical Privacy Consent
                  </label>
                )}
              </div>

              <button onClick={handleSetup} className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-display font-bold tracking-wider hover:bg-primary/90 transition-colors">
                COMPLETE ONBOARDING
              </button>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dashboard-card text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-success mx-auto" />
              <h2 className="font-display text-sm font-bold text-foreground">Onboarding Complete!</h2>
              <p className="text-xs text-muted-foreground">
                Role: <span className="text-foreground">{selectedDept.toUpperCase()}</span> •
                PoW Points: <span className="text-primary font-display">0</span> •
                Standby: <span className="text-success">{standbyEnabled ? '✅ Active' : '❌ Inactive'}</span>
              </p>
              <button
                onClick={() => navigate(deptRoutes[selectedDept] || '/')}
                className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-display font-bold tracking-wider hover:bg-primary/90 transition-colors"
              >
                GO TO DASHBOARD →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
