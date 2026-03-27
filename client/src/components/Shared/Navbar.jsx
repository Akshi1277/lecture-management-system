"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearToasts } from "@/redux/slices/uiSlice";
import { useRouter, usePathname } from "next/navigation";
import { 
    Menu, X, Calendar, Home, LayoutDashboard, 
    LogIn, LogOut 
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasMounted) return null;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearToasts());
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/#features", label: "Features", icon: null },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans ${isScrolled
        ? "py-4 bg-slate-950/90 backdrop-blur-xl shadow-2xl"
        : "py-6 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img src="/logo.png" alt="EduSync Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">EduSync</h1>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {!userInfo && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors flex items-center space-x-2 ${
                  pathname === item.href ? 'text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ))}

            {userInfo && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-400 hover:text-teal-400 transition-colors flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}

            <div className="h-6 w-px bg-slate-800" />

            {userInfo ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold rounded-lg transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Access Portal</span>
                </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {!userInfo && navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-slate-300 font-medium p-3 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ))}

              {userInfo && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-slate-300 font-medium p-3 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              )}

              <hr className="border-slate-800 my-2" />

              {userInfo ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 text-slate-300 font-medium p-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-teal-500 text-slate-950 font-semibold rounded-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Access Portal</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
