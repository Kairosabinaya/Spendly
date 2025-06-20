'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '@/hooks/useExpenses';
import useCategories from '@/hooks/useCategories';
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
import CountUp from 'react-countup';
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
  AreaChart
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

// Modern Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue, delay = 0, prefix = "", suffix = "" }: {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toLocaleString('id-ID');
  };

  return (
    <FloatingElement delay={delay}>
      <div className="relative group cursor-pointer">
        <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-20`}></div>
        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 p-6 group-hover:border-purple-500/50 group-hover:bg-white/15 group-hover:shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-300">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {trend && trendValue && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  trend === 'up' ? 'bg-green-500/20 text-green-300' : 
                  trend === 'down' ? 'bg-red-500/20 text-red-300' : 
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  <span>{trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}</span>
                  <span>{trendValue}%</span>
                </div>
              )}
            </div>
            
            <div className="mb-2">
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {prefix}
                <CountUp 
                  start={0} 
                  end={value} 
                  duration={2} 
                  formattingFn={formatValue}
                />
                {suffix}
              </div>
              <p className="text-gray-300 text-sm font-medium">{title}</p>
            </div>
          </div>
          
          {/* Hover glow effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
      </div>
    </FloatingElement>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, color, delay = 0 }: {
  icon: any;
  label: string;
  onClick: () => void;
  color: string;
  delay?: number;
}) => {
  return (
    <FloatingElement delay={delay}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative group w-full"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-30`}></div>
        <div className="relative bg-white/10 backdrop-blur-lg rounded-xl border border-white/30 p-4 group-hover:border-purple-500/50 group-hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">{label}</span>
          </div>
        </div>
      </motion.button>
    </FloatingElement>
  );
};

// Recent Transaction Item
const TransactionItem = ({ transaction, delay = 0 }: {
  transaction: {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: Date;
  };
  delay?: number;
}) => {
  const IconComponent = CategoryIconMap[transaction.category as keyof typeof CategoryIconMap] || MoneyIcon;
  
  return (
    <FloatingElement delay={delay}>
      <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">{transaction.description}</p>
            <p className="text-gray-400 text-sm">{transaction.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">Rp {transaction.amount.toLocaleString('id-ID')}</p>
          <p className="text-gray-400 text-sm">{transaction.date.toLocaleDateString('id-ID')}</p>
        </div>
      </div>
    </FloatingElement>
  );
};

// Budget Progress Component
const BudgetProgress = ({ category, spent, budget, color, delay = 0 }: {
  category: string;
  spent: number;
  budget: number;
  color: string;
  delay?: number;
}) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  const IconComponent = CategoryIconMap[category as keyof typeof CategoryIconMap] || MoneyIcon;
  
  return (
    <FloatingElement delay={delay}>
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">{category}</span>
          </div>
          <span className="text-gray-400 text-sm">{percentage.toFixed(0)}%</span>
        </div>
        
        <div className="mb-2">
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay }}
              className={`h-2 rounded-full bg-gradient-to-r ${color}`}
            />
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Rp {spent.toLocaleString('id-ID')}</span>
          <span className="text-gray-300">Rp {budget.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </FloatingElement>
  );
};

