"use client";
import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";

const GridBackground = memo(() => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Generate nodes only on client to avoid hydration mismatch
    setNodes([...Array(15)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      offset: (Math.random() - 0.5) * 200,
      duration: 10 + Math.random() * 20
    })));

    const handleMouseMove = (e) => {
      if (typeof window === 'undefined') return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950">
      {/* Animated Logic Grid */}
      <motion.div 
        style={{ 
          x: mousePos.x, 
          y: mousePos.y,
        }}
        className="absolute inset-[-10%] opacity-20"
      >
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(20, 184, 166, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(20, 184, 166, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} 
        />
      </motion.div>

  

      {/* Dynamic Cursor Light Spot */}
      <motion.div 
        animate={{ 
            x: mousePos.x * 5 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 0), 
            y: mousePos.y * 5 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 0) 
        }}
        transition={{ type: "spring", damping: 40, stiffness: 100 }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px]"
      />

      {/* Constant Ambient Glows */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
    </div>
  );
});

GridBackground.displayName = "GridBackground";

export default GridBackground;
