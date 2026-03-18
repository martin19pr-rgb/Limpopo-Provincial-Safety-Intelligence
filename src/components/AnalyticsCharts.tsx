import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const incidentData = [
  { month: 'Jul', crashes: 42, robberies: 18, medical: 31, fires: 8 },
  { month: 'Aug', crashes: 38, robberies: 22, medical: 28, fires: 5 },
  { month: 'Sep', crashes: 51, robberies: 15, medical: 35, fires: 12 },
  { month: 'Oct', crashes: 35, robberies: 20, medical: 29, fires: 7 },
  { month: 'Nov', crashes: 44, robberies: 17, medical: 33, fires: 9 },
  { month: 'Dec', crashes: 55, robberies: 25, medical: 40, fires: 14 },
  { month: 'Jan', crashes: 47, robberies: 19, medical: 36, fires: 10 },
];

const responseTimeData = [
  { week: 'W1', avg: 4.8, target: 5 },
  { week: 'W2', avg: 4.2, target: 5 },
  { week: 'W3', avg: 3.9, target: 5 },
  { week: 'W4', avg: 3.5, target: 5 },
  { week: 'W5', avg: 3.2, target: 5 },
  { week: 'W6', avg: 3.8, target: 5 },
  { week: 'W7', avg: 3.1, target: 5 },
];

const fatalityData = [
  { month: 'Jul', fatalities: 12, injuries: 45 },
  { month: 'Aug', fatalities: 8, injuries: 38 },
  { month: 'Sep', fatalities: 15, injuries: 52 },
  { month: 'Oct', fatalities: 6, injuries: 30 },
  { month: 'Nov', fatalities: 9, injuries: 41 },
  { month: 'Dec', fatalities: 18, injuries: 60 },
  { month: 'Jan', fatalities: 7, injuries: 34 },
];

const powScoreData = [
  { name: 'Excellent (1000+)', value: 45 },
  { name: 'Good (500-999)', value: 30 },
  { name: 'Average (200-499)', value: 18 },
  { name: 'Poor (<200)', value: 7 },
];

const staffAvailabilityData = [
  { hour: '00:00', online: 120, standby: 80, responding: 15 },
  { hour: '04:00', online: 95, standby: 90, responding: 8 },
  { hour: '08:00', online: 280, standby: 60, responding: 25 },
  { hour: '12:00', online: 310, standby: 45, responding: 35 },
  { hour: '16:00', online: 290, standby: 55, responding: 30 },
  { hour: '20:00', online: 200, standby: 70, responding: 20 },
];

const signInData = [
  { day: 'Mon', signIns: 342, signOuts: 335 },
  { day: 'Tue', signIns: 356, signOuts: 348 },
  { day: 'Wed', signIns: 338, signOuts: 330 },
  { day: 'Thu', signIns: 361, signOuts: 355 },
  { day: 'Fri', signIns: 345, signOuts: 340 },
  { day: 'Sat', signIns: 220, signOuts: 215 },
  { day: 'Sun', signIns: 198, signOuts: 190 },
];

const COLORS = {
  primary: 'hsl(145, 65%, 38%)',
  accent: 'hsl(43, 96%, 52%)',
  destructive: 'hsl(0, 72%, 50%)',
  info: 'hsl(200, 80%, 50%)',
  muted: 'hsl(160, 10%, 50%)',
  saps: 'hsl(210, 80%, 42%)',
  ems: 'hsl(0, 85%, 50%)',
  health: 'hsl(145, 65%, 38%)',
  transport: 'hsl(43, 96%, 52%)',
  roads: 'hsl(30, 70%, 45%)',
};

const chartTooltipStyle = {
  backgroundColor: 'hsl(160, 16%, 9%)',
  border: '1px solid hsl(160, 12%, 16%)',
  borderRadius: '8px',
  color: 'hsl(60, 10%, 92%)',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono, monospace',
  padding: '8px 12px',
  boxShadow: '0 4px 20px hsl(0, 0%, 0%, 0.4)',
};

function ChartWrapper({ children, title, analysis }: { children: React.ReactNode; title: string; analysis?: string }) {
  return (
    <motion.div
      className="dashboard-card relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</h3>
      {analysis && (
        <p className="text-[10px] text-primary/80 mb-3 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-primary inline-block" />
          {analysis}
        </p>
      )}
      {children}
    </motion.div>
  );
}

