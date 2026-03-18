import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import HeatmapGrid from '@/components/HeatmapGrid';
import SmartProvincialMap from '@/components/SmartProvincialMap';
import DepartmentBadge from '@/components/DepartmentBadge';
import OfficialEmblem from '@/components/OfficialEmblem';
import { DepartmentEmblemStrip } from '@/components/DepartmentEmblem';
import LEDBillboard from '@/components/LEDBillboard';
import TrafficLightControl from '@/components/TrafficLightControl';
import WorkerRow from '@/components/WorkerRow';
import FloatingAIMic from '@/components/FloatingAIMic';
import AnalysisPanel from '@/components/AnalysisPanel';
import CrisisCommandPanel from '@/components/CrisisCommandPanel';
import FusionIntelPanel from '@/components/FusionIntelPanel';
import { StaggerGrid, StaggerItem, FadeSlideIn, ParticleField } from '@/components/AnimatedDashboardSection';
import { IncidentBarChart, ResponseTimeChart, FatalityInjuryChart, PoWScoreDistribution, StaffAvailabilityChart, SignInOutChart } from '@/components/AnalyticsCharts';
import { premierKPIs, trafficSigns, mockWorkers, roadStatusFlags } from '@/data/mockData';
import { Download, Flag, AlertTriangle, Users, Monitor, Construction } from 'lucide-react';
import { toast } from 'sonner';

export default function PremierDashboard() {
  return (
    <DashboardLayout title="Premier's Office — KPI Dashboard" deptBg="dept-bg-premier">
      <div className="relative">
        <ParticleField />
      </div>

      <div className="flex items-center gap-4">
        <OfficialEmblem department="premier" size="lg" />
        <DepartmentBadge department="premier" />
      </div>

      <FadeSlideIn delay={0.1} className="mt-3">
        <DepartmentEmblemStrip />
      </FadeSlideIn>

      <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 mb-6">
        {premierKPIs.map(kpi => (
          <StaggerItem key={kpi.label}><KPICard kpi={kpi} /></StaggerItem>
        ))}
      </StaggerGrid>

      <FadeSlideIn delay={0.15} className="mb-6">
        <AnalysisPanel />
      </FadeSlideIn>

      {/* Smart Provincial Map */}
      <FadeSlideIn delay={0.2} className="mb-6">
        <SmartProvincialMap />
      </FadeSlideIn>

      {/* Fusion Intelligence */}
      <FadeSlideIn delay={0.22} className="mb-6">
        <FusionIntelPanel />
      </FadeSlideIn>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <FadeSlideIn delay={0.25}><IncidentBarChart /></FadeSlideIn>
        <FadeSlideIn delay={0.3}><ResponseTimeChart /></FadeSlideIn>
        <FadeSlideIn delay={0.35}><FatalityInjuryChart /></FadeSlideIn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FadeSlideIn delay={0.4}><PoWScoreDistribution /></FadeSlideIn>
        <FadeSlideIn delay={0.45}><StaffAvailabilityChart /></FadeSlideIn>
        <FadeSlideIn delay={0.5}><SignInOutChart /></FadeSlideIn>
      </div>

      {/* Crisis Command */}
      <FadeSlideIn delay={0.52} className="mb-6">
        <CrisisCommandPanel />
      </FadeSlideIn>

      {/* LED Billboards & Traffic Lights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FadeSlideIn delay={0.55}>
          <div className="space-y-3">
            <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-accent" /> LED Billboard Messages
            </h2>
            {trafficSigns.slice(0, 4).map(sign => (
              <LEDBillboard key={sign.id} sign={sign} />
            ))}
          </div>
        </FadeSlideIn>
        <FadeSlideIn delay={0.6}>
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
                <Construction className="w-3.5 h-3.5 text-success" /> Traffic Light Coordination
              </h2>
              <TrafficLightControl />
            </div>
          </div>
        </FadeSlideIn>
      </div>

      {/* Road Status Flags */}
      <FadeSlideIn delay={0.65} className="mb-6">
        <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
          <Flag className="w-3.5 h-3.5 text-accent" /> Road Status & Flags
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {roadStatusFlags.map((flag, i) => (
            <FadeSlideIn key={flag.label} delay={0.7 + i * 0.05}>
              <div className="dashboard-card">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-3.5 h-3.5 text-${flag.color}`} />
                  <h3 className={`font-display text-[10px] font-bold uppercase tracking-widest text-${flag.color}`}>{flag.label}</h3>
                </div>
                <div className="space-y-1.5">
                  {flag.items.map((item, j) => (
                    <p key={j} className="text-[10px] text-muted-foreground pl-5">• {item}</p>
                  ))}
                </div>
              </div>
            </FadeSlideIn>
          ))}
        </div>
      </FadeSlideIn>

      {/* Worker Accountability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FadeSlideIn delay={0.75}>
          <div>
            <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
              <Users className="w-3.5 h-3.5 text-info" /> Signed-In Workers
            </h2>
            <div className="space-y-1">
              {mockWorkers.filter(w => w.status !== 'offline').map(w => (
                <WorkerRow key={w.id} worker={w} />
              ))}
            </div>
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={0.8}>
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Predictive Heatmap</h2>
              <HeatmapGrid />
            </div>

            <div className="dashboard-card">
              <h3 className="font-display text-xs font-bold text-success uppercase tracking-widest mb-3">Zero Deaths 2030</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress to Goal</span><span className="font-display text-foreground">25%</span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-secondary/30">
                    <p className="kpi-value text-foreground text-2xl">1,234</p>
                    <p className="text-[10px] text-muted-foreground">Lives Saved 2024</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/30">
                    <p className="kpi-value text-foreground text-2xl">-34%</p>
                    <p className="text-[10px] text-muted-foreground">Fatality Reduction YoY</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Weekly Compliance</h3>
              <div className="space-y-2">
                {['SAPS', 'EMS', 'Transport', 'Health', 'Roads Agency'].map((dept, i) => {
                  const vals = [91, 98, 78, 89, 75];
                  return (
                    <div key={dept} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">{dept}</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${vals[i] >= 90 ? 'bg-success' : vals[i] >= 80 ? 'bg-accent' : 'bg-destructive'}`} style={{ width: `${vals[i]}%` }} />
                      </div>
                      <span className="font-display text-xs text-foreground w-10 text-right">{vals[i]}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => toast.success('Exporting CSV report...')}
              className="w-full py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-display tracking-wider flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> EXPORT WEEKLY REPORT (CSV)
            </button>
          </div>
        </FadeSlideIn>
      </div>

      <FloatingAIMic />
    </DashboardLayout>
  );
}
