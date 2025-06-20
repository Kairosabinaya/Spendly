'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { RocketIcon } from '@/components/SpaceElements';
import Link from 'next/link';

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
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Settings Section Component
const SettingsSection = ({ title, description, children, delay = 0 }: {
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <FloatingElement delay={delay}>
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        {children}
      </div>
    </FloatingElement>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label }: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-300 text-sm">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// Profile form schema
const profileSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  monthlyIncome: yup.number().required('Monthly income is required').positive('Must be positive'),
  budgetGoal: yup.number().required('Budget goal is required').positive('Must be positive'),
  currency: yup.string().required('Currency is required'),
});

interface ProfileFormData {
  fullName: string;
  email: string;
  monthlyIncome: number;
  budgetGoal: number;
  currency: string;
}

export default function EnhancedSettings() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      budgetAlerts: true,
      spendingReminders: true,
      weeklyReports: true,
      monthlyReports: true,
      emailNotifications: true,
      pushNotifications: true,
    },
    privacy: {
      shareData: false,
      publicProfile: false,
      analyticsTracking: true,
    },
    security: {
      twoFactorAuth: false,
      biometricLogin: false,
      sessionTimeout: 30,
    }
  });

  // Format number with Indonesian thousand separators
  const formatRupiah = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseRupiah = (value: string) => {
    return parseInt(value.replace(/\./g, '')) || 0;
  };

  const [incomeDisplay, setIncomeDisplay] = useState('');
  const [budgetDisplay, setBudgetDisplay] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: 'John Doe',
      email: currentUser?.email || '',
      monthlyIncome: 8000000,
      budgetGoal: 5000000,
      currency: 'IDR',
    }
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      // Load saved profile data
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setValue('fullName', profile.fullName || 'John Doe');
        setValue('monthlyIncome', profile.monthlyIncome || 8000000);
        setValue('budgetGoal', profile.budgetGoal || 5000000);
        setValue('currency', profile.currency || 'IDR');
        
        setIncomeDisplay(formatRupiah((profile.monthlyIncome || 8000000).toString()));
        setBudgetDisplay(formatRupiah((profile.budgetGoal || 5000000).toString()));
      }
    }
  }, [currentUser, router, setValue]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(data));
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiah(e.target.value);
    setIncomeDisplay(formatted);
    setValue('monthlyIncome', parseRupiah(formatted));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiah(e.target.value);
    setBudgetDisplay(formatted);
    setValue('budgetGoal', parseRupiah(formatted));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const updateSettings = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    toast.success('Settings updated!');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#000319] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'categories', name: 'Categories', icon: '📂' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
  ];

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
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
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
              <h2 className="text-xl text-gray-300 mb-1">Settings & Preferences</h2>
              <p className="text-gray-400 text-sm">Manage your account and application settings</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-2 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <SettingsSection
              title="Profile Information"
              description="Update your personal information and financial details"
              delay={0.2}
            >
              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </form>
            </SettingsSection>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <SettingsSection
              title="Category Management"
              description="Manage your expense categories, add custom ones, and organize spending"
              delay={0.2}
            >
              <div className="space-y-4">
                <p className="text-gray-300">
                  Categories help you organize and track your expenses. You can create custom categories, 
                  modify existing ones, and control which categories are active.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/settings/categories" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>📂</span>
                      <span>Manage Categories</span>
                      <span>→</span>
                    </motion.button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">✨ Features</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Create custom categories</li>
                      <li>• Choose icons and colors</li>
                      <li>• Enable/disable categories</li>
                      <li>• Real-time updates</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">🎯 Benefits</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Better expense organization</li>
                      <li>• Personalized tracking</li>
                      <li>• Improved analytics</li>
                      <li>• Cleaner reports</li>
                    </ul>
                  </div>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <SettingsSection
              title="Notification Preferences"
              description="Choose how and when you want to receive notifications"
              delay={0.2}
            >
              <div className="space-y-1">
                <ToggleSwitch
                  enabled={settings.notifications.budgetAlerts}
                  onChange={(value) => updateSettings('notifications', 'budgetAlerts', value)}
                  label="Budget alerts when approaching limits"
                />
                <ToggleSwitch
                  enabled={settings.notifications.spendingReminders}
                  onChange={(value) => updateSettings('notifications', 'spendingReminders', value)}
                  label="Daily spending reminders"
                />
                <ToggleSwitch
                  enabled={settings.notifications.weeklyReports}
                  onChange={(value) => updateSettings('notifications', 'weeklyReports', value)}
                  label="Weekly spending reports"
                />
              </div>
            </SettingsSection>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <SettingsSection
              title="Privacy Settings"
              description="Control how your data is used and shared"
              delay={0.2}
            >
              <div className="space-y-1">
                <ToggleSwitch
                  enabled={settings.privacy.shareData}
                  onChange={(value) => updateSettings('privacy', 'shareData', value)}
                  label="Share anonymized data for product improvement"
                />
                <ToggleSwitch
                  enabled={settings.privacy.publicProfile}
                  onChange={(value) => updateSettings('privacy', 'publicProfile', value)}
                  label="Make profile visible to other users"
                />
              </div>
            </SettingsSection>
          )}
        </div>

        {/* Danger Zone */}
        <FloatingElement delay={0.4}>
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-red-500/20 p-6 mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <p className="text-gray-300 mb-2">Account Management</p>
                <p className="text-gray-400 text-sm">These actions cannot be undone</p>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </FloatingElement>
      </div>
    </div>
  );
} 