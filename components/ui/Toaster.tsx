'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';

// Custom toast component that matches our space theme
export const SpaceToaster = () => {
  return (
    <HotToaster
      position="top-right"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        loading: {
          style: {
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#fff',
          },
          iconTheme: {
            primary: '#a855f7',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

// Custom notification component for in-app notifications
interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: (id: string) => void;
}

export const SpaceNotification = ({ 
  id, 
  title, 
  message, 
  type, 
  duration = 5000, 
  onClose 
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/30',
          icon: '✅',
          iconBg: 'bg-green-500/20'
        };
      case 'error':
        return {
          bg: 'from-red-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          icon: '❌',
          iconBg: 'bg-red-500/20'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: '⚠️',
          iconBg: 'bg-yellow-500/20'
        };
      default:
        return {
          bg: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          icon: 'ℹ️',
          iconBg: 'bg-blue-500/20'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-gradient-to-r ${styles.bg} backdrop-blur-lg rounded-xl border ${styles.border} p-4 shadow-2xl`}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm">{styles.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm">{title}</h4>
              <p className="text-gray-200 text-xs mt-1">{message}</p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification manager hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id, onClose: removeNotification }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {notifications.map(notification => (
        <SpaceNotification key={notification.id} {...notification} />
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer,
    notifications
  };
};

export default SpaceToaster; 