// Mock data for Provincial Intelligent Safety dashboards

export interface Alert {
  id: string;
  type: 'crash' | 'robbery' | 'medical' | 'fire' | 'flood' | 'pothole';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  coordinates: { lat: number; lng: number };
  timestamp: Date;
  eta: string;
  status: 'active' | 'dispatched' | 'resolved';
  responders: string[];
  satelliteStatus: 'active' | 'fallback';
  sensorConfirmed: boolean;
}

export interface Worker {
  id: string;
  name: string;
  department: 'saps' | 'ems' | 'transport' | 'health' | 'roads';
  role: string;
  status: 'online' | 'standby' | 'offline' | 'responding';
  points: number;
  location: string;
  distance?: string;
  eta?: string;
  bodycamActive?: boolean;
  standbyCompliance: number;
  lastHeartbeat: Date;
}

export interface KPI {
  label: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  unit?: string;
}

export const mockAlerts: Alert[] = [
  { id: 'ALT-001', type: 'crash', severity: 'critical', location: 'N1 Highway, Polokwane', coordinates: { lat: -23.9045, lng: 29.4586 }, timestamp: new Date(), eta: '3 min 42s', status: 'dispatched', responders: ['Ambulance Unit 247', 'SAPS Flying Squad 12'], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-002', type: 'robbery', severity: 'high', location: 'Mall of the North, Polokwane', coordinates: { lat: -23.8912, lng: 29.4467 }, timestamp: new Date(Date.now() - 120000), eta: '4 min 12s', status: 'active', responders: ['SAPS Unit 34'], satelliteStatus: 'active', sensorConfirmed: false },
  { id: 'ALT-003', type: 'medical', severity: 'high', location: 'Mankweng Hospital Area', coordinates: { lat: -23.8800, lng: 29.7200 }, timestamp: new Date(Date.now() - 300000), eta: '6 min 20s', status: 'dispatched', responders: ['Netcare Unit 8', 'Ambulance Unit 112'], satelliteStatus: 'fallback', sensorConfirmed: false },
  { id: 'ALT-004', type: 'flood', severity: 'medium', location: 'R81 Bridge, Tzaneen', coordinates: { lat: -23.8300, lng: 30.1600 }, timestamp: new Date(Date.now() - 600000), eta: 'N/A', status: 'active', responders: [], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-005', type: 'crash', severity: 'critical', location: 'R71 near Haenertsburg', coordinates: { lat: -23.9400, lng: 29.9400 }, timestamp: new Date(Date.now() - 60000), eta: '2 min 15s', status: 'dispatched', responders: ['Ambulance Unit 302', 'SAPS Unit 19', 'Fire Unit 7'], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-006', type: 'pothole', severity: 'low', location: 'M10 Seshego Road', coordinates: { lat: -23.8500, lng: 29.4100 }, timestamp: new Date(Date.now() - 3600000), eta: 'N/A', status: 'active', responders: [], satelliteStatus: 'active', sensorConfirmed: true },
];

export const mockWorkers: Worker[] = [
  { id: 'W-001', name: 'Constable Mthembu', department: 'saps', role: 'Flying Squad', status: 'responding', points: 1240, location: 'En route to Mall of the North', distance: '1.8km', eta: '3 min', bodycamActive: true, standbyCompliance: 94, lastHeartbeat: new Date() },
  { id: 'W-002', name: 'Ambulance Unit 247', department: 'ems', role: 'Paramedic', status: 'responding', points: 1580, location: 'N1 Highway approach', distance: '2.3km', eta: '4 min 12s', standbyCompliance: 98, lastHeartbeat: new Date() },
  { id: 'W-003', name: 'Sgt. Van der Merwe', department: 'saps', role: 'K9 Unit', status: 'standby', points: 890, location: 'Polokwane Central', standbyCompliance: 87, lastHeartbeat: new Date(Date.now() - 15000) },
  { id: 'W-004', name: 'Paramedic Nkosi', department: 'ems', role: 'Advanced Life Support', status: 'online', points: 1100, location: 'Mankweng Station', standbyCompliance: 91, lastHeartbeat: new Date(Date.now() - 5000) },
  { id: 'W-005', name: 'Officer Mahlangu', department: 'saps', role: 'Patrol', status: 'standby', points: 720, location: 'Seshego Precinct', bodycamActive: true, standbyCompliance: 82, lastHeartbeat: new Date(Date.now() - 20000) },
  { id: 'W-006', name: 'Fire Unit 7', department: 'ems', role: 'Fire & Rescue', status: 'responding', points: 1350, location: 'R71 approach', distance: '4.1km', eta: '6 min', standbyCompliance: 95, lastHeartbeat: new Date() },
  { id: 'W-007', name: 'Traffic Officer Botha', department: 'transport', role: 'Traffic Control', status: 'online', points: 680, location: 'N1/R81 Interchange', standbyCompliance: 78, lastHeartbeat: new Date(Date.now() - 10000) },
  { id: 'W-008', name: 'Dr. Mokoena', department: 'health', role: 'Emergency Physician', status: 'standby', points: 950, location: 'Polokwane Provincial Hospital', standbyCompliance: 89, lastHeartbeat: new Date(Date.now() - 8000) },
  { id: 'W-009', name: 'Inspector Langa', department: 'roads', role: 'Road Inspector', status: 'online', points: 560, location: 'M10 Seshego', standbyCompliance: 75, lastHeartbeat: new Date(Date.now() - 25000) },
  { id: 'W-010', name: 'Ambulance Unit 112', department: 'ems', role: 'Basic Life Support', status: 'responding', points: 1020, location: 'Mankweng approach', distance: '3.5km', eta: '5 min 30s', standbyCompliance: 88, lastHeartbeat: new Date() },
];

export const commandKPIs: KPI[] = [
  { label: 'Avg Response Time', value: '3.2', target: '<5', trend: 'down', unit: 'min' },
  { label: 'False Alert Rate', value: '1.1', target: '<2', trend: 'down', unit: '%' },
  { label: 'Standby Compliance', value: '87', target: '95', trend: 'up', unit: '%' },
  { label: 'Active Workers', value: '342', target: '400', trend: 'up' },
  { label: 'Satellite Uptime', value: '99.7', target: '99.9', trend: 'stable', unit: '%' },
  { label: 'Zero Death Progress', value: '25', target: '100', trend: 'up', unit: '%' },
];

export const premierKPIs: KPI[] = [
  { label: 'Provincial Response Avg', value: '3.2', target: '<5', trend: 'down', unit: 'min' },
  { label: 'False Alerts', value: '1.1', target: '<2', trend: 'down', unit: '%' },
  { label: 'Standby Compliance', value: '87', target: '95', trend: 'up', unit: '%' },
  { label: 'Incidents Today', value: '47', target: '-', trend: 'stable' },
  { label: 'Lives Saved (2024)', value: '1,234', target: '-', trend: 'up' },
  { label: 'Zero Deaths 2030', value: '25', target: '100', trend: 'up', unit: '%' },
];

export const heatmapZones = [
  { name: 'N1 Highway Corridor', risk: 92, incidents: 34, lat: -23.9045, lng: 29.4586 },
  { name: 'R71 Mountain Pass', risk: 78, incidents: 18, lat: -23.9400, lng: 29.9400 },
  { name: 'Polokwane CBD', risk: 65, incidents: 22, lat: -23.9000, lng: 29.4500 },
  { name: 'Mankweng', risk: 55, incidents: 12, lat: -23.8800, lng: 29.7200 },
  { name: 'Tzaneen R81', risk: 71, incidents: 15, lat: -23.8300, lng: 30.1600 },
  { name: 'Seshego', risk: 48, incidents: 8, lat: -23.8500, lng: 29.4100 },
  { name: 'Mokopane', risk: 60, incidents: 14, lat: -24.1950, lng: 29.0100 },
  { name: 'Thohoyandou', risk: 42, incidents: 6, lat: -22.9500, lng: 30.4800 },
];

export const trafficSigns = [
  { id: 'LED-001', location: 'N1 South — Before Polokwane Off-Ramp', road: 'N1', kmMarker: '305', direction: 'Southbound', status: 'active', message: 'ACCIDENT 1KM AHEAD — EXIT R81 NOW', type: 'critical' as const, visibility: 'high' as const, lastUpdated: '2 min ago', viewsPerHour: 4200 },
  { id: 'LED-002', location: 'R71 East — Haenertsburg Pass Entry', road: 'R71', kmMarker: '42', direction: 'Eastbound', status: 'active', message: 'ROAD CLOSED — USE DETOUR VIA R36', type: 'critical' as const, visibility: 'medium' as const, lastUpdated: '8 min ago', viewsPerHour: 1800 },
  { id: 'LED-003', location: 'N1 North — Mokopane Toll Plaza', road: 'N1', kmMarker: '280', direction: 'Northbound', status: 'idle', message: 'DRIVE SAFELY — LIMPOPO CARES', type: 'info' as const, visibility: 'high' as const, lastUpdated: '1 hr ago', viewsPerHour: 3600 },
  { id: 'LED-004', location: 'R81 — Tzaneen Bridge Approach', road: 'R81', kmMarker: '18', direction: 'Both directions', status: 'active', message: 'FLOOD WARNING — REDUCE SPEED TO 40KM/H', type: 'warning' as const, visibility: 'low' as const, lastUpdated: '5 min ago', viewsPerHour: 2100 },
  { id: 'LED-005', location: 'M10 — Seshego Main Road', road: 'M10', kmMarker: '4', direction: 'Westbound', status: 'active', message: 'POTHOLE REPAIRS — SINGLE LANE AHEAD', type: 'warning' as const, visibility: 'high' as const, lastUpdated: '12 min ago', viewsPerHour: 3100 },
  { id: 'LED-006', location: 'R36 — Lydenburg Turn-Off', road: 'R36', kmMarker: '65', direction: 'Southbound', status: 'idle', message: 'SPEED ENFORCEMENT ZONE — 80KM/H', type: 'info' as const, visibility: 'high' as const, lastUpdated: '30 min ago', viewsPerHour: 2800 },
];

export const roadConditions = [
  { id: 'RC-001', location: 'M10 Seshego — KM 4.2', type: 'pothole', severity: 'high', reported: new Date(Date.now() - 86400000), status: 'pending' },
  { id: 'RC-002', location: 'R81 Bridge Tzaneen', type: 'flood', severity: 'critical', reported: new Date(Date.now() - 3600000), status: 'active' },
  { id: 'RC-003', location: 'N1 KM 312', type: 'crack', severity: 'medium', reported: new Date(Date.now() - 172800000), status: 'scheduled' },
  { id: 'RC-004', location: 'R71 KM 45', type: 'erosion', severity: 'high', reported: new Date(Date.now() - 7200000), status: 'in_progress' },
];

export const departments = [
  { id: 'premier', name: "Office of the Premier", icon: '🏛️', color: 'primary' },
  { id: 'saps', name: 'South African Police Service', icon: '🚔', color: 'info' },
  { id: 'ems', name: 'Emergency Medical Services', icon: '🚑', color: 'emergency' },
  { id: 'transport', name: 'Department of Transport', icon: '🚦', color: 'warning' },
  { id: 'health', name: 'Department of Health', icon: '🏥', color: 'success' },
  { id: 'roads', name: 'Roads Agency Limpopo', icon: '🛣️', color: 'muted' },
] as const;

// Road status flags for Premier overview
export const roadStatusFlags = [
  { label: 'Busy Roads', color: 'accent', items: ['N1 Polokwane (Jam: 15km backup)', 'R71 Morning Rush (7-9am congestion)'] },
  { label: 'Risky Paths', color: 'destructive', items: ['R81 Tzaneen (High crash frequency)', 'N1 KM 305-310 (Speed zone)'] },
  { label: 'Under Maintenance', color: 'accent', items: ['R37 Pothole Repairs (ETA 3 days)', 'M10 KM 4 Resurfacing'] },
  { label: 'Newly Opened', color: 'success', items: ['Extended R71 Bypass Lane', 'N1 Mokopane Service Road'] },
  { label: 'Closing Soon', color: 'info', items: ['R528 Flood-Prone Section (Rainy season)', 'Rural Path Vhembe District'] },
  { label: 'Speeding Hotspots', color: 'destructive', items: ['N1 KM 300-315 (500 fines/week)', 'R71 Descent Zone'] },
  { label: 'Unsafe Streets', color: 'destructive', items: ['Polokwane CBD Night (200 citizen reports)', 'Seshego Main after 22:00'] },
];
