"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Calendar, ClipboardCheck, FileText, Bell, BarChart3, Users, Sparkles, Zap, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Lecture Scheduling",
      description: "AI-powered scheduling system that prevents conflicts and optimizes lecture timetables automatically with real-time updates."
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Digital Attendance Tracking",
      description: "Seamless attendance management with QR code scanning, real-time tracking, and automated reporting for faculty."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Lecture Resource Sharing",
      description: "Centralized platform for sharing lecture notes, presentations, assignments, and study materials instantly."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Instant Notifications",
      description: "Real-time alerts for schedule changes, lecture cancellations, and important announcements to all stakeholders."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Reports",
      description: "Comprehensive attendance analytics, lecture statistics, and performance insights for administrators and faculty."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Role Access",
      description: "Role-based dashboards for students, teachers, and administrators with secure authentication and data protection."
    }
  ];

  const stats = [
    { number: "100%", label: "Digital Scheduling", icon: <Sparkles className="w-5 h-5" /> },
    { number: "Real-time", label: "Attendance Tracking", icon: <Zap className="w-5 h-5" /> },
    { number: "Zero", label: "Scheduling Conflicts", icon: <CheckCircle className="w-5 h-5" /> },
    { number: "24/7", label: "Access Available", icon: <Clock className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Prof. Hina Mehmood",
      role: "Assistant Professor, IT Department",
      content: "EduSync has completely transformed how we manage lectures. No more manual scheduling conflicts or attendance registers - everything is automated and efficient.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Akshat Gupta",
      role: "Student, BSc IT",
      content: "As a student, I love having instant access to my lecture schedule, attendance records, and study materials all in one place. The notifications keep me updated on any changes.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Dr. Khan Ashfaq Ahmad",
      role: "Principal",
      content: "The analytics and automated reporting have given us unprecedented insights into lecture attendance patterns and resource utilization across departments.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  useEffect(() => {
    // Set a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Hero section animations
      gsap.from(".hero-badge", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all" // Clear inline styles after animation
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
      
      // Stats animation with stagger
      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: ".stat-card",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all"
      });
      
      // Dashboard card float animation - lighter version
      gsap.to(".dashboard-card", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Features section
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".feature-card",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        clearProps: "all"
      });
      
      // Testimonials
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: ".testimonial-card",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        scale: 0.95,
        stagger: 0.15,
        duration: 0.7,
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
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        clearProps: "all"
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="hero-badge inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-300 rounded-full text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Smart Lecture Management Solution
                </div>
                
                <h1 className="hero-title text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">Digitize Your</span>
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
                    Lecture Management
                  </motion.span>
                </h1>
                
                <p className="hero-description text-xl text-slate-300 leading-relaxed max-w-2xl">
                  EduSync streamlines lecture scheduling, attendance tracking, and resource sharing for educational institutions - eliminating manual processes and scheduling conflicts.
                </p>
              </div>

              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/home"
                    className="btn-primary inline-flex items-center justify-center group"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className="btn-secondary inline-flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="stat-card text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-2 text-teal-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="dashboard-card relative z-10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-teal-500/20">
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/50"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Calendar className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Today's Schedule</h3>
                      <p className="text-sm text-teal-400">Lecture Management</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Attendance Rate</span>
                      <motion.span 
                        className="text-sm font-medium text-teal-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        92%
                      </motion.span>
                    </div>
                    <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-orange-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-3 gap-4 text-center pt-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      { value: "6", label: "Lectures" },
                      { value: "45", label: "Students" },
                      { value: "12", label: "Resources" }
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
                      >
                        <motion.div 
                          className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                        >
                          {item.value}
                        </motion.div>
                        <div className="text-xs text-slate-400">{item.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
              
              {/* Floating orbs */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-full blur-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <motion.h2 
              className="text-4xl lg:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-white">Complete Lecture Management</span>
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
                In One Platform
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Automate lecture scheduling, track attendance digitally, and share resources seamlessly - eliminating manual inefficiencies in academic institutions.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="feature-card group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-teal-500/20 hover:border-teal-500/50 transition-all duration-500 overflow-hidden"
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/50"
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>

                {/* Decorative corner element */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Trusted by Faculty & Students
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how EduSync is transforming lecture management in educational institutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  y: -10,
                  scale: 1.03
                }}
                className="testimonial-card group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-500 overflow-hidden"
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "linear"
                  }}
                />

                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center space-x-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/50"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-teal-400">{testimonial.role}</p>
                    </div>
                  </motion.div>
                  <motion.p 
                    className="text-slate-300 leading-relaxed italic"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    "{testimonial.content}"
                  </motion.p>
                </div>
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
              Ready to Modernize Your Lecture Management?
            </motion.h2>
            <motion.p 
              className="text-xl text-teal-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Join institutions that have eliminated scheduling conflicts and manual attendance tracking.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/home"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 group"
              >
                Start Your Free Trial
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
      </section>
    </div>
  );
}