import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Settings', path: '/settings' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 md:px-8 max-w-[1240px] mx-auto">
      <div className="bg-pure-white/95 backdrop-blur-md rounded-full px-5 py-3.5 flex items-center justify-between border border-hairline-mist pill-shadow">
        {/* Logo Area */}
        <button
          onClick={() => handleNav('/dashboard')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 bg-sandstone rounded-[12px] flex items-center justify-center font-bold text-[15px] text-ink-black group-hover:scale-105 transition-transform">
            MM
          </div>
          <div>
            <div className="text-[16px] font-bold tracking-tight text-ink-black leading-tight flex items-center gap-1.5">
              MindMarket
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-fresh-grass/25 text-[11px] font-semibold text-pure-ink">
                Copilot
              </span>
            </div>
            <div className="text-[12px] text-stone-gray font-medium hidden sm:block">
              Procurement Decision Engine
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`relative py-1 cursor-pointer transition-colors ${
                  isActive ? 'text-ink-black font-semibold' : 'text-stone-gray hover:text-ink-black'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink-black rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="action"
            onClick={() => handleNav('/projects/new')}
            className="hidden sm:inline-flex items-center gap-2 group px-5"
          >
            New Project
            <div className="w-5 h-5 rounded-full bg-pure-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-pure-white" />
            </div>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="navToggle"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-ink-black" /> : <Menu className="w-5 h-5 text-ink-black" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-pure-white rounded-[24px] p-6 border border-hairline-mist card-shadow space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left py-3 px-4 rounded-[14px] text-[16px] font-medium transition-colors ${
                  currentPath === link.path ? 'bg-sandstone/50 font-bold text-ink-black' : 'text-stone-gray hover:bg-sandstone/20'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-hairline-mist">
            <Button
              variant="action"
              onClick={() => handleNav('/projects/new')}
              className="w-full justify-between"
            >
              <span>Create New Project</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