export function IncidentBarChart() {
  return (
    <ChartWrapper title="Incidents by Type — Monthly" analysis="Dec peak: +25% crashes. Holiday season correlation detected.">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={incidentData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="month" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="crashes" fill={COLORS.destructive} radius={[2, 2, 0, 0]} name="Crashes" animationDuration={1200} />
          <Bar dataKey="robberies" fill={COLORS.saps} radius={[2, 2, 0, 0]} name="Robberies" animationDuration={1400} />
          <Bar dataKey="medical" fill={COLORS.primary} radius={[2, 2, 0, 0]} name="Medical" animationDuration={1600} />
          <Bar dataKey="fires" fill={COLORS.accent} radius={[2, 2, 0, 0]} name="Fires" animationDuration={1800} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function ResponseTimeChart() {
  return (
    <ChartWrapper title="Avg Response Time — Weekly" analysis="Trending ↓ from 4.8 to 3.1min. AI routing active.">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={responseTimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="week" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} unit="m" />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Line type="monotone" dataKey="avg" stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary, r: 4, strokeWidth: 2, stroke: 'hsl(160, 16%, 9%)' }} name="Avg (min)" animationDuration={1500} />
          <Line type="monotone" dataKey="target" stroke={COLORS.destructive} strokeWidth={1} strokeDasharray="5 5" dot={false} name="Target" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function FatalityInjuryChart() {
  return (
    <ChartWrapper title="Fatalities & Injuries — Monthly" analysis="-34% fatalities YoY. Rural satellite deployment effective.">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={fatalityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="month" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area type="monotone" dataKey="injuries" fill="hsl(43, 96%, 52%, 0.2)" stroke={COLORS.accent} strokeWidth={2} name="Injuries" animationDuration={1200} />
          <Area type="monotone" dataKey="fatalities" fill="hsl(0, 72%, 50%, 0.3)" stroke={COLORS.destructive} strokeWidth={2} name="Fatalities" animationDuration={1500} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function PoWScoreDistribution() {
  return (
    <ChartWrapper title="PoW Score Distribution" analysis="45% Excellent. 7% flagged for review.">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={powScoreData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" animationDuration={1200}>
            <Cell fill={COLORS.primary} />
            <Cell fill={COLORS.info} />
            <Cell fill={COLORS.accent} />
            <Cell fill={COLORS.destructive} />
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function StaffAvailabilityChart() {
  return (
    <ChartWrapper title="Staff Availability — 24hr" analysis="Peak at 12:00 (310 online). Night coverage stable.">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={staffAvailabilityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="hour" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area type="monotone" dataKey="online" stackId="1" fill="hsl(145, 65%, 38%, 0.3)" stroke={COLORS.primary} name="Online" animationDuration={1200} />
          <Area type="monotone" dataKey="standby" stackId="1" fill="hsl(43, 96%, 52%, 0.3)" stroke={COLORS.accent} name="Standby" animationDuration={1400} />
          <Area type="monotone" dataKey="responding" stackId="1" fill="hsl(200, 80%, 50%, 0.3)" stroke={COLORS.info} name="Responding" animationDuration={1600} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function SignInOutChart() {
  return (
    <ChartWrapper title="Sign-In / Sign-Out — Weekly" analysis="Weekend drop expected. Mon-Fri avg: 348.">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={signInData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="day" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="signIns" fill={COLORS.primary} radius={[2, 2, 0, 0]} name="Sign-Ins" animationDuration={1200} />
          <Bar dataKey="signOuts" fill={COLORS.muted} radius={[2, 2, 0, 0]} name="Sign-Outs" animationDuration={1400} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

// Department-specific charts
export function SAPSCrimeChart() {
  const data = [
    { type: 'Armed Robbery', count: 24, resolved: 18 },
    { type: 'Hijacking', count: 15, resolved: 12 },
    { type: 'House Break', count: 32, resolved: 20 },
    { type: 'Assault', count: 18, resolved: 14 },
    { type: 'Stock Theft', count: 8, resolved: 6 },
  ];
  return (
    <ChartWrapper title="Crime Statistics — Active vs Resolved" analysis="75% resolution rate. House Break highest volume.">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis type="number" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis type="category" dataKey="type" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 9, fontFamily: 'JetBrains Mono' }} width={80} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="count" fill={COLORS.saps} radius={[0, 2, 2, 0]} name="Reported" animationDuration={1200} />
          <Bar dataKey="resolved" fill={COLORS.primary} radius={[0, 2, 2, 0]} name="Resolved" animationDuration={1400} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function EMSResponseChart() {
  const data = [
    { unit: 'Unit 247', responses: 12, avgTime: 3.2 },
    { unit: 'Unit 112', responses: 9, avgTime: 4.1 },
    { unit: 'Unit 302', responses: 15, avgTime: 3.8 },
    { unit: 'Netcare 8', responses: 7, avgTime: 5.2 },
    { unit: 'Fire 7', responses: 6, avgTime: 4.5 },
  ];
  return (
    <ChartWrapper title="Unit Response Performance" analysis="Unit 302 leads with 15 responses. Netcare 8 needs review.">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="unit" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="responses" fill={COLORS.ems} radius={[2, 2, 0, 0]} name="Responses" animationDuration={1200} />
          <Bar dataKey="avgTime" fill={COLORS.accent} radius={[2, 2, 0, 0]} name="Avg Time (min)" animationDuration={1400} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function HealthCapacityChart() {
  const data = [
    { name: 'Polokwane Provincial', total: 120, occupied: 78, icu: 8 },
    { name: 'Mankweng', total: 80, occupied: 68, icu: 4 },
    { name: 'Mediclinic', total: 60, occupied: 32, icu: 6 },
    { name: 'Life St Dominics', total: 45, occupied: 30, icu: 3 },
  ];
  return (
    <ChartWrapper title="Hospital Bed Capacity" analysis="Mankweng at 85% capacity. ICU beds limited.">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="name" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 8, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="total" fill={COLORS.primary} radius={[2, 2, 0, 0]} name="Total Beds" animationDuration={1200} />
          <Bar dataKey="occupied" fill={COLORS.accent} radius={[2, 2, 0, 0]} name="Occupied" animationDuration={1400} />
          <Bar dataKey="icu" fill={COLORS.destructive} radius={[2, 2, 0, 0]} name="ICU" animationDuration={1600} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function RoadsConditionChart() {
  const data = [
    { route: 'N1', potholes: 12, cracks: 8, floods: 2 },
    { route: 'R71', potholes: 5, cracks: 15, floods: 3 },
    { route: 'R81', potholes: 8, cracks: 6, floods: 5 },
    { route: 'M10', potholes: 18, cracks: 3, floods: 0 },
    { route: 'R36', potholes: 3, cracks: 10, floods: 1 },
  ];
  return (
    <ChartWrapper title="Road Conditions by Route" analysis="M10 pothole concentration highest. R71 cracking severe.">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="route" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="potholes" fill={COLORS.roads} radius={[2, 2, 0, 0]} name="Potholes" animationDuration={1200} />
          <Bar dataKey="cracks" fill={COLORS.accent} radius={[2, 2, 0, 0]} name="Cracks" animationDuration={1400} />
          <Bar dataKey="floods" fill={COLORS.info} radius={[2, 2, 0, 0]} name="Floods" animationDuration={1600} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function TransportFlowChart() {
  const data = [
    { time: '06:00', volume: 1200, speed: 85 },
    { time: '08:00', volume: 3500, speed: 45 },
    { time: '10:00', volume: 2200, speed: 70 },
    { time: '12:00', volume: 2800, speed: 60 },
    { time: '14:00', volume: 2400, speed: 65 },
    { time: '16:00', volume: 3800, speed: 40 },
    { time: '18:00', volume: 3200, speed: 50 },
    { time: '20:00', volume: 1500, speed: 80 },
  ];
  return (
    <ChartWrapper title="Traffic Flow — Volume & Speed" analysis="Rush hour peaks at 08:00 & 16:00. Speed inversely correlates.">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
          <XAxis dataKey="time" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis yAxisId="left" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(160, 10%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Line yAxisId="left" type="monotone" dataKey="volume" stroke={COLORS.accent} strokeWidth={2} name="Volume" animationDuration={1500} dot={{ r: 3, fill: COLORS.accent, stroke: 'hsl(160, 16%, 9%)', strokeWidth: 2 }} />
          <Line yAxisId="right" type="monotone" dataKey="speed" stroke={COLORS.primary} strokeWidth={2} name="Speed (km/h)" animationDuration={1500} dot={{ r: 3, fill: COLORS.primary, stroke: 'hsl(160, 16%, 9%)', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
