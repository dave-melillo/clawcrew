'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Radio, Calendar, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Crew', icon: Users },
  { href: '/channels', label: 'Channels', icon: Radio },
  { href: '/schedules', label: 'Schedules', icon: Calendar },
  { href: '/activity', label: 'Activity', icon: Activity },
];

export function Nav() {
  const pathname = usePathname();
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8 flex items-center space-x-2">
          <div className="text-2xl">🐺</div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ClawCrew
          </span>
        </div>
        
        <div className="flex gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
        
        <div className="ml-auto">
          <span className="text-xs text-muted-foreground">MVP v0.1</span>
        </div>
      </div>
    </nav>
  );
}
