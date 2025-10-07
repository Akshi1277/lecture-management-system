"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, FileText, BarChart3, Clock, Award, BookOpen, TrendingUp, Shield, Zap, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Intelligent Scheduling",
      description: "Advanced AI algorithms automatically detect scheduling conflicts and suggest optimal time slots for lectures, exams, and meetings.",
      benefits: ["Conflict-free scheduling", "Resource optimization", "Automated notifications"],
      color: "from-teal-500 to-emerald-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Advanced Attendance System",
      description: "Real-time attendance tracking with biometric integration, geofencing, and comprehensive analytics for accurate record-keeping.",
      benefits: ["Biometric verification", "Geofencing technology", "Real-time analytics"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Comprehensive Resource Hub",
      description: "Centralized platform for all educational materials including lecture notes, assignments, multimedia content, and collaborative tools.",
      benefits: ["Cloud storage", "Version control", "Collaborative editing"],
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Detailed insights into student performance, engagement metrics, and predictive analytics to identify at-risk students early.",
      benefits: ["Predictive modeling", "Engagement tracking", "Custom reports"],
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Management Tools",
      description: "Integrated calendar system with deadline tracking, reminder notifications, and productivity insights for better time management.",
      benefits: ["Smart reminders", "Deadline tracking", "Productivity insights"],
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Achievement System",
      description: "Gamified learning experience with badges, certificates, and milestone tracking to motivate and recognize student achievements.",
      benefits: ["Digital badges", "Certificates", "Progress tracking"],
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const useCases = [
    {
      title: "For Educators",
      description: "Streamline course management, track student progress, and enhance teaching effectiveness with comprehensive analytics.",
      features: ["Course creation tools", "Grade management", "Student analytics", "Communication hub"],
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-teal-500 to-emerald-600"
    },
    {
      title: "For Students",
      description: "Access all learning materials, track your progress, collaborate with peers, and stay organized throughout your academic journey.",
      features: ["Personal dashboard", "Assignment tracking", "Peer collaboration", "Mobile access"],
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "For Administrators",
      description: "Oversee institutional operations, generate reports, manage resources, and ensure compliance with educational standards.",
      features: ["Institution-wide analytics", "Resource management", "Compliance tracking", "Custom reporting"],
      icon: <Shield className="w-8 h-8" />,
      color: "from-orange-500 to-amber-600"
    }
  ];

  const stats = [
    { number: "2000+", label: "Institutions", icon: <BookOpen className="w-6 h-6" /> },
    { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "98%", label: "Satisfaction", icon: <Award className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Clock className="w-6 h-6" /> }
  ];

  useEffect(() => {
    if('scrollRestoration' in history){
      history.scrollRestoration="manual";
    }
    window.scrollTo(0,0);
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const timer = setTimeout(() => {
      // Hero section animations
      gsap.from(".hero-badge", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });

      gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        clearProps: "all"
      });

      gsap.from(".hero-description", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
        clearProps: "all"
      });

      gsap.from(".hero-buttons", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
        clearProps: "all"
      });

    gsap.from(".stat-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.8,
        ease: "power2.out",
        clearProps: "all"
      });

      // Features section
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".feature-card",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });

      // Use cases
      gsap.from(".usecase-card", {
        scrollTrigger: {
          trigger: ".usecase-card",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        scale: 0.95,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        clearProps: "all"
      });

      // CTA section
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: ".cta-content",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        clearProps: "all"
      });

    }, 150);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

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
                Trusted by 2000+ Educational Institutions
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
                  Start Free Trial
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
              Ready to Transform Your Institution?
            </motion.h2>
            <p className="text-xl text-teal-200">
              Join thousands of educational institutions that have revolutionized their academic management with EduSync.
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
                  Start Free Trial
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-teal-500/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  View Demo
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}