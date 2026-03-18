import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import AlertCard from '@/components/AlertCard';
import WorkerRow from '@/components/WorkerRow';
import HeatmapGrid from '@/components/HeatmapGrid';
import SmartProvincialMap from '@/components/SmartProvincialMap';
import DepartmentBadge from '@/components/DepartmentBadge';
import OfficialEmblem from '@/components/OfficialEmblem';
import FloatingAIMic from '@/components/FloatingAIMic';
import CrisisCommandPanel from '@/components/CrisisCommandPanel';
import FusionIntelPanel from '@/components/FusionIntelPanel';
import { StaggerGrid, StaggerItem, FadeSlideIn } from '@/components/AnimatedDashboardSection';
import { IncidentBarChart, ResponseTimeChart, FatalityInjuryChart, PoWScoreDistribution, StaffAvailabilityChart, SignInOutChart } from '@/components/AnalyticsCharts';
import { mockAlerts, mockWorkers, commandKPIs } from '@/data/mockData';
import { toast } from 'sonner';

export default function UnifiedCommandDashboard() {
  const handleDispatch = (alertId: string) => {
    toast.success(`Dispatching top 3 ready workers for ${alertId}`, {
      description: 'PoW consensus selecting nearest standby-ready responders...',
    });
  };

  return (
    <DashboardLayout title="Unified Provincial Command Center" deptBg="dept-bg-command">
      <div className="flex items-center gap-4 mb-2">
        <OfficialEmblem department="command" size="lg" />
        <DepartmentBadge department="command" />
      </div>

      <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 mb-6">
        {commandKPIs.map(kpi => (
          <StaggerItem key={kpi.label}><KPICard kpi={kpi} /></StaggerItem>
        ))}
      </StaggerGrid>

      {/* Smart Leaflet Map — Star Feature */}
      <FadeSlideIn delay={0.15} className="mb-6">
        <SmartProvincialMap />
      </FadeSlideIn>

      {/* Fusion Intelligence */}
      <FadeSlideIn delay={0.2} className="mb-6">
        <FusionIntelPanel />
      </FadeSlideIn>

      {/* Charts Row */}
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
      <FadeSlideIn delay={0.55} className="mb-6">
        <CrisisCommandPanel />
      </FadeSlideIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeSlideIn delay={0.6} className="lg:col-span-1 space-y-3">
          <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Live Alerts ({mockAlerts.filter(a => a.status !== 'resolved').length})
          </h2>
          {mockAlerts.filter(a => a.status !== 'resolved').map(alert => (
            <AlertCard key={alert.id} alert={alert} onDispatch={handleDispatch} />
          ))}
        </FadeSlideIn>

        <FadeSlideIn delay={0.65} className="lg:col-span-1 space-y-2">
          <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Worker PoW Tracking
          </h2>
          <div className="space-y-1.5">
            {mockWorkers.map(worker => (
              <WorkerRow key={worker.id} worker={worker} />
            ))}
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={0.7} className="lg:col-span-1 space-y-4">
          <div>
            <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Predictive Risk Heatmap
            </h2>
            <HeatmapGrid />
          </div>
          <div className="dashboard-card border-primary/30">
            <h3 className="font-display text-xs font-bold text-success uppercase tracking-widest mb-3">Zero Deaths 2030 Tracker</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <span className="font-display text-lg font-bold text-primary">25%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">1,234 lives saved • 47 incidents today • Avg response 3.2 min</p>
          </div>
        </FadeSlideIn>
      </div>

      <FloatingAIMic />
    </DashboardLayout>
  );
}
