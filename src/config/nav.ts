import { LayoutDashboard, PlayCircle, Library, BarChart3, Map, Settings, Zap, Building2 } from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Stadium Directory', href: '/stadiums', icon: Building2 },
  { name: 'Event Simulator', href: '/simulator', icon: PlayCircle },
  { name: 'Knowledge Library', href: '/library', icon: Library },
  { name: 'AI Recommendations', href: '/recommendations', icon: Zap },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Interactive Map', href: '/map', icon: Map },
  { name: 'Settings', href: '/settings', icon: Settings },
] as const;
