import { useRef, useState, useEffect, useCallback } from 'react';
import { Home, User, Flame, Search, Info, X, Code2 } from 'lucide-react';
import { OptionWheel } from '@/components/OptionWheel';

export type PageId = 'home' | 'your-scripts' | 'popular' | 'search' | 'about';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'your-scripts', label: 'Your Scripts', icon: <User className="w-5 h-5" /> },
  { id: 'popular', label: 'Popular', icon: <Flame className="w-5 h-5" /> },
  { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
  { id: 'about', label: 'About', icon: <Info className="w-5 h-5" /> },
];

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
  scriptCount: number;
}

export function Sidebar({ currentPage, onNavigate, isOpen, onClose, scriptCount }: SidebarProps) {
  const currentIndex = navItems.findIndex(i => i.id === currentPage);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-md"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl blur-lg opacity-50 animate-pulse" style={{ background: 'rgba(59, 130, 246, 0.4)' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text-static">ScriptHub</h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Roblox Scripts</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Option Wheel Navigation */}
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <p className="text-xs uppercase tracking-[0.2em] mb-4 mt-4" style={{ color: 'var(--text-secondary)' }}>
            Navigate
          </p>
          <OptionWheel
            items={navItems}
            defaultSelected={currentIndex >= 0 ? currentIndex : 0}
            onChange={(index, id) => onNavigate(id as PageId)}
            activeColor="#60a5fa"
            textColor="#6a6a80"
            fontSize={1.4}
            spacing={1.8}
            tilt={10}
            blur={1.5}
            fade={0.35}
            smoothing={250}
          />
          {/* Scroll hint */}
          <div className="flex items-center gap-2 mt-4 text-xs animate-pulse" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex flex-col gap-0.5">
              <div className="w-3 h-0.5 rounded-full bg-current opacity-60" />
              <div className="w-3 h-0.5 rounded-full bg-current opacity-40" />
              <div className="w-3 h-0.5 rounded-full bg-current opacity-20" />
            </div>
            <span>Scroll to navigate</span>
          </div>
        </div>

        {/* Stats card */}
        <div className="p-4">
          <div className="p-4 rounded-xl border relative overflow-hidden group" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1), transparent)' }} />
            <div className="relative">
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Community</p>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-semibold">{scriptCount} Scripts</p>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Growing every day</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
            Made with passion for Roblox
          </p>
        </div>
      </aside>
    </>
  );
}
