import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Radio, Activity, Truck, Heart, Construction,
  LayoutDashboard, ChevronLeft, ChevronRight, Bell, Wifi, Satellite, Building2,
  Sun, Moon, Clock, LogIn, LogOut
} from 'lucide-react';
import { signOut } from '@/lib/auth';
import { useTheme } from './ThemeProvider';
import OfficialEmblem from './OfficialEmblem';

const navItems = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard, dept: 'command' },
  { path: '/premier', label: "Premier's Office", icon: Building2, dept: 'premier' },
  { path: '/saps', label: 'SAPS', icon: Radio, dept: 'saps' },
  { path: '/ems', label: 'EMS', icon: Activity, dept: 'ems' },
  { path: '/transport', label: 'Transport', icon: Truck, dept: 'transport' },
  { path: '/health', label: 'Health', icon: Heart, dept: 'health' },
  { path: '/roads', label: 'Roads Agency', icon: Construction, dept: 'roads' },
];

export default function DashboardLayout({ children, title, deptBg }: { children: React.ReactNode; title: string; deptBg?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        className="bg-sidebar border-r border-sidebar-border flex flex-col shrink-0"
      >
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <OfficialEmblem department="command" size="sm" />
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <p className="text-[10px] font-display font-bold text-primary leading-tight tracking-wider">PROVINCIAL SAFETY</p>
              <p className="text-[9px] font-display font-bold text-accent leading-tight tracking-widest">INTELLIGENCE</p>
              <p className="text-[8px] text-muted-foreground leading-tight mt-0.5">Limpopo • Republic of South Africa</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                  isActive
                    ? 'bg-sidebar-accent text-primary border-l-2 border-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                {!collapsed && <span className="truncate text-xs">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="px-3 py-2 mx-2 mb-2 rounded-md bg-primary/5 border border-primary/10">
            <p className="text-[9px] font-display text-primary uppercase tracking-widest">Republic of South Africa 🇿🇦</p>
            <p className="text-[8px] text-muted-foreground mt-0.5">Zero avoidable deaths by 2030</p>
          </div>
        )}

        <div className="p-2 border-t border-sidebar-border">
          <Link
            to="/onboarding"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <Bell className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Onboarding</span>}
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Login / Register</span>}
          </Link>
          <button
            onClick={() => {
              signOut();
              window.location.href = '/login';
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-muted-foreground hover:bg-sidebar-accent/50 w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-muted-foreground hover:bg-sidebar-accent/50 w-full"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card/50">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xs font-semibold text-foreground tracking-wider uppercase">{title}</h1>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-display">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3 h-3 text-accent" /> : <Moon className="w-3 h-3 text-info" />}
              <span className="uppercase tracking-wider">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent" />
              {time.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-success" /> Network
            </span>
            <span className="flex items-center gap-1">
              <Satellite className="w-3 h-3 text-success" /> Iridium
            </span>
            <motion.span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> LIVE
            </motion.span>
          </div>
        </header>
        <main className={`flex-1 overflow-auto p-6 ${deptBg || ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
