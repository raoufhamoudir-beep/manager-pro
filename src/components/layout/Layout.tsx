import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Package,
  Briefcase,
  History,
  Settings,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const navItems = [
  { label: 'الرئيسية', icon: LayoutDashboard, path: '/' },
  { label: 'الطلبات', icon: ShoppingBag, path: '/orders' },
  { label: 'المالية', icon: Wallet, path: '/finance' },
  { label: 'المستودع', icon: Package, path: '/stock' },
  { label: 'الأصول', icon: Briefcase, path: '/assets' },
  { label: 'الأرشيف', icon: History, path: '/history' },
  { label: 'الإعدادات', icon: Settings, path: '/settings' },
];

const NavButton = ({ item }: { item: any }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center flex-1 min-w-0 transition-all duration-500 relative group ${
        isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div
          className={`p-2.5 rounded-2xl transition-all duration-500 ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110'
              : 'bg-transparent group-hover:bg-slate-50'
          }`}
        >
          <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span
          className={`text-[10px] md:text-xs font-black mt-1.5 w-full text-center truncate px-1 transition-all duration-500 ${
            isActive ? 'opacity-100 translate-y-0' : 'opacity-60 -translate-y-1 md:translate-y-0'
          }`}
        >
          {item.label}
        </span>
      </>
    )}
  </NavLink>
);

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden" dir="rtl">
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-24 items-center justify-between bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] px-10">
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <NavButton key={item.label} item={item} />
          ))}
        </div>
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="font-black text-3xl text-blue-600  items-center tracking-tighter italic select-none"
        >
          MANAGER<span className="text-slate-900 ml-1">PRO</span>
        </motion.h1>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 md:hidden flex justify-around items-stretch z-50 px-3 py-2 shadow-[0_-15px_40px_rgba(0,0,0,0.04)] h-[5rem]">
        {navItems.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </nav>
<Toaster position='top-center'/>
      {/* Main Content */}
      <main className="pb-20 px-5 md:pt-28">
        <Outlet />
      </main>
    </div>
  );
}