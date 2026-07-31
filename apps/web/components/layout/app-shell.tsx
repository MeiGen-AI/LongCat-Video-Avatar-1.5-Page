'use client';
import Link from 'next/link';
import {
  Bell,
  Clapperboard,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { CreditPill, ThemeToggle } from '../ui';
const links = [
  { href: '/studio', label: 'Studio', icon: Clapperboard },
  { href: '/library', label: 'Library', icon: FolderOpen },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0e0e11] p-6 lg:block">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          fakhm<span className="text-amber">.</span>
        </Link>
        <nav className="mt-16 space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${pathname.startsWith(href) ? 'bg-amber text-ink' : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          <CreditPill credits={0} />
          <ThemeToggle />
        </div>
      </aside>
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
