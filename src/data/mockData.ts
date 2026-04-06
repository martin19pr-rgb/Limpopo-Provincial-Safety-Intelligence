// Mock data for Limpopo Provincial Safety Intelligence dashboards — South Africa

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
  department: 'saps' | 'ems' | 'transport' | 'health' | 'roads' | 'electricity' | 'fire';
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
  { id: 'ALT-001', type: 'crash', severity: 'critical', location: 'N1 Highway, Polokwane North', coordinates: { lat: -23.7800, lng: 29.4700 }, timestamp: new Date(), eta: '3 min 42s', status: 'dispatched', responders: ['Ambulance Unit 247', 'SAPS Flying Squad 12'], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-002', type: 'robbery', severity: 'high', location: 'Polokwane CBD, Civic Square', coordinates: { lat: -23.9050, lng: 29.4680 }, timestamp: new Date(Date.now() - 120000), eta: '4 min 12s', status: 'active', responders: ['SAPS Unit 34'], satelliteStatus: 'active', sensorConfirmed: false },
  { id: 'ALT-003', type: 'medical', severity: 'high', location: 'Mankweng Hospital Area', coordinates: { lat: -23.8700, lng: 29.7300 }, timestamp: new Date(Date.now() - 300000), eta: '6 min 20s', status: 'dispatched', responders: ['Netcare Unit 8', 'Ambulance Unit 112'], satelliteStatus: 'fallback', sensorConfirmed: false },
  { id: 'ALT-004', type: 'flood', severity: 'medium', location: 'R71 Bridge, Tzaneen', coordinates: { lat: -23.8340, lng: 30.1626 }, timestamp: new Date(Date.now() - 600000), eta: 'N/A', status: 'active', responders: [], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-005', type: 'crash', severity: 'critical', location: 'N1 South, Mokopane Junction', coordinates: { lat: -24.1920, lng: 28.9874 }, timestamp: new Date(Date.now() - 60000), eta: '2 min 15s', status: 'dispatched', responders: ['Ambulance Unit 302', 'SAPS Unit 19', 'Fire Unit 7'], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-006', type: 'pothole', severity: 'low', location: 'R81, Giyani Road', coordinates: { lat: -23.3020, lng: 30.7180 }, timestamp: new Date(Date.now() - 3600000), eta: 'N/A', status: 'active', responders: [], satelliteStatus: 'active', sensorConfirmed: true },
];

