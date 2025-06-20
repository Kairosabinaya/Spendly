'use client';

import { motion } from 'framer-motion';
import { RocketIcon, SatelliteIcon, PlanetIcon } from '@/components/SpaceElements';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  variant?: 'spinner' | 'dots' | 'pulse' | 'space';
}

export const Loading = ({ 
  size = 'md', 
  message = 'Loading...', 
  fullScreen = false, 
  variant = 'space' 
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-[#000319] flex items-center justify-center z-50' 
    : 'flex items-center justify-center p-4';

  const LoadingSpinner = () => (
    <motion.div
      className={`border-2 border-purple-500 border-t-transparent rounded-full ${sizeClasses[size]}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  const LoadingDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`bg-purple-500 rounded-full ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );

  const LoadingPulse = () => (
    <motion.div
      className={`bg-gradient-to-r from-purple-500 to-blue-500 rounded-full ${sizeClasses[size]}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );

  const LoadingSpace = () => (
    <div className="relative">
      {/* Central rocket */}
      <motion.div
        className={`${sizeClasses[size]} text-purple-400`}
        animate={{
          y: [-5, 5, -5],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <RocketIcon className="w-full h-full" />
      </motion.div>

      {/* Orbiting elements */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <div className={`absolute -top-2 -right-2 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-blue-400`}>
          <SatelliteIcon className="w-full h-full" />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <div className={`absolute -bottom-2 -left-2 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-cyan-400`}>
          <PlanetIcon className="w-full h-full" />
        </div>
      </motion.div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.cos((i * 60) * Math.PI / 180) * (size === 'sm' ? 20 : size === 'md' ? 30 : size === 'lg' ? 40 : 50) + 50}%`,
            top: `${Math.sin((i * 60) * Math.PI / 180) * (size === 'sm' ? 20 : size === 'md' ? 30 : size === 'lg' ? 40 : 50) + 50}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  );

  const renderLoadingVariant = () => {
    switch (variant) {
      case 'spinner':
        return <LoadingSpinner />;
      case 'dots':
        return <LoadingDots />;
      case 'pulse':
        return <LoadingPulse />;
      case 'space':
      default:
        return <LoadingSpace />;
    }
  };

  return (
    <div className={containerClasses}>
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Background stars for fullscreen */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
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
      )}
      
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {renderLoadingVariant()}
        
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-gray-300 text-center ${
              size === 'sm' ? 'text-sm' : 
              size === 'md' ? 'text-base' : 
              size === 'lg' ? 'text-lg' : 'text-xl'
            }`}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

// Specific loading components for common use cases
export const PageLoading = ({ message = 'Loading page...' }: { message?: string }) => (
  <Loading size="lg" message={message} fullScreen variant="space" />
);

export const ButtonLoading = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
  <Loading size={size} variant="spinner" />
);

export const CardLoading = ({ message = 'Loading data...' }: { message?: string }) => (
  <Loading size="md" message={message} variant="dots" />
);

export const InlineLoading = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
  <Loading size={size} variant="pulse" />
);

export default Loading; 