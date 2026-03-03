'use client';

import React from 'react';
import { Zap, Menu, X, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DocAgent
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI Document Intelligence
              </p>
            </div>
          </div>

          {/* Nav Items - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm">
              Uploads
            </Button>
            <Button variant="ghost" size="sm">
              Analytics
            </Button>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" className="hidden sm:flex">
              Upload Doc
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border pb-4 space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Uploads
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Analytics
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Settings
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full"
            >
              Upload Document
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