export const mockWorkers: Worker[] = [
  { id: 'W-001', name: 'Constable Malatji', department: 'saps', role: 'Flying Squad', status: 'responding', points: 1240, location: 'En route to Polokwane CBD', distance: '1.8km', eta: '3 min', bodycamActive: true, standbyCompliance: 94, lastHeartbeat: new Date() },
  { id: 'W-002', name: 'Ambulance Unit 247', department: 'ems', role: 'Paramedic', status: 'responding', points: 1580, location: 'N1 Highway approach', distance: '2.3km', eta: '4 min 12s', standbyCompliance: 98, lastHeartbeat: new Date() },
  { id: 'W-003', name: 'Sgt. Nkosi', department: 'saps', role: 'K9 Unit', status: 'standby', points: 890, location: 'Polokwane Central Station', standbyCompliance: 87, lastHeartbeat: new Date(Date.now() - 15000) },
  { id: 'W-004', name: 'Paramedic Ndlovu', department: 'ems', role: 'Advanced Life Support', status: 'online', points: 1100, location: 'Tzaneen Station', standbyCompliance: 91, lastHeartbeat: new Date(Date.now() - 5000) },
  { id: 'W-005', name: 'Officer Baloyi', department: 'saps', role: 'Patrol', status: 'standby', points: 720, location: 'Giyani Precinct', bodycamActive: true, standbyCompliance: 82, lastHeartbeat: new Date(Date.now() - 20000) },
  { id: 'W-006', name: 'Fire Unit 7', department: 'ems', role: 'Fire & Rescue', status: 'responding', points: 1350, location: 'N1 South approach', distance: '4.1km', eta: '6 min', standbyCompliance: 95, lastHeartbeat: new Date() },
  { id: 'W-007', name: 'Traffic Officer Makgoba', department: 'transport', role: 'Traffic Control', status: 'online', points: 680, location: 'N1/R71 Interchange, Polokwane', standbyCompliance: 78, lastHeartbeat: new Date(Date.now() - 10000) },
  { id: 'W-008', name: 'Dr. Mthembu', department: 'health', role: 'Emergency Physician', status: 'standby', points: 950, location: 'Polokwane Provincial Hospital', standbyCompliance: 89, lastHeartbeat: new Date(Date.now() - 8000) },
  { id: 'W-009', name: 'Inspector Mashile', department: 'roads', role: 'Road Inspector', status: 'online', points: 560, location: 'R81 Road Inspection', standbyCompliance: 75, lastHeartbeat: new Date(Date.now() - 25000) },
  { id: 'W-010', name: 'Ambulance Unit 112', department: 'ems', role: 'Basic Life Support', status: 'responding', points: 1020, location: 'Tzaneen approach', distance: '3.5km', eta: '5 min 30s', standbyCompliance: 88, lastHeartbeat: new Date() },
  { id: 'W-011', name: 'Technician Motsepe', department: 'electricity', role: 'Grid Technician', status: 'online', points: 820, location: 'Polokwane North Substation', standbyCompliance: 86, lastHeartbeat: new Date(Date.now() - 12000) },
  { id: 'W-012', name: 'Engineer Ramaphosa', department: 'electricity', role: 'Senior Engineer', status: 'standby', points: 1140, location: 'Eskom Control Room, Polokwane', standbyCompliance: 92, lastHeartbeat: new Date(Date.now() - 6000) },
  { id: 'W-013', name: 'Fire Unit Polokwane-1', department: 'fire', role: 'Fire Fighter', status: 'standby', points: 1080, location: 'Polokwane Central Fire Station', standbyCompliance: 97, lastHeartbeat: new Date(Date.now() - 3000) },
  { id: 'W-014', name: 'Chief Mokwena', department: 'fire', role: 'Station Commander', status: 'online', points: 1420, location: 'Polokwane Fire HQ', standbyCompliance: 99, lastHeartbeat: new Date() },
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
  { name: 'N1 Highway Corridor', risk: 92, incidents: 34, lat: -23.7800, lng: 29.4700 },
  { name: 'Mokopane Junction', risk: 78, incidents: 18, lat: -24.1920, lng: 28.9874 },
  { name: 'Polokwane CBD', risk: 65, incidents: 22, lat: -23.9050, lng: 29.4680 },
  { name: 'Tzaneen District', risk: 55, incidents: 12, lat: -23.8340, lng: 30.1626 },
  { name: 'Lephalale Area', risk: 71, incidents: 15, lat: -23.6796, lng: 27.7100 },
  { name: 'Giyani Zone', risk: 48, incidents: 8, lat: -23.3020, lng: 30.7180 },
  { name: 'Musina Border', risk: 60, incidents: 14, lat: -22.3459, lng: 29.9974 },
  { name: 'Thohoyandou', risk: 42, incidents: 6, lat: -22.9460, lng: 30.4797 },
];

