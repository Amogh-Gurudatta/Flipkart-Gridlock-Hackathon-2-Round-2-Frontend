"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Shield, Map, FileText, AlertTriangle, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/map",
    label: "Live Traffic Map",
    icon: Map,
    description: "Incident map & impact zones",
  },
  {
    href: "/generator",
    label: "Forecast Engine",
    icon: FileText,
    description: "Predict event impact & get deployment plan",
  },
  {
    href: "/warrants",
    label: "Dispatch Logs",
    icon: AlertTriangle,
    description: "All predicted events & recommendations",
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 w-full z-2000 h-16 flex items-center justify-between px-4"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--bg-surface) 90%, transparent)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center gap-3">
          <Shield
            size={20}
            style={{ color: "var(--accent-primary)" }}
            strokeWidth={2}
          />
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--text-primary)" }}
          >
            BTP Command
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 flex items-center justify-center cursor-pointer"
          style={{
            border: "1px solid var(--border-color)",
            backgroundColor: "transparent",
            color: "var(--text-primary)",
          }}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X size={20} strokeWidth={2} />
          ) : (
            <Menu size={20} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-1900 md:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-64 flex flex-col z-2000 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          backgroundColor: "var(--bg-surface)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield
              size={18}
              style={{ color: "var(--accent-primary)" }}
              strokeWidth={2}
            />
            <span
              className="text-[11px] font-mono font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--text-primary)" }}
            >
              BTP Operations
            </span>
          </div>
          <p
            className="text-[9px] font-mono uppercase tracking-[0.15em] mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Bengaluru Traffic Police
          </p>

          {/* LIVE DEMO badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1"
            style={{
              border: "1px solid #22c55e",
              backgroundColor: "rgba(34,197,94,0.08)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#22c55e" }}
            />
            <span
              className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]"
              style={{ color: "#22c55e" }}
            >
              Live Demo
            </span>
          </div>
        </div>

        {/* ── Navigation Links ────────────────────────────────────────── */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-4 md:py-3 transition-colors duration-150 no-underline group"
                style={{
                  borderLeft: isActive
                    ? "3px solid var(--accent-primary)"
                    : "3px solid transparent",
                  backgroundColor: isActive
                    ? "color-mix(in srgb, var(--accent-primary) 8%, transparent)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  style={{
                    color: isActive
                      ? "var(--accent-primary)"
                      : "var(--text-muted)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    className="text-xs font-mono font-bold uppercase tracking-[0.15em] leading-none mb-0.5"
                    style={{
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[9px] font-mono leading-none"
                    style={{ color: "var(--text-muted)", opacity: 0.7 }}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div
          className="px-5 py-4"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <p
            className="text-[9px] font-mono uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)", opacity: 0.5 }}
          >
            Flipkart Grid 2.0 — Round 2
          </p>
        </div>
      </aside>
    </>
  );
}
