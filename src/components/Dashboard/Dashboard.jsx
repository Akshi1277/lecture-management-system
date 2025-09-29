"use client";
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

export default function Dashboard() {
  const stats = [
    { 
      title: "Active Courses", 
      value: "12", 
      change: "+2 this month",
      icon: <BookOpen className="w-6 h-6" />, 
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    { 
      title: "Total Students", 
      value: "1,247", 
      change: "+156 this semester",
      icon: <Users className="w-6 h-6" />, 
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      title: "Assignments Due", 
      value: "8", 
      change: "3 due this week",
      icon: <FileText className="w-6 h-6" />, 
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    { 
      title: "Attendance Rate", 
      value: "94.2%", 
      change: "+2.1% from last month",
      icon: <TrendingUp className="w-6 h-6" />, 
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
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
      type: "lecture"
    },
    {
      title: "Database Systems Lab",
      time: "2:00 PM - 4:00 PM",
      date: "Today",
      location: "Computer Lab 2",
      type: "lab"
    },
    {
      title: "Software Engineering Project Presentation",
      time: "9:00 AM - 12:00 PM",
      date: "Tomorrow",
      location: "Auditorium A",
      type: "presentation"
    },
    {
      title: "Machine Learning Assignment Due",
      time: "11:59 PM",
      date: "March 15",
      location: "Online Submission",
      type: "deadline"
    }
  ];

  const quickActions = [
    { title: "Create New Course", icon: <Plus className="w-5 h-5" />, color: "bg-blue-500" },
    { title: "Schedule Lecture", icon: <Calendar className="w-5 h-5" />, color: "bg-green-500" },
    { title: "Upload Resources", icon: <FileText className="w-5 h-5" />, color: "bg-purple-500" },
    { title: "Send Announcement", icon: <Bell className="w-5 h-5" />, color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-600 mt-2">Welcome back! Here's what's happening in your courses today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses, students..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={stat.textColor}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.title}</div>
                </div>
              </div>
              <div className="text-sm text-slate-600">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center space-y-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-700 text-center">{action.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Recent Activities</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">{activity.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <Download className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Upcoming Events</h3>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm">{event.title}</h4>
                      <span className="text-xs text-slate-500">{event.date}</span>
                    </div>
                    <div className="text-sm text-slate-600 mb-1">{event.time}</div>
                    <div className="text-xs text-slate-500">{event.location}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Performance Overview</h3>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Course Completion</span>
                  <span className="text-sm font-semibold text-slate-900">87%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-[87%]"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Assignment Submissions</span>
                  <span className="text-sm font-semibold text-slate-900">92%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full w-[92%]"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Student Engagement</span>
                  <span className="text-sm font-semibold text-slate-900">78%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full w-[78%]"></div>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="text-xl font-bold">Recent Achievements</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Course Excellence</p>
                    <p className="text-sm text-purple-100">Achieved 95% completion rate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Student Engagement</p>
                    <p className="text-sm text-purple-100">Top 10% engagement rate</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}