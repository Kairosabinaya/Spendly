'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
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
import useCategories from '@/hooks/useCategories';
import { useExpenses } from '@/hooks/useExpenses';
import { 
  SatelliteIcon, 
  PlanetIcon, 
  RocketIcon, 
  StarIcon, 
  AsteroidIcon 
} from '@/components/SpaceElements';
import Link from 'next/link';

const schema = yup.object({
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  date: yup.string().required('Date is required'),
});

interface FormData {
  amount: number;
  description: string;
  category: string;
  date: string;
}

// Categories now come from database via useCategories hook

// Format number with Indonesian thousand separators
const formatRupiah = (value: string) => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '');
  
  // Add thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted value back to number
const parseRupiah = (value: string) => {
  return parseInt(value.replace(/\./g, '')) || 0;
};

export default function EnhancedAddExpense() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amountDisplay, setAmountDisplay] = useState('');
  
  // Use database-driven categories and expenses
  const { getActiveCategories, loading: categoriesLoading, seedDefaultCategories } = useCategories();
  const { addExpense, error: expenseError } = useExpenses();
  
  // Transform categories to include actual icon components and ensure unique keys
  const categories = getActiveCategories().map((category, index) => {
    // Get the icon component from the icon string name
    let IconComponent;
    if (typeof category.icon === 'string') {
      // Map string icon names to actual components
      const iconMap: Record<string, any> = {
        'FoodIcon': FoodIcon,
        'TransportIcon': TransportIcon,
        'ShoppingIcon': ShoppingIcon,
        'EntertainmentIcon': EntertainmentIcon,
        'BillsIcon': BillsIcon,
        'HealthIcon': HealthIcon,
        'TravelIcon': TravelIcon,
        'EducationIcon': EducationIcon,
        'MoneyIcon': MoneyIcon,
      };
      IconComponent = iconMap[category.icon] || MoneyIcon;
    } else {
      IconComponent = category.icon || MoneyIcon;
    }
    
    return {
      ...category,
      icon: IconComponent,
      // Ensure unique keys by using combination of name and index
      uniqueKey: `${category.name}-${index}-${category.id || index}`
    };
  }).filter((category, index, self) => {
    // Remove duplicates based on category name
    return index === self.findIndex(c => c.name === category.name);
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      await addExpense({
        amount: data.amount,
        category: data.category,
        date: data.date,
        description: data.description || '',
      });
      
      reset();
      setSelectedCategory('');
      setAmountDisplay('');
      router.push('/dashboard');
    } catch (error: any) {
      // Error handling is done in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiah(e.target.value);
    setAmountDisplay(formatted);
    setValue('amount', parseRupiah(formatted));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue('category', category);
  };

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#000319] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background stars */}
        {[...Array(30)].map((_, i) => (
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
          className="absolute top-20 right-10 w-12 h-12 opacity-20"
          animate={{ rotate: 360, y: [-10, 10, -10] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <RocketIcon className="w-full h-full text-purple-400" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
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
                  className="text-2xl lg:text-3xl font-bold text-white cursor-pointer"
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
              <p className="text-gray-400 text-sm">Add new expense</p>
            </div>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Amount Input */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg font-medium">Rp</span>
                </div>
                <input
                  type="text"
                  value={amountDisplay}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                />
              </div>
              {errors.amount && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.amount.message}
                </motion.p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.name;
                  
                  return (
                    <motion.button
                      key={category.uniqueKey}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategorySelect(category.name)}
                      className={`relative p-4 rounded-xl border transition-all duration-300 ${
                        isSelected
                          ? `bg-gradient-to-br ${category.color} border-white/30 shadow-2xl shadow-purple-500/20`
                          : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`w-8 h-8 flex items-center justify-center ${
                          isSelected ? '' : `bg-gradient-to-br ${category.color} rounded-lg`
                        }`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-xs font-medium text-center ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}>
                          {category.name}
                        </span>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {errors.category && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.category.message}
                </motion.p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">
                Description
              </label>
              <input
                type="text"
                placeholder="What did you spend on?"
                {...register('description')}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              {errors.description && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.description.message}
                </motion.p>
              )}
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">
                Date
              </label>
              <input
                type="date"
                {...register('date')}
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              {errors.date && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.date.message}
                </motion.p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  'Add Expense'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Quick Amount Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Amounts</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[50000, 100000, 250000, 500000, 1000000, 2500000].map((amount, index) => (
              <motion.button
                key={amount}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const formatted = formatRupiah(amount.toString());
                  setAmountDisplay(formatted);
                  setValue('amount', amount);
                }}
                className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-medium border border-white/10 hover:border-purple-500/30"
              >
                {amount >= 1000000 ? `${amount/1000000}M` : `${amount/1000}K`}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 