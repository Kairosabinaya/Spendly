'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  WalletIcon, 
  ChartIcon, 
  TrendUpIcon,
  MoneyIcon,
  BillsIcon,
  FoodIcon,
  TransportIcon,
  ShoppingIcon,
  HealthIcon,
  EntertainmentIcon,
  EducationIcon,
  TravelIcon,
  CategoryIconMap
} from '@/components/icons/ExpenseIcons';
import { 
  SatelliteIcon, 
  PlanetIcon, 
  RocketIcon, 
  StarIcon, 
  AsteroidIcon 
} from '@/components/SpaceElements';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';

// Enhanced Floating Animation Component
const FloatingElement = ({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Advanced Metric Card
const MetricCard = ({ title, value, change, icon: Icon, color, subtitle, delay = 0 }: {
  title: string;
  value: string;
  change: number;
  icon: any;
  color: string;
  subtitle: string;
  delay?: number;
}) => {
  return (
    <FloatingElement delay={delay}>
      <div className="relative group cursor-pointer">
        <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-20`}></div>
        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 p-6 group-hover:border-purple-500/50 group-hover:bg-white/15 group-hover:shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
              change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              <span>{change >= 0 ? '↗' : '↘'}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {value}
            </div>
            <p className="text-gray-300 text-sm font-medium">{title}</p>
            <p className="text-gray-400 text-xs">{subtitle}</p>
          </div>
          
          {/* Hover glow effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
      </div>
    </FloatingElement>
  );
};

export default function EnhancedAnalytics() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('spending');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#000319] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Advanced mock data for comprehensive analytics
  const analyticsData = {
    yearlyTrend: [
      { month: 'Jan', spending: 3500000, income: 8000000, savings: 4500000 },
      { month: 'Feb', spending: 4200000, income: 8000000, savings: 3800000 },
      { month: 'Mar', spending: 3800000, income: 8200000, savings: 4400000 },
      { month: 'Apr', spending: 4500000, income: 8100000, savings: 3600000 },
      { month: 'May', spending: 4250000, income: 8300000, savings: 4050000 },
      { month: 'Jun', spending: 3900000, income: 8200000, savings: 4300000 },
      { month: 'Jul', spending: 4100000, income: 8400000, savings: 4300000 },
      { month: 'Aug', spending: 4300000, income: 8200000, savings: 3900000 },
      { month: 'Sep', spending: 3700000, income: 8500000, savings: 4800000 },
      { month: 'Oct', spending: 4000000, income: 8300000, savings: 4300000 },
      { month: 'Nov', spending: 4400000, income: 8100000, savings: 3700000 },
      { month: 'Dec', spending: 5200000, income: 8600000, savings: 3400000 },
    ],
    categoryBreakdown: [
      { name: 'Food & Dining', value: 35, amount: 1487500, color: '#f97316' },
      { name: 'Transportation', value: 20, amount: 850000, color: '#3b82f6' },
      { name: 'Entertainment', value: 15, amount: 637500, color: '#8b5cf6' },
      { name: 'Healthcare', value: 12, amount: 510000, color: '#10b981' },
      { name: 'Shopping', value: 10, amount: 425000, color: '#f59e0b' },
      { name: 'Bills & Utilities', value: 8, amount: 340000, color: '#ef4444' },
    ],
    weeklySpending: [
      { day: 'Mon', amount: 150000 },
      { day: 'Tue', amount: 200000 },
      { day: 'Wed', amount: 180000 },
      { day: 'Thu', amount: 220000 },
      { day: 'Fri', amount: 350000 },
      { day: 'Sat', amount: 450000 },
      { day: 'Sun', amount: 300000 },
    ],
    budgetProgress: [
      { category: 'Food & Dining', budget: 3000000, spent: 2500000, fill: '#f97316' },
      { category: 'Transportation', budget: 1000000, spent: 800000, fill: '#3b82f6' },
      { category: 'Entertainment', budget: 500000, spent: 450000, fill: '#8b5cf6' },
      { category: 'Healthcare', budget: 800000, spent: 300000, fill: '#10b981' },
      { category: 'Shopping', budget: 600000, spent: 550000, fill: '#f59e0b' },
      { category: 'Bills', budget: 400000, spent: 340000, fill: '#ef4444' },
    ],
    insights: [
      {
        type: 'positive',
        title: 'Great Savings Progress!',
        description: 'You saved 15% more this month compared to last month',
        value: '+15%',
        color: 'from-green-500 to-emerald-500'
      },
      {
        type: 'warning',
        title: 'High Entertainment Spending',
        description: 'Entertainment spending is 25% above your budget',
        value: '+25%',
        color: 'from-yellow-500 to-orange-500'
      },
      {
        type: 'info',
        title: 'Budget Optimization',
        description: 'You could save Rp 500K by optimizing food expenses',
        value: 'Rp 500K',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        type: 'success',
        title: 'Goal Achievement',
        description: 'You\'re on track to reach your yearly savings goal',
        value: '78%',
        color: 'from-purple-500 to-pink-500'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#000319] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background stars */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
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
        
        {/* Floating space elements */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 opacity-20"
          animate={{ rotate: 360, y: [-10, 10, -10] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <SatelliteIcon className="w-full h-full text-purple-400" />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 opacity-30"
          animate={{ rotate: -360, x: [-5, 5, -5] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <PlanetIcon className="w-full h-full text-blue-400" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              ←
            </motion.button>
            <div>
              <Link href="/" className="inline-block">
                <motion.h1 
                  whileHover={{ scale: 1.05 }}
                  className="text-3xl lg:text-4xl font-bold text-white cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))"
                  }}
                >
                  Spendly
                </motion.h1>
              </Link>
              <h2 className="text-xl text-gray-300 mb-2">Advanced Analytics</h2>
              <p className="text-gray-400">Comprehensive insights into your financial health</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Period Selector */}
            <div className="flex bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-1">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Monthly Spending"
            value="Rp 4.25M"
            change={-5.2}
            icon={WalletIcon}
            color="from-purple-500 to-blue-500"
            subtitle="vs last month"
            delay={0.1}
          />
          <MetricCard
            title="Savings Rate"
            value="48.7%"
            change={12.3}
            icon={TrendUpIcon}
            color="from-green-500 to-emerald-500"
            subtitle="of total income"
            delay={0.2}
          />
          <MetricCard
            title="Budget Efficiency"
            value="87.2%"
            change={8.5}
            icon={ChartIcon}
            color="from-blue-500 to-cyan-500"
            subtitle="budget utilization"
            delay={0.3}
          />
          <MetricCard
            title="Investment Growth"
            value="Rp 2.1M"
            change={15.7}
            icon={MoneyIcon}
            color="from-orange-500 to-red-500"
            subtitle="portfolio value"
            delay={0.4}
          />
        </div>

        {/* Advanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Yearly Spending Trend */}
          <FloatingElement delay={0.5}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Yearly Financial Overview</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>2024</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.yearlyTrend}>
                    <defs>
                      <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)'
                      }}
                      formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fill="url(#spendingGradient)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      fill="url(#savingsGradient)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Spending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Income</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Savings</span>
                </div>
              </div>
            </div>
          </FloatingElement>

          {/* Category Breakdown */}
          <FloatingElement delay={0.6}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Category Analysis</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>This month</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)'
                      }}
                      formatter={(value: any, name: any, props: any) => [
                        `${value}% (Rp ${props.payload.amount.toLocaleString('id-ID')})`, 
                        'Spending'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {analyticsData.categoryBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </FloatingElement>
        </div>

        {/* Weekly Spending Pattern */}
        <FloatingElement delay={0.7}>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Weekly Spending Pattern</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>This week</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.weeklySpending}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => `${(value/1000).toFixed(0)}K`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)'
                    }}
                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Amount']}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FloatingElement>

        {/* AI Insights Section */}
        <FloatingElement delay={0.8}>
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Financial Insights</h3>
                <p className="text-gray-300">Personalized recommendations based on your spending patterns</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <RocketIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${insight.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white text-lg font-bold">{insight.value}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      insight.type === 'positive' ? 'bg-green-500/20 text-green-300' :
                      insight.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                      insight.type === 'success' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {insight.type.toUpperCase()}
                    </div>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{insight.title}</h4>
                  <p className="text-gray-300 text-sm">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FloatingElement>

        {/* Export & Action Buttons */}
        <FloatingElement delay={0.9}>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Export & Actions</h3>
                <p className="text-gray-400 text-sm">Download reports or take action on insights</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                >
                  Export PDF Report
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
                >
                  Export CSV Data
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                >
                  Set Budget Goals
                </motion.button>
              </div>
            </div>
          </div>
        </FloatingElement>
      </div>
    </div>
  );
} 