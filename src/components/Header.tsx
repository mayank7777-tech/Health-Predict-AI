/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Bell, Plus, ShieldCheck, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewAssessment: () => void;
  activeViewTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onNewAssessment,
  activeViewTitle
}) => {
  const { currentUser } = useAuth();

  return (
    <header className="h-18 px-6 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
      {/* Left: Clinician greeting and current context */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Good morning, {currentUser.name}
              <Sun className="w-4 h-4 text-amber-400" />
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Monitoring
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Monday, 17 March 2026 · {currentUser.department}
            {activeViewTitle && (
              <span className="text-slate-400">
                {' '}
                / <span className="text-slate-300 font-medium">{activeViewTitle}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Search, Notification, and Primary Action CTA */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patients, encounters, diagnoses..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <button
          onClick={onNewAssessment}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Risk Prediction</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-800/60 rounded-lg border border-slate-700/60 text-[11px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>UCI-ML v2.4</span>
        </div>
      </div>
    </header>
  );
};
