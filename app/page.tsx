"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  WalletIcon, 
  ChartIcon, 
  TrendUpIcon,
  MoneyIcon,
  BillsIcon,
  FoodIcon,
  TransportIcon,
  ShoppingIcon 
} from '@/components/icons/ExpenseIcons';
import { 
  SatelliteIcon, 
  PlanetIcon, 
  RocketIcon, 
  StarIcon, 
  AsteroidIcon,
  SpaceBackground,
  FloatingSpaceElement 
} from '@/components/SpaceElements';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Footer from '@/components/Footer';

// Draggable floating element for hero section
const DraggableElement = ({ children, initialX = 0, initialY = 0, className = "", style = {} }: {
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const dragControls = useDragControls();
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragElastic={0.2}
      dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
      style={{ x, y, rotateX, rotateY, ...style }}
      whileHover={{ 
        scale: 1.15, 
        z: 50,
        filter: "drop-shadow(0 0 25px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 50px rgba(59, 130, 246, 0.6))",
        transition: { duration: 0.3 }
      }}
      whileDrag={{ 
        scale: 1.25, 
        z: 100,
        filter: "drop-shadow(0 0 35px rgba(139, 92, 246, 1)) drop-shadow(0 0 70px rgba(59, 130, 246, 0.8))",
        transition: { duration: 0.2 }
      }}
      className={`absolute cursor-grab active:cursor-grabbing ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: Math.random() * 1.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced floating visual element with space theme
const FloatingVisual = ({ icon: Icon, color, position, type = "expense", size = "md" }: {
  icon: any;
  color: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  type?: "expense" | "space";
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-12 h-12 md:w-14 md:h-14",
    md: "w-16 h-16 md:w-20 md:h-20", 
    lg: "w-20 h-20 md:w-24 md:h-24"
  };

  return (
    <DraggableElement 
      className={sizeClasses[size]} 
      style={position}
    >
      <motion.div 
        className={`w-full h-full ${color} rounded-2xl backdrop-blur-lg border border-white/30 flex items-center justify-center shadow-2xl relative overflow-hidden group`}
        animate={{
          boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.4)",
            "0 0 35px rgba(59, 130, 246, 0.6)",
            "0 0 20px rgba(139, 92, 246, 0.4)"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.5 }
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden opacity-60">
          <motion.div
            className="absolute w-1.5 h-1.5 bg-white/80 rounded-full top-2 left-2"
            animate={{
              x: [0, 15, 0],
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-white/60 rounded-full right-3 bottom-3"
            animate={{
              x: [0, -8, 0],
              y: [0, 8, 0],
              opacity: [0.3, 0.9, 0.3]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          />
        </div>
        <Icon className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8 md:w-10 md:h-10'} text-white relative z-10 group-hover:scale-110 transition-transform duration-300`} />
      </motion.div>
    </DraggableElement>
  );
};

const FeatureCard = ({ icon: Icon, title, description, stats, delay }: {
  icon: any;
  title: string;
  description: string;
  stats: string;
  delay: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay, duration: 0.6 }}
      className="relative group cursor-pointer"
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 p-6 group-hover:border-purple-500/50 group-hover:bg-white/15 group-hover:shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-xs text-purple-200 font-medium group-hover:text-purple-100 transition-colors duration-300">{stats}</div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors duration-300">{title}</h3>
        <p className="text-gray-100 leading-relaxed text-sm group-hover:text-white transition-colors duration-300">{description}</p>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

