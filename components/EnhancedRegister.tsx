'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  monthlyIncome: number;
  budgetGoal: number;
  expenseCategories: string[];
};

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  // Questionnaire fields
  fullName: yup
    .string()
    .required('Full name is required'),
  monthlyIncome: yup
    .number()
    .required('Monthly income is required')
    .positive('Monthly income must be positive'),
  budgetGoal: yup
    .number()
    .required('Budget goal is required')
    .positive('Budget goal must be positive'),
  expenseCategories: yup
    .array()
    .of(yup.string().required())
    .required()
    .min(1, 'Please select at least one expense category'),
});

export default function EnhancedRegister() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [monthlyIncomeDisplay, setMonthlyIncomeDisplay] = useState('');
  const [budgetGoalDisplay, setBudgetGoalDisplay] = useState('');

  const totalSteps = 6;

  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Travel', 'Education',
    'Groceries', 'Personal Care', 'Investments', 'Other'
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      expenseCategories: [],
    },
  });

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    // Add thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setMonthlyIncomeDisplay(formatted);
    
    // Set the numeric value for form validation
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
    setValue('monthlyIncome', numericValue);
  };

  const handleBudgetGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setBudgetGoalDisplay(formatted);
    
    // Set the numeric value for form validation
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
    setValue('budgetGoal', numericValue);
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setValue('expenseCategories', newCategories);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['fullName'];
        break;
      case 2:
        fieldsToValidate = ['email'];
        break;
      case 3:
        fieldsToValidate = ['password', 'confirmPassword'];
        break;
      case 4:
        fieldsToValidate = ['monthlyIncome'];
        break;
      case 5:
        fieldsToValidate = ['budgetGoal'];
        break;
      case 6:
        fieldsToValidate = ['expenseCategories'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      await registerUser(data.email, data.password);
      
      // Store user profile data in localStorage for now
      // In a real app, this would be stored in the database
      const userProfile = {
        fullName: data.fullName,
        monthlyIncome: data.monthlyIncome,
        currency: 'IDR', // Default to IDR
        budgetGoal: data.budgetGoal,
        expenseCategories: data.expenseCategories,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      toast.success('Welcome to Spendly! Your profile has been set up.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "What's your name?";
      case 2: return "What's your email?";
      case 3: return "Create a secure password";
      case 4: return "What's your monthly income?";
      case 5: return "Set your budget goal";
      case 6: return "Choose your expense categories";
      default: return "Welcome to Spendly";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return "Let's start with your full name";
      case 2: return "We'll use this to create your account";
      case 3: return "Keep your account secure";
      case 4: return "This helps us personalize your experience";
      case 5: return "How much do you want to spend monthly?";
      case 6: return "Select categories that match your spending";
      default: return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register('fullName')}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                autoFocus
              />
              <AnimatePresence>
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.fullName.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <input
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                autoFocus
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <input
                type="password"
                placeholder="Create a password"
                {...register('password')}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg mb-4"
                autoFocus
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-1 mb-4"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <input
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
              />
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">Rp</span>
                <input
                  type="text"
                  placeholder="4.000.000"
                  value={monthlyIncomeDisplay}
                  onChange={handleMonthlyIncomeChange}
                  className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                  autoFocus
                />
              </div>
              <AnimatePresence>
                {errors.monthlyIncome && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.monthlyIncome.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">Rp</span>
                <input
                  type="text"
                  placeholder="2.000.000"
                  value={budgetGoalDisplay}
                  onChange={handleBudgetGoalChange}
                  className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                  autoFocus
                />
              </div>
              <AnimatePresence>
                {errors.budgetGoal && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    {errors.budgetGoal.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {expenseCategories.map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-sm font-medium ${
                    selectedCategories.includes(category)
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-purple-400 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {errors.expenseCategories && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.expenseCategories.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#000319] relative overflow-hidden flex items-center justify-center py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Home</span>
          </motion.button>
        </Link>
      </motion.div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl"
        >
          {/* Logo and Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              <Link href="/">
                <motion.h1 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent cursor-pointer transition-all duration-300"
                >
                  Spendly
                </motion.h1>
              </Link>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{getStepTitle()}</h2>
            <p className="text-gray-400">{getStepSubtitle()}</p>
          </motion.div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
                             {currentStep > 1 && (
                 <motion.button
                   type="button"
                   onClick={prevStep}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="flex-1 py-4 bg-white/10 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 shadow-md hover:shadow-lg"
                 >
                   Back
                 </motion.button>
               )}
              
                             {currentStep < totalSteps ? (
                 <motion.button
                   type="button"
                   onClick={nextStep}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent border border-purple-400/50 hover:border-purple-300 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                 >
                   Continue
                 </motion.button>
              ) : (
                                 <motion.button
                   type="submit"
                   disabled={isLoading}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent border border-purple-400/50 hover:border-purple-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                 >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-6"
          >
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 