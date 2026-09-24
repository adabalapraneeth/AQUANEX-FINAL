import React, { useState } from 'react';
import { 
  Droplets, 
  Activity, 
  Recycle, 
  Award, 
  LayoutDashboard, 
  AlertOctagon, 
  User, 
  Menu, 
  X, 
  Radio,
  Sun,
  Building2
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'home' | 'pollution' | 'solar' | 'ac-reuse' | 'events' | 'dashboard' | 'org-portal';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  hasCriticalAlert?: boolean;
  criticalAlertCount?: number;
  onJumpToCriticalAlert?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  hasCriticalAlert = false,
  criticalAlertCount = 0,
  onJumpToCriticalAlert
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Radio className="w-4 h-4" /> },
    { 
      id: 'pollution', 
      label: 'Pollution Assessment', 
      icon: <Activity className="w-4 h-4" />,
      badge: 'NEW'
    },
    { 
      id: 'solar', 
      label: 'Solar Treatment', 
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      badge: 'IMPACT'
    },
    { 
      id: 'ac-reuse', 
      label: 'AC Water Reuse', 
      icon: <Recycle className="w-4 h-4" />
    },
    { 
      id: 'events', 
      label: 'Events & Certificates', 
      icon: <Award className="w-4 h-4" />
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    { 
      id: 'org-portal', 
      label: 'Org Portal', 
      icon: <Building2 className="w-4 h-4 text-teal-400" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#050b14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 via-sky-600/20 to-teal-500/10 border border-cyan-400/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
            <Droplets className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-ping opacity-25" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200">
                AQUANEX
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono tracking-widest bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 rounded">
                v2.4
              </span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
              Water Intelligence &amp; Pollution Monitoring
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'text-cyan-200 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Critical Alert pill + User Profile */}
        <div className="flex items-center gap-3">
          {/* Critical Alert Indicator */}
          {hasCriticalAlert && (
            <button
              onClick={() => {
                if (onJumpToCriticalAlert) onJumpToCriticalAlert();
                else onSelectTab('pollution');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-red-950/80 border border-red-500/60 text-red-300 rounded-md animate-pulse hover:bg-red-900/80 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-colors"
              title="Critical Water Pollution Alert active - click to inspect"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">CRITICAL ALERT</span>
              <span className="px-1.5 py-0.2 text-[10px] bg-red-600 text-white rounded-full">
                {criticalAlertCount || 1}
              </span>
            </button>
          )}

          {/* User profile toggle button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-slate-200 rounded-md transition-all text-xs font-mono group"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:border-cyan-400">
              <User className="w-3 h-3" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[11px] font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </div>
              <div className="text-[9px] text-cyan-400 leading-tight">
                {user.role.split(' ')[0]}
              </div>
            </div>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-cyan-300 bg-slate-900/80 border border-slate-800 rounded-md"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cyan-500/20 bg-[#050b14]/95 px-4 pt-3 pb-4 space-y-1.5 backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'text-cyan-200 bg-cyan-950/70 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-cyan-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-cyan-400 text-slate-950 font-bold rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
