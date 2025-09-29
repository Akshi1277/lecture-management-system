"use client";
import { motion } from "framer-motion";
import { Calendar, Users, FileText, BarChart3, Clock, Award, BookOpen, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Intelligent Scheduling",
      description: "Advanced AI algorithms automatically detect scheduling conflicts and suggest optimal time slots for lectures, exams, and meetings.",
      benefits: ["Conflict-free scheduling", "Resource optimization", "Automated notifications"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Advanced Attendance System",
      description: "Real-time attendance tracking with biometric integration, geofencing, and comprehensive analytics for accurate record-keeping.",
      benefits: ["Biometric verification", "Geofencing technology", "Real-time analytics"]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Comprehensive Resource Hub",
      description: "Centralized platform for all educational materials including lecture notes, assignments, multimedia content, and collaborative tools.",
      benefits: ["Cloud storage", "Version control", "Collaborative editing"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Detailed insights into student performance, engagement metrics, and predictive analytics to identify at-risk students early.",
      benefits: ["Predictive modeling", "Engagement tracking", "Custom reports"]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Management Tools",
      description: "Integrated calendar system with deadline tracking, reminder notifications, and productivity insights for better time management.",
      benefits: ["Smart reminders", "Deadline tracking", "Productivity insights"]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Achievement System",
      description: "Gamified learning experience with badges, certificates, and milestone tracking to motivate and recognize student achievements.",
      benefits: ["Digital badges", "Certificates", "Progress tracking"]
    }
  ];

  const useCases = [
    {
      title: "For Educators",
      description: "Streamline course management, track student progress, and enhance teaching effectiveness with comprehensive analytics.",
      features: ["Course creation tools", "Grade management", "Student analytics", "Communication hub"]
    },
    {
      title: "For Students",
      description: "Access all learning materials, track your progress, collaborate with peers, and stay organized throughout your academic journey.",
      features: ["Personal dashboard", "Assignment tracking", "Peer collaboration", "Mobile access"]
    },
    {
      title: "For Administrators",
      description: "Oversee institutional operations, generate reports, manage resources, and ensure compliance with educational standards.",
      features: ["Institution-wide analytics", "Resource management", "Compliance tracking", "Custom reporting"]
    }
  ];

  const integrations = [
    { name: "Google Workspace", logo: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Microsoft 365", logo: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Zoom", logo: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Canvas LMS", logo: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Blackboard", logo: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
    { name: "Moodle", logo: "https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Educational Management
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-4xl mx-auto">
                EduSync revolutionizes how educational institutions operate by providing a comprehensive, intelligent platform that seamlessly integrates all aspects of academic life. From smart scheduling to advanced analytics, we empower educators, engage students, and streamline administrative processes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/dashboard"
                className="btn-primary inline-flex items-center justify-center group"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Explore Dashboard
              </Link>
              <Link
                href="/register"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
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
              Powerful Features for
              <span className="block text-blue-600">Modern Education</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover comprehensive tools designed to enhance every aspect of the educational experience, from classroom management to student engagement.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="flex space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-slate-500">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
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
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
              Tailored Solutions for Every User
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              EduSync adapts to meet the unique needs of different stakeholders in the educational ecosystem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{useCase.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{useCase.description}</p>
                <ul className="space-y-3">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-700">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
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
              Seamless Integrations
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Connect with your favorite tools and platforms to create a unified educational ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center space-y-3 p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-300"
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <span className="text-sm font-medium text-slate-700">{integration.name}</span>
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
              Ready to Revolutionize Your Institution?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join the thousands of educational institutions that have already transformed their operations with EduSync. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 group"
              >
                <Zap className="mr-2 w-5 h-5" />
                Get Started Now
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}