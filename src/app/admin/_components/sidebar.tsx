"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard",   label: "Dashboard" },
  { href: "/admin/precos",      label: "Preços" },
  { href: "/admin/vidros",      label: "Vidros" },
  { href: "/admin/extras",      label: "Extras" },
  { href: "/admin/orcamentos",  label: "Orçamentos" },
  { href: "/admin/referencias", label: "Referências" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const links = (
    <nav className="flex flex-col gap-0.5 flex-1">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "px-3 py-2.5 rounded-lg text-[13px] font-medium tracking-tight transition-all duration-150",
              active
                ? "bg-white/[0.07] text-white"
                : "text-white/35 hover:text-white/65 hover:bg-white/[0.03]"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 border-r border-white/[0.05] px-4 py-8 gap-8">
        <div>
          <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-1">Cristal Vidro</p>
          <p className="text-[13px] text-white/40 font-medium">Admin</p>
        </div>
        {links}
        <button
          onClick={handleLogout}
          className="text-[12px] text-white/18 hover:text-white/40 transition-colors text-left"
        >
          Sair
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14 border-b border-white/[0.05]" style={{ background: "#080808" }}>
        <p className="text-[13px] text-white/50 font-medium tracking-tight">Cristal Vidro Admin</p>
        <button
          onClick={() => setOpen(!open)}
          className="text-white/30 hover:text-white/60 transition-colors"
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {open ? (
              <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14" style={{ background: "#080808" }}>
          <div className="flex flex-col h-full px-5 py-6 gap-6">
            {links}
            <button
              onClick={handleLogout}
              className="text-[12px] text-white/20 hover:text-white/40 transition-colors text-left"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Mobile spacer */}
      <div className="lg:hidden h-14 w-full" />
    </>
  );
}