export const trafficSigns = [
  { id: 'LED-001', location: 'N1 North — Before Polokwane On-Ramp', road: 'N1', kmMarker: '12', direction: 'Northbound', status: 'active', message: 'ACCIDENT 1KM AHEAD — EXIT NOW', type: 'critical' as const, visibility: 'high' as const, lastUpdated: '2 min ago', viewsPerHour: 4200 },
  { id: 'LED-002', location: 'R71 East — Tzaneen Pass Entry', road: 'R71', kmMarker: '42', direction: 'Eastbound', status: 'active', message: 'ROAD CLOSED — USE DETOUR VIA N1', type: 'critical' as const, visibility: 'medium' as const, lastUpdated: '8 min ago', viewsPerHour: 1800 },
  { id: 'LED-003', location: 'N1 South — Mokopane Junction', road: 'N1', kmMarker: '65', direction: 'Southbound', status: 'idle', message: 'DRIVE SAFELY — LIMPOPO CARES', type: 'info' as const, visibility: 'high' as const, lastUpdated: '1 hr ago', viewsPerHour: 3600 },
  { id: 'LED-004', location: 'R71 — Tzaneen Bridge Approach', road: 'R71', kmMarker: '18', direction: 'Both directions', status: 'active', message: 'FLOOD WARNING — REDUCE SPEED TO 40KM/H', type: 'warning' as const, visibility: 'low' as const, lastUpdated: '5 min ago', viewsPerHour: 2100 },
  { id: 'LED-005', location: 'R81 — Giyani Main Road', road: 'R81', kmMarker: '4', direction: 'Westbound', status: 'active', message: 'POTHOLE REPAIRS — SINGLE LANE AHEAD', type: 'warning' as const, visibility: 'high' as const, lastUpdated: '12 min ago', viewsPerHour: 3100 },
  { id: 'LED-006', location: 'N11 — Mokopane Turn-Off', road: 'N11', kmMarker: '65', direction: 'Southbound', status: 'idle', message: 'SPEED ENFORCEMENT ZONE — 80KM/H', type: 'info' as const, visibility: 'high' as const, lastUpdated: '30 min ago', viewsPerHour: 2800 },
];

export const roadConditions = [
  { id: 'RC-001', location: 'R81 Giyani — KM 4.2', type: 'pothole', severity: 'high', reported: new Date(Date.now() - 86400000), status: 'pending' },
  { id: 'RC-002', location: 'R71 Bridge Tzaneen', type: 'flood', severity: 'critical', reported: new Date(Date.now() - 3600000), status: 'active' },
  { id: 'RC-003', location: 'N1 KM 28', type: 'crack', severity: 'medium', reported: new Date(Date.now() - 172800000), status: 'scheduled' },
  { id: 'RC-004', location: 'N11 KM 45', type: 'erosion', severity: 'high', reported: new Date(Date.now() - 7200000), status: 'in_progress' },
];

export const departments = [
  { id: 'premier', name: "Office of the Premier — Limpopo", icon: '🏛️', color: 'primary' },
  { id: 'saps', name: 'South African Police Service', icon: '🚔', color: 'info' },
  { id: 'ems', name: 'Emergency Medical Services', icon: '🚑', color: 'emergency' },
  { id: 'transport', name: 'Limpopo Dept of Transport', icon: '🚦', color: 'warning' },
  { id: 'health', name: 'Limpopo Dept of Health', icon: '🏥', color: 'success' },
  { id: 'roads', name: 'Roads Agency Limpopo', icon: '🛣️', color: 'muted' },
] as const;

export const roadStatusFlags = [
  { label: 'Busy Roads', color: 'accent', items: ['N1 Polokwane (Jam: 10km backup)', 'R71 Morning Rush (7-9am congestion)'] },
  { label: 'Risky Paths', color: 'destructive', items: ['N1 Mokopane Pass (High crash frequency)', 'N1 KM 12-18 (Speed zone)'] },
  { label: 'Under Maintenance', color: 'accent', items: ['R81 Pothole Repairs (ETA 3 days)', 'N1 KM 28 Resurfacing'] },
  { label: 'Newly Opened', color: 'success', items: ['Extended N1 Bypass Lane', 'Polokwane Ring Road Service Road'] },
  { label: 'Closing Soon', color: 'info', items: ['R71 Flood-Prone Section (Rainy season)', 'Mountain Path Lephalale District'] },
  { label: 'Speeding Hotspots', color: 'destructive', items: ['N1 KM 10-20 (500 fines/week)', 'N11 Descent Zone'] },
  { label: 'Unsafe Streets', color: 'destructive', items: ['Polokwane CBD Night (200 citizen reports)', 'Giyani Main after 22:00'] },
];
