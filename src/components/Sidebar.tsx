/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  HeartPulse,
  Brain,
  History,
  FileText,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavView =
  | 'dashboard'
  | 'patients'
  | 'assessment'
  | 'prioritization'
  | 'history'
  | 'analytics'
  | 'model'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenLanding: () => void;
  patientCount: number;
  highRiskCount: number;
}

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
  isPrimary?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenLanding,
  patientCount,
  highRiskCount
}) => {
  const { currentUser, switchRole } = useAuth();

  const navItems: NavGroup[] = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'patients', label: 'Patients', icon: Users, badge: patientCount },
        { id: 'prioritization', label: 'Priority Patient Queue', icon: HeartPulse, badge: highRiskCount, badgeColor: 'bg-rose-500/20 text-rose-300' }
      ]
    },
    {
      group: 'AI & PREDICTIONS',
      items: [
        { id: 'assessment', label: 'Risk Prediction', icon: Brain, isPrimary: true },
        { id: 'history', label: 'Prediction History', icon: History },
        { id: 'model', label: 'ML Models & Pipeline', icon: Activity }
      ]
    },
    {
      group: 'CLINICAL INTELLIGENCE',
      items: [
        { id: 'analytics', label: 'Population Analytics', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports & Export', icon: FileText },
        { id: 'settings', label: 'Settings & Governance', icon: Sliders }
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800/80 flex flex-col h-screen select-none">
      {/* Top Brand Mark */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-900/30 text-white font-bold text-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              HealthPredict <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold uppercase">AI</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">Hospital Readmission DSS</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                      isActive
                        ? 'bg-slate-800/90 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r" />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Public Landing Link */}
        <div className="pt-2 px-3">
          <button
            onClick={onOpenLanding}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors border border-slate-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              Public Overview & Docs
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* User & Role Switcher Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xs font-bold">
                {currentUser.avatarInitials}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.roleTitle}</div>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher for clinical demo */}
          <div className="flex items-center gap-1 pt-1 border-t border-slate-700/50 text-[10px]">
            <span className="text-slate-400 mr-1">Role:</span>
            <button
              onClick={() => switchRole('doctor')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                currentUser.role === 'doctor'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Doctor
            </button>
            <button
              onClick={() => switchRole('analyst')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                currentUser.role === 'analyst'
                  ? 'bg-blue-500/20 text-blue-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyst
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