export default function EnhancedDashboard() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { expenses, loading, getMonthlyTotal, getCategoryBreakdown, getMonthlyTrend } = useExpenses();
  const { getActiveCategories, loading: categoriesLoading, seedDefaultCategories } = useCategories();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      // Seed default categories for new users
      seedDefaultCategories();
    }
  }, [currentUser, router, seedDefaultCategories]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#000319] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Mock data for demonstration (replace with real data)
  const mockData = {
    totalExpenses: 15750000,
    monthlyExpenses: 4250000,
    categoriesCount: 8,
    transactions: [
      { id: '1', description: 'Groceries at Supermarket', amount: 350000, category: 'Food & Dining', date: new Date() },
      { id: '2', description: 'Uber to Office', amount: 25000, category: 'Transportation', date: new Date() },
      { id: '3', description: 'Netflix Subscription', amount: 120000, category: 'Entertainment', date: new Date() },
      { id: '4', description: 'Medical Checkup', amount: 500000, category: 'Healthcare', date: new Date() },
    ],
    budgets: [
      { category: 'Food & Dining', spent: 2500000, budget: 3000000, color: 'from-orange-500 to-red-500' },
      { category: 'Transportation', spent: 800000, budget: 1000000, color: 'from-blue-500 to-cyan-500' },
      { category: 'Entertainment', spent: 450000, budget: 500000, color: 'from-purple-500 to-pink-500' },
      { category: 'Healthcare', spent: 300000, budget: 800000, color: 'from-green-500 to-emerald-500' },
    ],
    monthlyTrend: [
      { month: 'Jan', amount: 3500000 },
      { month: 'Feb', amount: 4200000 },
      { month: 'Mar', amount: 3800000 },
      { month: 'Apr', amount: 4500000 },
      { month: 'May', amount: 4250000 },
    ],
    categoryData: [
      { name: 'Food & Dining', value: 35, color: '#f97316' },
      { name: 'Transportation', value: 20, color: '#3b82f6' },
      { name: 'Entertainment', value: 15, color: '#8b5cf6' },
      { name: 'Healthcare', value: 12, color: '#10b981' },
      { name: 'Shopping', value: 10, color: '#f59e0b' },
      { name: 'Other', value: 8, color: '#6b7280' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#000319] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background stars */}
        {[...Array(50)].map((_, i) => (
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
          <div>
            <Link href="/" className="inline-block mb-4">
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl text-gray-300 mb-2">Welcome back, {currentUser.email?.split('@')[0]}!</h2>
              <p className="text-gray-400">Here&apos;s your financial overview for today</p>
            </motion.div>
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
            
            {/* Profile & Actions */}
            <div className="flex items-center space-x-3">
                              <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/add-expense')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg"
            >
              Add Expense
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/analytics')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg"
                  >
                    Analytics
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/settings')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg"
                  >
                    Settings
                  </motion.button>
                </div>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                >
                  {currentUser.email?.charAt(0).toUpperCase()}
                </motion.button>
                
                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-48 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-2 z-50"
                    >
            <button
              onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-all duration-300"
            >
              Logout
            </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Expenses"
            value={mockData.totalExpenses}
            icon={WalletIcon}
            color="from-purple-500 to-blue-500"
            trend="up"
            trendValue={12}
            delay={0.1}
            prefix="Rp "
          />
          <StatsCard
            title="This Month"
            value={mockData.monthlyExpenses}
            icon={ChartIcon}
            color="from-blue-500 to-cyan-500"
            trend="down"
            trendValue={5}
            delay={0.2}
            prefix="Rp "
          />
          <StatsCard
            title="Categories"
            value={mockData.categoriesCount}
            icon={TrendUpIcon}
            color="from-green-500 to-emerald-500"
            trend="neutral"
            delay={0.3}
          />
          <StatsCard
            title="Savings Goal"
            value={75}
            icon={MoneyIcon}
            color="from-orange-500 to-red-500"
            trend="up"
            trendValue={8}
            delay={0.4}
            suffix="%"
          />
        </div>
        
        {/* Quick Actions */}
        <FloatingElement delay={0.5}>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionButton
                icon={WalletIcon}
                label="Add Expense"
                onClick={() => router.push('/add-expense')}
                color="from-purple-500 to-blue-500"
                delay={0.1}
              />
              <QuickActionButton
                icon={ChartIcon}
                label="View Reports"
                onClick={() => {}}
                color="from-blue-500 to-cyan-500"
                delay={0.2}
              />
              <QuickActionButton
                icon={BillsIcon}
                label="Pay Bills"
                onClick={() => {}}
                color="from-green-500 to-emerald-500"
                delay={0.3}
              />
              <QuickActionButton
                icon={TrendUpIcon}
                label="Set Budget"
                onClick={() => {}}
                color="from-orange-500 to-red-500"
                delay={0.4}
              />
            </div>
          </div>
        </FloatingElement>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Spending Trend Chart */}
          <FloatingElement delay={0.6}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Spending Trend</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Last 5 months</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.monthlyTrend}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
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
                      formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Amount']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fill="url(#colorGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FloatingElement>

          {/* Category Breakdown */}
          <FloatingElement delay={0.7}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Category Breakdown</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>This month</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockData.categoryData.map((entry, index) => (
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
                      formatter={(value: any) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {mockData.categoryData.map((item, index) => (
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

        {/* Budget Progress & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Progress */}
          <FloatingElement delay={0.8}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Budget Progress</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-white text-sm font-medium rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                >
                  View All
                </motion.button>
              </div>
              <div className="space-y-4">
                {mockData.budgets.map((budget, index) => (
                  <BudgetProgress
                    key={budget.category}
                    category={budget.category}
                    spent={budget.spent}
                    budget={budget.budget}
                    color={budget.color}
                    delay={0.1 * index}
                  />
                ))}
              </div>
            </div>
          </FloatingElement>

          {/* Recent Transactions */}
          <FloatingElement delay={0.9}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-white text-sm font-medium rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                >
                  View All
                </motion.button>
              </div>
              <div className="space-y-4">
                {mockData.transactions.length > 0 ? (
                  mockData.transactions.map((transaction, index) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      delay={0.1 * index}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <WalletIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-400 mb-4">No transactions yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/add-expense')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Add your first expense
                    </motion.button>
                  </div>
                )}
              </div>
          </div>
          </FloatingElement>
        </div>

        {/* Financial Insights */}
        <FloatingElement delay={1.0}>
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Financial Insights</h3>
                <p className="text-gray-300">AI-powered recommendations for better financial health</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <RocketIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400">💡</span>
                  </div>
                  <span className="text-white font-medium">Smart Tip</span>
                </div>
                <p className="text-gray-300 text-sm">You&apos;re spending 15% less on dining out this month. Keep it up!</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400">⚠️</span>
                  </div>
                  <span className="text-white font-medium">Budget Alert</span>
                </div>
                <p className="text-gray-300 text-sm">You&apos;re 90% through your entertainment budget for this month.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400">📊</span>
                  </div>
                  <span className="text-white font-medium">Goal Progress</span>
                </div>
                <p className="text-gray-300 text-sm">You&apos;re on track to save Rp 2,500,000 this month!</p>
              </div>
            </div>
          </div>
        </FloatingElement>
      </div>
    </div>
  );
} 