"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Menu, X, Calendar, Home, LayoutDashboard, LogIn, UserPlus, Sparkles, LogOut } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    ...(userInfo ? [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    ] : [
      { href: "/login", label: "Login", icon: <LogIn size={18} /> },
      { href: "/register", label: "Register", icon: <UserPlus size={18} /> },
    ]),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-teal-500/10 border-b border-teal-500/20"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/50"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar className="w-6 h-6 text-white" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
            <div>
              <motion.h1
                className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% auto"
                }}
              >
                EduSync
              </motion.h1>
              <p className="text-xs text-teal-400/80 -mt-1 flex items-center gap-1">
                <Sparkles size={10} className="animate-pulse" />
                Lecture Management
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative flex items-center space-x-2 text-slate-300 hover:text-teal-400 font-medium transition-colors duration-200 px-4 py-2 rounded-lg group overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <motion.span
                    className="relative z-10"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="relative z-10">{item.label}</span>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}

            {userInfo && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 font-black rounded-xl hover:shadow-lg hover:shadow-teal-500/20 transition-all active:scale-95 ml-4"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-teal-500/20 transition-colors border border-teal-500/30"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-teal-400" />
                ) : (
                  <Menu size={24} className="text-teal-400" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 py-4 border-t border-teal-500/20 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 text-slate-300 hover:text-teal-400 font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-teal-500/10 border border-transparent hover:border-teal-500/30"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {userInfo && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-rose-400 hover:text-rose-300 font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 w-full"
                  >
                    <LogOut size={18} />
                    <span>Logout Session</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
