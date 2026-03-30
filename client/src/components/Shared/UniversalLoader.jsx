"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UniversalLoader = () => {
  const [message, setMessage] = useState("Initializing System");
  const [showSubText, setShowSubText] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setMessage("Syncing with Cloud Hub..."), 3000);
    const timer2 = setTimeout(() => {
      setMessage("Waking up our servers...");
      setShowSubText(true);
    }, 7000);
    const timer3 = setTimeout(() => setMessage("Finalizing secure handshake..."), 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 px-6">
      <div className="relative">
        {/* Glowing Aura */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full"
        />

        {/* Logo Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-white flex items-center justify-center"
        >
          <img 
            src="/logo.png" 
            alt="EduSync" 
            className="w-24 h-24 rounded-[32px] shadow-2xl shadow-blue-500/40 relative z-10"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          <motion.h1 
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-lg font-bold text-slate-300 italic tracking-tighter uppercase text-center"
          >
            {message}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence>
          {showSubText && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center max-w-[280px]"
            >
              Our free-tier servers need a moment to warm up after a period of rest. Thank you for your patience!
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-6 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UniversalLoader;
