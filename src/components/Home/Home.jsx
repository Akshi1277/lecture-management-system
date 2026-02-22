"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, FileText, BarChart3, Clock, Award, BookOpen, TrendingUp, Shield, Zap, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { icon: <Users />, number: "Dept-Base", label: "Architecture" },
    { icon: <BookOpen />, number: "500+", label: "Active Courses" },
    { icon: <Zap />, number: "99.9%", label: "System Uptime" },
    { icon: <Link href="/" />, number: "24/7", label: "Smart Support" },
  ];

  const features = [
    {
      title: "Logistical Excellence",
      description: "Ensure conflict-free scheduling and optimize resource allocation with intelligent capacity detection.",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-teal-500 to-emerald-500",
      benefits: ["Conflict-Free Scheduling", "Real-time Substitutions", "Classroom Capacity Awareness"],
    },
    {
      title: "Academic Intelligence",
      description: "Track progress and engage students with granular syllabus tracking and performance insights.",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-indigo-500 to-blue-500",
      benefits: ["Syllabus Tracking", "Resource Repository", "The 75% Compliance Engine"],
    },
    {
      title: "Data-Driven Decisions",
      description: "Empower administration with real-time analytical dashboards and comprehensive institutional metrics.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-orange-500 to-amber-500",
      benefits: ["Faculty Workload Analytics", "Attendance Monitoring", "Custom Reporting Generator"],
    },
    {
      title: "Enterprise Grade Security",
      description: "Safeguard institutional data with modern cryptographic standards and stringent access controls.",
      icon: <Shield className="w-8 h-8" />,
      color: "from-rose-500 to-red-500",
      benefits: ["Role-Based Access Control", "Rate Limiting & Helmet Config", "JWT Authentication"],
    }
  ];

  const useCases = [
    {
      title: "For Administrators",
      description: "Get a bird's-eye view of all institutional operations. Monitor faculty load, manage departments, and resolve scheduling conflicts before they happen.",
      icon: <Users className="w-8 h-8" />,
      color: "from-teal-500 to-emerald-500",
      features: ["Faculty workload tracking", "Departmental oversight", "Issue resolution"],
    },
    {
      title: "For Faculty",
      description: "Focus on teaching, not paperwork. Easily upload resources, track syllabus coverage, and mark attendance with a single click.",
      icon: <FileText className="w-8 h-8" />,
      color: "from-indigo-500 to-blue-500",
      features: ["Resource uploading", "Syllabus tracking", "One-click attendance"],
    },
    {
      title: "For Students",
      description: "Stay ahead of the curve. Monitor your attendance rate, access recorded lectures, and view real-time syllabus updates from anywhere.",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-orange-500 to-amber-500",
      features: ["Attendance monitoring", "Resource access", "Real-time updates"],
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="hero-badge inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-300 rounded-full text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Built for Our College Community
              </div>

              <h1 className="hero-title text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">The Future of</span>
                <motion.span
                  className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent"
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
                  Educational Management
                </motion.span>
              </h1>

              <p className="hero-description text-xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                EduSync revolutionizes how educational institutions operate by providing a comprehensive, intelligent platform that seamlessly integrates all aspects of academic life. From smart scheduling to advanced analytics, we empower educators, engage students, and streamline administrative processes.
              </p>
            </div>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="btn-primary inline-flex items-center justify-center group"
                >
                  <BookOpen className="mr-2 w-5 h-5" />
                  Explore Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  Access Portal
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="stat-card text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300"
                >
                  <div className="flex justify-center mb-3 text-teal-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold">
              <span className="text-white">Powerful Features for</span>
              <motion.span
                className="block bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent"
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
                Modern Education
              </motion.span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover comprehensive tools designed to enhance every aspect of the educational experience, from classroom management to student engagement.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.02 }}
                className="feature-card group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-500 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                <div className="relative z-10 flex space-x-6">
                  <div className="flex-shrink-0">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/50`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-teal-400 mr-3" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Tailored Solutions for Every User
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              EduSync adapts to meet the unique needs of different stakeholders in the educational ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.03 }}
                className="usecase-card bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-500 shadow-lg"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${useCase.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">{useCase.description}</p>
                <ul className="space-y-3">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-300">
                      <CheckCircle className="w-4 h-4 text-teal-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-orange-600/20"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: "200% 200%"
          }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="cta-content space-y-8">
            <motion.h2
              className="text-4xl lg:text-6xl font-bold text-white"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Ready to Transform Academic Logistics?
            </motion.h2>
            <p className="text-xl text-teal-200">
              Empowering faculty and students by eliminating scheduling conflicts and manual attendance tracking with EduSync.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 group"
                >
                  Access Portal
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}