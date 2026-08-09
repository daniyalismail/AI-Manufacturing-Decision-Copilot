"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Projects', path: '/projects' },
    // { label: 'Settings', path: '/settings' },
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in cookies
    const checkAuth = () => {
      const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
      setIsAuthenticated(!!match);
    };
    checkAuth();
    // Also listen for cookie changes (if any) or just run once on mount
  }, [currentPath]);

  const handleNav = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await import('@/lib/supabase').then(m => m.supabase.auth.signOut());
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 md:px-8 max-w-[1240px] mx-auto print:hidden">
      <div className="bg-pure-white/95 backdrop-blur-md rounded-full px-5 py-3.5 flex items-center justify-between border border-hairline-mist pill-shadow">
        {/* Logo Area */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 bg-sandstone rounded-[12px] flex items-center justify-center font-bold text-[15px] text-ink-black group-hover:scale-105 transition-transform">
            PIQ
          </div>
          <div>
            <div className="text-[16px] font-bold tracking-tight text-ink-black leading-tight flex items-center gap-1.5">
              ProcureIQ
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
              <Link
                key={link.path}
                href={link.path}
                className={`relative py-1 transition-colors ${
                  isActive ? 'text-ink-black font-semibold' : 'text-stone-gray hover:text-ink-black'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink-black rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="hidden sm:block text-[14px] font-bold text-coral-pop hover:text-coral-pop/80 mr-2 transition-colors cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="hidden sm:block text-[14px] font-bold text-ink-black hover:text-sky-pop mr-2 transition-colors">
              Login
            </Link>
          )}
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
            variant="default"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full w-10 h-10 p-0 flex items-center justify-center"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-ink-black" /> : <Menu className="w-5 h-5 text-ink-black" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-pure-white rounded-[24px] p-6 border border-hairline-mist shadow-lg space-y-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left py-3 px-4 rounded-[14px] text-[16px] font-medium transition-colors ${
                  currentPath === link.path ? 'bg-sandstone/50 font-bold text-ink-black' : 'text-stone-gray hover:bg-sandstone/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-3 px-4 rounded-[14px] text-[16px] font-bold text-coral-pop hover:bg-coral-pop/10 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-3 px-4 rounded-[14px] text-[16px] font-medium text-stone-gray hover:bg-sandstone/20 transition-colors"
              >
                Login
              </Link>
            )}
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
}