const TestimonialCard = ({ name, role, content, delay }: {
  name: string;
  role: string;
  content: string;
  delay: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay, duration: 0.6 }}
      className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 p-6 group cursor-pointer hover:border-purple-500/50 hover:bg-white/15 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
      whileHover={{ 
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <span className="text-white font-semibold text-sm">{name.charAt(0)}</span>
        </div>
        <div className="ml-3">
          <h4 className="text-white font-medium group-hover:text-white transition-colors duration-300">{name}</h4>
          <p className="text-gray-100 text-sm group-hover:text-white transition-colors duration-300">{role}</p>
        </div>
      </div>
      <p className="text-gray-50 italic group-hover:text-white transition-colors duration-300">&quot;{content}&quot;</p>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default function LandingPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#000319] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Spendly...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return null;
  }

  return (
    <div className="scroll-snap-container">
      {/* Navigation - Fixed with Better Centering */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Spendly</span>
          </div>
          
          {/* Perfectly Centered Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-200 hover:text-white transition-colors font-medium">Features</a>
            <a href="#testimonials" className="text-gray-200 hover:text-white transition-colors font-medium">Reviews</a>
            <a href="#footer" className="text-gray-200 hover:text-white transition-colors font-medium">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-6 py-2 text-white hover:text-purple-300 transition-colors font-medium"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium"
            >
              Register
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="section min-h-screen bg-gradient-to-b from-[#000319] via-[#001633] to-[#000a1a] relative overflow-hidden flex items-center justify-center">
        {/* Space Background */}
        <SpaceBackground />
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-25">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
          </div>
        </div>

        {/* Central Spendly Logo - Static (No Dragging) */}
        <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-12 flex flex-col items-center"
          >
            {/* Static Spendly Text */}
            <motion.h1 
              className="text-7xl md:text-9xl lg:text-[10rem] font-bold text-white mb-6 tracking-tight text-center select-none"
              style={{
                textShadow: "0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)"
              }}
              animate={{
                textShadow: [
                  "0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)",
                  "0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Spendly
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl font-medium mb-4 text-center text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Smart Expense Tracking
            </motion.p>
            <motion.p 
              className="text-gray-200 text-lg font-medium text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Beyond the ordinary financial experience
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-12 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/40 hover:border-white/60 text-lg backdrop-blur-lg relative overflow-hidden group shadow-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.4), 0 0 40px rgba(59, 130, 246, 0.6)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white font-bold rounded-2xl hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 shadow-2xl text-lg relative overflow-hidden group border border-purple-400/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Compact to fit in one page */}
      <section id="features" className="section min-h-screen bg-gradient-to-b from-[#000a1a] to-[#001122] flex items-center relative py-8 pt-20">
        {/* Subtle space background for features */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`feature-star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.8, 0.1],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-8 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3">
              Everything You Need to{' '}
              <span 
                className="text-white"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))"
                }}
              >
                Master Your Money
              </span>
            </h2>
            <p className="text-base text-gray-200 max-w-2xl mx-auto">
              Powerful features designed to give you complete control over your finances
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={WalletIcon}
              title="Smart Expense Tracking"
              description="Automatically categorize expenses, set budgets, and track spending patterns with AI-powered insights."
              stats="Real-time sync"
              delay={0.2}
            />
            <FeatureCard
              icon={ChartIcon}
              title="Advanced Analytics"
              description="Beautiful charts and reports that reveal spending trends, helping you make informed financial decisions."
              stats="10+ chart types"
              delay={0.4}
            />
            <FeatureCard
              icon={TrendUpIcon}
              title="Budget Management"
              description="Set custom budgets, receive alerts, and get personalized recommendations to stay on track."
              stats="Smart alerts"
              delay={0.6}
            />
            <FeatureCard
              icon={BillsIcon}
              title="Bill Reminders"
              description="Never miss a payment with intelligent bill tracking and automated reminders for all your recurring expenses."
              stats="Never miss bills"
              delay={0.8}
            />
            <FeatureCard
              icon={FoodIcon}
              title="Category Insights"
              description="Deep dive into spending by category with detailed breakdowns and trend analysis across different time periods."
              stats="10+ categories"
              delay={1.0}
            />
            <FeatureCard
              icon={TransportIcon}
              title="Multi-Device Sync"
              description="Access your financial data anywhere with seamless synchronization across all your devices and platforms."
              stats="Cloud sync"
              delay={1.2}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section min-h-screen bg-gradient-to-b from-[#001122] to-[#000319] flex items-center pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
              What Our Users{' '}
              <span 
                className="text-white"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))"
                }}
              >
                Are Saying
              </span>
            </h2>
            <p className="text-base text-gray-200 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their financial lives
            </p>
          </motion.div>

          {/* Stats Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-3xl border border-white/10 p-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    <CountUp start={0} end={50000} duration={2.5} suffix="+" />
                  </div>
                  <p className="text-gray-300">Active Users</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    <CountUp start={0} end={2500000} duration={2.5} prefix="$" />
                  </div>
                  <p className="text-gray-300">Money Tracked</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    <CountUp start={0} end={98} duration={2.5} suffix="%" />
                  </div>
                  <p className="text-gray-300">Satisfaction Rate</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    <CountUp start={0} end={24} duration={2.5} suffix="/7" />
                  </div>
                  <p className="text-gray-300">Support Available</p>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Marketing Manager"
              content="Spendly has completely changed how I manage my finances. The insights are incredible and have helped me save over $3000 this year!"
              delay={0.2}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Software Engineer"
              content="The automated categorization is spot-on, and the analytics help me understand my spending patterns like never before. Highly recommended!"
              delay={0.4}
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Small Business Owner"
              content="As a business owner, tracking expenses is crucial. Spendly makes it effortless and the reports are perfect for tax season."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="section min-h-screen bg-gradient-to-b from-[#000319] to-[#000a1a] flex items-center">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-3xl border border-white/10 p-12 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Ready to Transform Your Financial Life?
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Join thousands of users who are already managing their finances better with Spendly - completely free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4), 0 0 20px rgba(59, 130, 246, 0.6)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register')}
                  className="px-12 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-2xl"
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="px-12 py-4 bg-white/15 text-white font-bold text-lg rounded-xl hover:bg-white/25 transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-lg shadow-lg"
                >
                  Sign In
                </motion.button>
              </div>
              <p className="text-gray-300 text-sm mt-4">100% Free • No credit card required • Start managing your finances today</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .scroll-snap-container {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          height: 100vh;
        }
        
        .section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
