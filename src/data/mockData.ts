// Mock data for Lesotho Intelligent Safety dashboards

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
  department: 'lmps' | 'ems' | 'transport' | 'health' | 'roads';
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
  { id: 'ALT-001', type: 'crash', severity: 'critical', location: 'A1 Highway, Maseru North', coordinates: { lat: -29.2800, lng: 27.5100 }, timestamp: new Date(), eta: '3 min 42s', status: 'dispatched', responders: ['Ambulance Unit 247', 'LMPS Flying Squad 12'], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-002', type: 'robbery', severity: 'high', location: 'Maseru CBD Market Area', coordinates: { lat: -29.3150, lng: 27.4750 }, timestamp: new Date(Date.now() - 120000), eta: '4 min 12s', status: 'active', responders: ['LMPS Unit 34'], satelliteStatus: 'active', sensorConfirmed: false },
  { id: 'ALT-003', type: 'medical', severity: 'high', location: 'Queen Mamohato Hospital Area', coordinates: { lat: -29.3050, lng: 27.5000 }, timestamp: new Date(Date.now() - 300000), eta: '6 min 20s', status: 'dispatched', responders: ['Netcare Unit 8', 'Ambulance Unit 112'], satelliteStatus: 'fallback', sensorConfirmed: false },
  { id: 'ALT-004', type: 'flood', severity: 'medium', location: 'A3 Bridge, Teyateyaneng', coordinates: { lat: -29.1500, lng: 27.7700 }, timestamp: new Date(Date.now() - 600000), eta: 'N/A', status: 'active', responders: [], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-005', type: 'crash', severity: 'critical', location: 'A2 Mountain Pass, Semonkong Road', coordinates: { lat: -29.5200, lng: 27.8800 }, timestamp: new Date(Date.now() - 60000), eta: '2 min 15s', status: 'dispatched', responders: ['Ambulance Unit 302', 'LMPS Unit 19', 'Fire Unit 7'], satelliteStatus: 'active', sensorConfirmed: true },
  { id: 'ALT-006', type: 'pothole', severity: 'low', location: 'Main Road, Leribe District', coordinates: { lat: -28.8800, lng: 28.0500 }, timestamp: new Date(Date.now() - 3600000), eta: 'N/A', status: 'active', responders: [], satelliteStatus: 'active', sensorConfirmed: true },
];

export const mockWorkers: Worker[] = [
  { id: 'W-001', name: 'Constable Motsoari', department: 'lmps', role: 'Flying Squad', status: 'responding', points: 1240, location: 'En route to Maseru CBD', distance: '1.8km', eta: '3 min', bodycamActive: true, standbyCompliance: 94, lastHeartbeat: new Date() },
  { id: 'W-002', name: 'Ambulance Unit 247', department: 'ems', role: 'Paramedic', status: 'responding', points: 1580, location: 'A1 Highway approach', distance: '2.3km', eta: '4 min 12s', standbyCompliance: 98, lastHeartbeat: new Date() },
  { id: 'W-003', name: 'Sgt. Moeketsi', department: 'lmps', role: 'K9 Unit', status: 'standby', points: 890, location: 'Maseru Central Station', standbyCompliance: 87, lastHeartbeat: new Date(Date.now() - 15000) },
  { id: 'W-004', name: 'Paramedic Nthabiseng', department: 'ems', role: 'Advanced Life Support', status: 'online', points: 1100, location: 'Leribe Station', standbyCompliance: 91, lastHeartbeat: new Date(Date.now() - 5000) },
  { id: 'W-005', name: 'Officer Mokete', department: 'lmps', role: 'Patrol', status: 'standby', points: 720, location: 'Teyateyaneng Precinct', bodycamActive: true, standbyCompliance: 82, lastHeartbeat: new Date(Date.now() - 20000) },
  { id: 'W-006', name: 'Fire Unit 7', department: 'ems', role: 'Fire & Rescue', status: 'responding', points: 1350, location: 'A2 Mountain approach', distance: '4.1km', eta: '6 min', standbyCompliance: 95, lastHeartbeat: new Date() },
  { id: 'W-007', name: 'Traffic Officer Ramakatane', department: 'transport', role: 'Traffic Control', status: 'online', points: 680, location: 'A1/A3 Interchange, Maseru', standbyCompliance: 78, lastHeartbeat: new Date(Date.now() - 10000) },
  { id: 'W-008', name: 'Dr. Thabo', department: 'health', role: 'Emergency Physician', status: 'standby', points: 950, location: 'Queen Mamohato Memorial Hospital', standbyCompliance: 89, lastHeartbeat: new Date(Date.now() - 8000) },
  { id: 'W-009', name: 'Inspector Lebona', department: 'roads', role: 'Road Inspector', status: 'online', points: 560, location: 'Mafeteng Road Inspection', standbyCompliance: 75, lastHeartbeat: new Date(Date.now() - 25000) },
  { id: 'W-010', name: 'Ambulance Unit 112', department: 'ems', role: 'Basic Life Support', status: 'responding', points: 1020, location: 'Teyateyaneng approach', distance: '3.5km', eta: '5 min 30s', standbyCompliance: 88, lastHeartbeat: new Date() },
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
  { label: 'National Response Avg', value: '3.2', target: '<5', trend: 'down', unit: 'min' },
  { label: 'False Alerts', value: '1.1', target: '<2', trend: 'down', unit: '%' },
  { label: 'Standby Compliance', value: '87', target: '95', trend: 'up', unit: '%' },
  { label: 'Incidents Today', value: '47', target: '-', trend: 'stable' },
  { label: 'Lives Saved (2024)', value: '1,234', target: '-', trend: 'up' },
  { label: 'Zero Deaths 2030', value: '25', target: '100', trend: 'up', unit: '%' },
];

export const heatmapZones = [
  { name: 'A1 Highway Corridor', risk: 92, incidents: 34, lat: -29.2800, lng: 27.5100 },
  { name: 'A2 Mountain Pass', risk: 78, incidents: 18, lat: -29.5200, lng: 27.8800 },
  { name: 'Maseru CBD', risk: 65, incidents: 22, lat: -29.3150, lng: 27.4750 },
  { name: 'Teyateyaneng', risk: 55, incidents: 12, lat: -29.1500, lng: 27.7700 },
  { name: 'Leribe District', risk: 71, incidents: 15, lat: -28.8800, lng: 28.0500 },
  { name: 'Mafeteng', risk: 48, incidents: 8, lat: -29.8200, lng: 27.2300 },
  { name: "Mohale's Hoek", risk: 60, incidents: 14, lat: -30.1500, lng: 27.4700 },
  { name: 'Butha-Buthe', risk: 42, incidents: 6, lat: -28.7700, lng: 28.2500 },
];

export const trafficSigns = [
  { id: 'LED-001', location: 'A1 North — Before Maseru Off-Ramp', road: 'A1', kmMarker: '12', direction: 'Northbound', status: 'active', message: 'ACCIDENT 1KM AHEAD — EXIT NOW', type: 'critical' as const, visibility: 'high' as const, lastUpdated: '2 min ago', viewsPerHour: 4200 },
  { id: 'LED-002', location: 'A2 East — Semonkong Pass Entry', road: 'A2', kmMarker: '42', direction: 'Eastbound', status: 'active', message: 'ROAD CLOSED — USE DETOUR VIA A3', type: 'critical' as const, visibility: 'medium' as const, lastUpdated: '8 min ago', viewsPerHour: 1800 },
  { id: 'LED-003', location: 'A1 South — Mafeteng Junction', road: 'A1', kmMarker: '65', direction: 'Southbound', status: 'idle', message: 'DRIVE SAFELY — LESOTHO CARES', type: 'info' as const, visibility: 'high' as const, lastUpdated: '1 hr ago', viewsPerHour: 3600 },
  { id: 'LED-004', location: 'A3 — Teyateyaneng Bridge Approach', road: 'A3', kmMarker: '18', direction: 'Both directions', status: 'active', message: 'FLOOD WARNING — REDUCE SPEED TO 40KM/H', type: 'warning' as const, visibility: 'low' as const, lastUpdated: '5 min ago', viewsPerHour: 2100 },
  { id: 'LED-005', location: 'A4 — Leribe Main Road', road: 'A4', kmMarker: '4', direction: 'Westbound', status: 'active', message: 'POTHOLE REPAIRS — SINGLE LANE AHEAD', type: 'warning' as const, visibility: 'high' as const, lastUpdated: '12 min ago', viewsPerHour: 3100 },
  { id: 'LED-006', location: 'A5 — Butha-Buthe Turn-Off', road: 'A5', kmMarker: '65', direction: 'Southbound', status: 'idle', message: 'SPEED ENFORCEMENT ZONE — 80KM/H', type: 'info' as const, visibility: 'high' as const, lastUpdated: '30 min ago', viewsPerHour: 2800 },
];

export const roadConditions = [
  { id: 'RC-001', location: 'A4 Leribe — KM 4.2', type: 'pothole', severity: 'high', reported: new Date(Date.now() - 86400000), status: 'pending' },
  { id: 'RC-002', location: 'A3 Bridge Teyateyaneng', type: 'flood', severity: 'critical', reported: new Date(Date.now() - 3600000), status: 'active' },
  { id: 'RC-003', location: 'A1 KM 28', type: 'crack', severity: 'medium', reported: new Date(Date.now() - 172800000), status: 'scheduled' },
  { id: 'RC-004', location: 'A2 KM 45', type: 'erosion', severity: 'high', reported: new Date(Date.now() - 7200000), status: 'in_progress' },
];

export const departments = [
  { id: 'premier', name: "Office of the Prime Minister", icon: '🏛️', color: 'primary' },
  { id: 'lmps', name: 'Lesotho Mounted Police Service', icon: '🚔', color: 'info' },
  { id: 'ems', name: 'Emergency Medical Services', icon: '🚑', color: 'emergency' },
  { id: 'transport', name: 'Ministry of Transport', icon: '🚦', color: 'warning' },
  { id: 'health', name: 'Ministry of Health', icon: '🏥', color: 'success' },
  { id: 'roads', name: 'Roads Directorate Lesotho', icon: '🛣️', color: 'muted' },
] as const;

export const roadStatusFlags = [
  { label: 'Busy Roads', color: 'accent', items: ['A1 Maseru (Jam: 10km backup)', 'A3 Morning Rush (7-9am congestion)'] },
  { label: 'Risky Paths', color: 'destructive', items: ['A2 Semonkong Pass (High crash frequency)', 'A1 KM 12-18 (Speed zone)'] },
  { label: 'Under Maintenance', color: 'accent', items: ['A4 Pothole Repairs (ETA 3 days)', 'A1 KM 28 Resurfacing'] },
  { label: 'Newly Opened', color: 'success', items: ['Extended A1 Bypass Lane', 'Maseru Ring Road Service Road'] },
  { label: 'Closing Soon', color: 'info', items: ["A2 Flood-Prone Section (Rainy season)", 'Mountain Path Thaba-Tseka District'] },
  { label: 'Speeding Hotspots', color: 'destructive', items: ['A1 KM 10-20 (500 fines/week)', 'A2 Descent Zone'] },
  { label: 'Unsafe Streets', color: 'destructive', items: ['Maseru CBD Night (200 citizen reports)', 'Leribe Main after 22:00'] },
];
