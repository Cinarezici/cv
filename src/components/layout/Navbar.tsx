"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide Navbar on dashboard & tool routes, and auth pages
  const isDashboard = pathname?.startsWith('/dashboard') || 
                      pathname?.startsWith('/builder') || 
                      pathname?.startsWith('/ats-scanner') ||
                      pathname === '/login' ||
                      pathname === '/signup';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboard) return null;

  const navLinks = [
    { name: 'Templates', href: '/templates' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl z-50 flex justify-center pointer-events-none">
      <header 
        className={`flex items-center justify-between w-full h-16 px-4 md:px-6 border border-zinc-200/80 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] pointer-events-auto transition-all ${scrolled ? 'shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] border-zinc-300/50' : ''}`}
      >
        <Link className="flex items-center gap-2 group" href="/">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 transition-transform group-hover:scale-110 shadow-md shadow-blue-600/20 flex-shrink-0">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-zinc-900 truncate">CV Optimizer AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center text-[15px] font-bold text-zinc-500">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-zinc-900 ${isActive ? 'text-blue-600' : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="w-[1px] h-4 bg-zinc-200 mx-1" />
          <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
          <Link href="/signup">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-6 h-10 shadow-sm transition-all hover:scale-105 active:scale-95">
              Get Started Free
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/login" className="text-[13px] font-bold text-zinc-600 hover:text-zinc-900">Login</Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-900"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 p-4 pointer-events-auto md:hidden"
          >
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold ${pathname === link.href ? 'text-blue-600' : 'text-zinc-500'}`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-zinc-100" />
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-zinc-900 text-white font-bold h-12 rounded-2xl">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
