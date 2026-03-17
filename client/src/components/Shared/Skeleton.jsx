"use client";
import { motion } from "framer-motion";

const Skeleton = ({ className, circle = false }) => {
  return (
    <div className={`relative overflow-hidden bg-slate-800/50 ${circle ? 'rounded-full' : 'rounded-2xl'} ${className}`}>
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent"
      />
    </div>
  );
};

export const ReportCardSkeleton = () => (
  <div className="p-6 bg-slate-900 border border-slate-800 rounded-[32px] space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton className="w-12 h-12" />
      <Skeleton className="w-16 h-6 rounded-lg" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-24 h-3" />
      <Skeleton className="w-32 h-8" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 space-y-8">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-3" />
      </div>
      <Skeleton className="w-14 h-14 rounded-3xl" />
    </div>
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <Skeleton className="w-full h-2 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
