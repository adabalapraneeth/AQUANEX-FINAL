import React, { useState } from 'react';
import { User, ShieldCheck, Building2, Mail, Lock, Check, LogIn, UserPlus, LogOut, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (user: UserProfile) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'register'>('profile');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserProfile['role']>(currentUser.role);
  const [organization, setOrganization] = useState(currentUser.organization);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...currentUser,
      name: name.trim() || 'Elena Vance',
      email: email.trim() || 'operator@aquanex.org',
      role,
      organization: organization.trim() || 'AQUANEX Water Monitoring',
      isAuthenticated: true
    });
    setStatusNotice('Credentials updated and encrypted on session storage.');
    setTimeout(() => {
      setStatusNotice(null);
      onClose();
    }, 1200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...currentUser,
      email: email.trim() || 'operator@aquanex.org',
      isAuthenticated: true
    });
    setStatusNotice(`Welcome back! Session authorized for ${email}.`);
    setTimeout(() => {
      setStatusNotice(null);
      onClose();
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim() || 'New Operator',
      email: email.trim(),
      role,
      organization: organization.trim() || 'Independent Environmental Steward',
      isAuthenticated: true
    });
    setStatusNotice(`Account created successfully! Welcome, ${name}.`);
    setTimeout(() => {
      setStatusNotice(null);
      onClose();
    }, 1200);
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      onSaveUser({
        ...currentUser,
        name: 'Guest Observer',
        email: 'guest@aquanex.org',
        role: 'Community Volunteer',
        isAuthenticated: false
      });
    }
    setStatusNotice('Logged out of telemetry session.');
    setTimeout(() => {
      setStatusNotice(null);
      onClose();
    }, 1000);
  };

  const ROLES: UserProfile['role'][] = [
    'Authorized Organization Admin',
    'Industrial Plant Operator',
    'Environmental Auditor',
    'Community Volunteer'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AQUANEX Authentication &amp; Roles</h3>
              <p className="text-[11px] text-slate-400 font-mono">Secure Operator Session Terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-mono"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 rounded transition-colors ${
              activeTab === 'profile'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Current Session
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`py-1.5 rounded transition-colors ${
              activeTab === 'login'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-1.5 rounded transition-colors ${
              activeTab === 'register'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Notice banner */}
        {statusNotice && (
          <div className="p-2.5 bg-cyan-950 border border-cyan-500/40 rounded-lg text-xs font-mono text-cyan-200 flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* TAB 1: Profile & Role Switch */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Operator Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Authorized Role &amp; Permissions</label>
              <div className="space-y-1.5 pt-1">
                {ROLES.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      role === r
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-sans font-medium">{r}</span>
                    <input
                      type="radio"
                      name="userRole"
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="accent-cyan-400"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Organization / Department</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLogoutAction}
                className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-lg text-xs flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: Sign In */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Account Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@aquanex.org"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Access Token / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg text-[11px] text-slate-300 font-sans">
              Demo session: Sign in will authenticate your profile across telemetry and organizational oversight modules.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Authorize &amp; Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jordan Mercer"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="j.mercer@state-pollution-board.gov"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Organization / Company</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Regional Environmental Protection Consortium"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Designated Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-bold rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Operator Account</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
