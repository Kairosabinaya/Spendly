'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useCategories, { Category } from '@/hooks/useCategories';
import { MoneyIcon, BillsIcon, FoodIcon } from '@/components/icons/ExpenseIcons';
import { RocketIcon } from '@/components/SpaceElements';

export default function CategoryManagement() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { 
    getAllCategories, 
    loading,
    seedDefaultCategories 
  } = useCategories();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      seedDefaultCategories();
    }
  }, [currentUser, router, seedDefaultCategories]);

  const categories = getAllCategories();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#000319] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000319] relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              >
                ←
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Category Management
              </h1>
              <p className="text-gray-400 text-sm">Manage your expense categories</p>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <RocketIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No categories yet</h3>
            <p className="text-gray-400 mb-6">Categories will appear here once loaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <MoneyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 