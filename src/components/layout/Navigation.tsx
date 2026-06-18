'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Shield,
  Map,
  FileText,
  AlertTriangle,
  LogOut,
  Menu,
  Database,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/map',
    label: 'Traffic Map',
    icon: Map,
  },
  {
    href: '/database',
    label: 'Incident Database',
    icon: Database,
  },
  {
    href: '/generator',
    label: 'Deployment Orders',
    icon: FileText,
  },
  {
    href: '/warrants',
    label: 'Dispatch Log',
    icon: AlertTriangle,
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 w-full z-2000 h-16 flex items-center justify-between px-4"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div className="flex items-center gap-3">
          <Shield size={20} style={{ color: 'var(--accent-primary)' }} strokeWidth={2} />
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
            BTP Command
          </span>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 flex items-center justify-center rounded-none cursor-pointer"
          style={{
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)'
          }}
          aria-label="Toggle Menu"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-1900 md:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-64 flex flex-col z-2000 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-6"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <Shield
              size={18}
              style={{ color: 'var(--accent-primary)' }}
              strokeWidth={2}
            />
            <span
              className="text-[11px] font-mono font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-primary)' }}
            >
              BTP Operations
            </span>
          </div>
          <p
            className="mt-2 text-[9px] font-mono uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Bengaluru Traffic Police
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const label = item.label;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-4 md:py-3 text-xs font-mono uppercase tracking-[0.15em] transition-colors duration-150 no-underline"
                style={{
                  borderLeft: isActive
                    ? '4px solid var(--accent-primary)'
                    : '4px solid transparent',
                  backgroundColor: isActive
                    ? 'color-mix(in srgb, var(--accent-primary) 8%, transparent)'
                    : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-5 py-5 space-y-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          {/* Disconnect */}
          <button
            id="disconnect-btn"
            type="button"
            onClick={() => {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              router.push('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-3 md:py-2 text-[10px] font-mono uppercase tracking-[0.2em] cursor-pointer transition-opacity duration-150 hover:opacity-70"
            style={{
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
            }}
          >
            <LogOut size={12} strokeWidth={2} />
            Disconnect
          </button>
        </div>
      </aside>
    </>
  );
}
