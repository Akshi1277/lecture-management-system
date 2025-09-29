"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Users, BookOpen, Calendar, Award, TrendingUp, Shield } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "AI-powered scheduling that prevents conflicts and optimizes your academic calendar automatically."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Digital Attendance",
      description: "Seamless attendance tracking with real-time analytics and automated reporting for administrators."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Resource Management",
      description: "Centralized hub for all educational materials, assignments, and collaborative learning resources."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Comprehensive insights into student progress with detailed performance metrics and trends."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Monitor academic growth with visual dashboards and personalized learning path recommendations."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security ensuring your educational data remains protected and compliant."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "2K+", label: "Educational Institutions" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Professor, MIT",
      content: "EduSync has revolutionized how we manage our courses. The intuitive interface and powerful features have increased our productivity by 40%.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Student, Stanford University",
      content: "As a student, I love how everything is organized in one place. Accessing materials and tracking my progress has never been easier.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Lisa Rodriguez",
      role: "Academic Administrator",
      content: "The analytics and reporting features provide invaluable insights into our institution's performance. Highly recommended!",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Trusted by 2000+ Institutions
                </motion.div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Educational Experience
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  EduSync is the comprehensive learning management platform that connects educators, students, and administrators in a seamless digital ecosystem designed for modern education.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/home"
                  className="btn-primary inline-flex items-center justify-center group"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-slate-900">{stat.number}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 animate-float">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Course Dashboard</h3>
                      <p className="text-sm text-slate-500">Advanced Analytics</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Course Completion</span>
                      <span className="text-sm font-medium text-slate-900">87%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-[87%]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-slate-900">24</div>
                      <div className="text-xs text-slate-500">Lectures</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">156</div>
                      <div className="text-xs text-slate-500">Students</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">4.9</div>
                      <div className="text-xs text-slate-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
              Everything You Need for
              <span className="block text-blue-600">Modern Education</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover powerful features designed to enhance learning experiences, streamline administrative tasks, and foster collaboration in educational environments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See what educators and students are saying about their experience with EduSync.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-200 leading-relaxed italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform Your Educational Experience?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of educators and students who have already revolutionized their learning journey with EduSync.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/home"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}