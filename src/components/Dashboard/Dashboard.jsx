"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  FileText, 
  Users, 
  Bell, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Award,
  BarChart3,
  MessageSquare,
  Download,
  Plus,
  Filter,
  Search
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard() {
  const stats = [
    { 
      title: "Active Courses", 
      value: "12", 
      change: "+2 this month",
      icon: <BookOpen className="w-6 h-6" />, 
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30"
    },
    { 
      title: "Total Students", 
      value: "1,247", 
      change: "+156 this semester",
      icon: <Users className="w-6 h-6" />, 
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30"
    },
    { 
      title: "Assignments Due", 
      value: "8", 
      change: "3 due this week",
      icon: <FileText className="w-6 h-6" />, 
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/30"
    },
    { 
      title: "Attendance Rate", 
      value: "94.2%", 
      change: "+2.1% from last month",
      icon: <TrendingUp className="w-6 h-6" />, 
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30"
    }
  ];

  const recentActivities = [
    {
      type: "assignment",
      title: "Data Structures Assignment #3 submitted",
      time: "2 hours ago",
      user: "Sarah Johnson",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
    },
    {
      type: "lecture",
      title: "Machine Learning Lecture scheduled",
      time: "4 hours ago",
      user: "Dr. Michael Chen",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
    },
    {
      type: "grade",
      title: "Calculus II grades published",
      time: "6 hours ago",
      user: "Prof. Lisa Rodriguez",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
    },
    {
      type: "announcement",
      title: "New course materials uploaded",
      time: "1 day ago",
      user: "Academic Office",
      avatar: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
    }
  ];

  const upcomingEvents = [
    {
      title: "Advanced Algorithms Lecture",
      time: "10:00 AM - 11:30 AM",
      date: "Today",
      location: "Room 301",
      type: "lecture",
      color: "teal"
    },
    {
      title: "Database Systems Lab",
      time: "2:00 PM - 4:00 PM",
      date: "Today",
      location: "Computer Lab 2",
      type: "lab",
      color: "emerald"
    },
    {
      title: "Software Engineering Project Presentation",
      time: "9:00 AM - 12:00 PM",
      date: "Tomorrow",
      location: "Auditorium A",
      type: "presentation",
      color: "orange"
    },
    {
      title: "Machine Learning Assignment Due",
      time: "11:59 PM",
      date: "March 15",
      location: "Online Submission",
      type: "deadline",
      color: "purple"
    }
  ];

  const quickActions = [
    { title: "Create Course", icon: <Plus className="w-5 h-5" />, color: "from-teal-500 to-emerald-600" },
    { title: "Schedule Lecture", icon: <Calendar className="w-5 h-5" />, color: "from-blue-500 to-cyan-600" },
    { title: "Upload Resources", icon: <FileText className="w-5 h-5" />, color: "from-purple-500 to-pink-600" },
    { title: "Send Alert", icon: <Bell className="w-5 h-5" />, color: "from-orange-500 to-amber-600" }
  ];

  useEffect(() => {
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
      // Header animation
      gsap.from(".dashboard-header", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });

      // Stats cards with smooth stagger
      gsap.from(".stat-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2,
        clearProps: "all"
      });

      // Quick action cards
      gsap.from(".quick-action-card", {
        scrollTrigger: {
          trigger: ".quick-action-card",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all"
      });

      // Activity items slide from left
      gsap.from(".activity-item", {
        scrollTrigger: {
          trigger: ".activity-item",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: -20,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all"
      });

      // Event items slide from right
      gsap.from(".event-item", {
        scrollTrigger: {
          trigger: ".event-item",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: 20,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all"
      });

      // Performance section
      gsap.from(".performance-section", {
        scrollTrigger: {
          trigger: ".performance-section",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all"
      });

      // Achievement card
      gsap.from(".achievement-card", {
        scrollTrigger: {
          trigger: ".achievement-card",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        scale: 0.97,
        duration: 0.6,
        ease: "power2.out",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden py-20 lg:py-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none ">
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
          className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="dashboard-header mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-slate-300 mt-2 text-lg">Welcome back! Here's what's happening in your courses today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses, students..."
                  className="pl-10 pr-4 py-2.5 bg-slate-800/50 border border-teal-500/30 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent backdrop-blur-sm transition-all"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`stat-card bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border ${stat.borderColor} hover:border-teal-500/50 transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                  <div className={stat.textColor}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.title}</div>
                </div>
              </div>
              <div className="text-sm text-teal-300">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-teal-500/20 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Quick Actions</span>
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="quick-action-card flex flex-col items-center space-y-3 p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 group"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-300 text-center group-hover:text-white transition-colors">{action.title}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-teal-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Recent Activities
                </h3>
                <button className="text-teal-400 hover:text-teal-300 font-medium transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5, backgroundColor: "rgba(20, 184, 166, 0.05)" }}
                    className="activity-item flex items-center space-x-4 p-4 rounded-xl border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300"
                  >
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/30"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.button whileHover={{ scale: 1.2 }} className="text-slate-400 hover:text-teal-400 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.2 }} className="text-slate-400 hover:text-teal-400 transition-colors">
                        <Download className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-teal-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Upcoming Events
                </h3>
                <Calendar className="w-5 h-5 text-teal-400" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="event-item border-l-4 border-teal-500 pl-4 py-3 bg-slate-800/30 rounded-r-lg hover:bg-slate-800/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white text-sm">{event.title}</h4>
                      <span className="text-xs px-2 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">{event.date}</span>
                    </div>
                    <div className="text-sm text-slate-300 mb-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-teal-400" />
                      {event.time}
                    </div>
                    <div className="text-xs text-slate-400">{event.location}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            <div className="performance-section bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-teal-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Performance
                </h3>
                <BarChart3 className="w-5 h-5 text-teal-400" />
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-300">Course Completion</span>
                    <span className="text-sm font-semibold text-white">87%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "87%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 h-2.5 rounded-full relative"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-300">Assignment Submissions</span>
                    <span className="text-sm font-semibold text-white">92%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2.5 rounded-full relative"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.3 }}
                      />
                    </motion.div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-300">Student Engagement</span>
                    <span className="text-sm font-semibold text-white">78%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="bg-gradient-to-r from-orange-500 to-amber-600 h-2.5 rounded-full relative"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.6 }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

           {/* Achievements */}
<motion.div
  whileHover={{ scale: 1.02 }}
  className="achievement-card bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/30 border border-teal-400/20"
>
  <div className="flex items-center space-x-3 mb-6">
    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
      <Award className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold">Recent Achievements</h3>
  </div>
  <div className="space-y-3">
    <motion.div
      whileHover={{ x: 3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
      transition={{ duration: 0.2 }}
      className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <Award className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base mb-0.5">Course Excellence</p>
        <p className="text-sm text-teal-100 leading-relaxed">Achieved 95% completion rate</p>
      </div>
    </motion.div>
    <motion.div
      whileHover={{ x: 3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
      transition={{ duration: 0.2 }}
      className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <Users className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base mb-0.5">Student Engagement</p>
        <p className="text-sm text-teal-100 leading-relaxed">Top 10% engagement rate</p>
      </div>
    </motion.div>
  </div>
</motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}