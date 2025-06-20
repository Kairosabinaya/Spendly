import React from 'react';
import { motion } from 'framer-motion';

// Space-themed SVG components
export const SatelliteIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="satelliteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    {/* Satellite body */}
    <rect x="35" y="35" width="30" height="30" fill="url(#satelliteGradient)" rx="4" />
    {/* Solar panels */}
    <rect x="10" y="25" width="20" height="50" fill="#EC4899" rx="2" opacity="0.8" />
    <rect x="70" y="25" width="20" height="50" fill="#EC4899" rx="2" opacity="0.8" />
    {/* Antenna */}
    <line x1="50" y1="35" x2="50" y2="15" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="50" cy="15" r="3" fill="#F59E0B" />
    {/* Signal waves */}
    <circle cx="50" cy="50" r="40" stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.3" />
    <circle cx="50" cy="50" r="50" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

export const PlanetIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="planetGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="70%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </radialGradient>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B" opacity="0.6" />
        <stop offset="50%" stopColor="#EAB308" opacity="0.8" />
        <stop offset="100%" stopColor="#F59E0B" opacity="0.6" />
      </linearGradient>
    </defs>
    {/* Planet */}
    <circle cx="50" cy="50" r="25" fill="url(#planetGradient)" />
    {/* Surface details */}
    <circle cx="40" cy="40" r="4" fill="#047857" opacity="0.6" />
    <circle cx="60" cy="45" r="3" fill="#047857" opacity="0.4" />
    <circle cx="45" cy="60" r="5" fill="#047857" opacity="0.5" />
    {/* Ring */}
    <ellipse cx="50" cy="50" rx="35" ry="8" fill="none" stroke="url(#ringGradient)" strokeWidth="3" />
    <ellipse cx="50" cy="50" rx="35" ry="8" fill="url(#ringGradient)" opacity="0.2" />
  </svg>
);

export const RocketIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
      <radialGradient id="flameGradient" cx="50%" cy="0%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
    </defs>
    {/* Rocket body */}
    <ellipse cx="50" cy="45" rx="12" ry="35" fill="url(#rocketGradient)" />
    {/* Nose cone */}
    <path d="M38 10 L50 5 L62 10 L50 25 Z" fill="#DC2626" />
    {/* Window */}
    <circle cx="50" cy="30" r="6" fill="#3B82F6" opacity="0.8" />
    <circle cx="50" cy="30" r="4" fill="#60A5FA" opacity="0.6" />
    {/* Fins */}
    <path d="M38 60 L30 80 L38 75 Z" fill="#6B7280" />
    <path d="M62 60 L70 80 L62 75 Z" fill="#6B7280" />
    {/* Flame */}
    <ellipse cx="50" cy="85" rx="8" ry="15" fill="url(#flameGradient)" opacity="0.8" />
  </svg>
);

export const StarIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="starGradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
    </defs>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#starGradient)" />
  </svg>
);

export const AsteroidIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="asteroidGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#9CA3AF" />
        <stop offset="70%" stopColor="#6B7280" />
        <stop offset="100%" stopColor="#4B5563" />
      </radialGradient>
    </defs>
    {/* Irregular asteroid shape */}
    <path d="M20 30 Q10 40 15 55 Q5 70 25 80 Q40 90 60 85 Q80 90 90 70 Q95 50 85 35 Q90 20 70 15 Q50 5 30 15 Q15 20 20 30 Z" fill="url(#asteroidGradient)" />
    {/* Craters */}
    <circle cx="35" cy="40" r="5" fill="#4B5563" opacity="0.6" />
    <circle cx="60" cy="30" r="3" fill="#4B5563" opacity="0.4" />
    <circle cx="70" cy="55" r="4" fill="#4B5563" opacity="0.5" />
    <circle cx="25" cy="65" r="3" fill="#4B5563" opacity="0.4" />
  </svg>
);

// Animated space background component
export const SpaceBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Twinkling stars */}
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full opacity-60"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.2, 1, 0.2],
          scale: [0.5, 1, 0.5]
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      />
    ))}
    
    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          opacity: [0.1, 0.6, 0.1]
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      />
    ))}
  </div>
);

// Interactive floating space element
export const FloatingSpaceElement = ({ 
  children, 
  initialPosition, 
  className = "" 
}: {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  className?: string;
}) => (
  <motion.div
    className={`absolute ${className}`}
    style={{ left: initialPosition.x, top: initialPosition.y }}
    drag
    dragElastic={0.1}
    dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
    whileHover={{ 
      scale: 1.1, 
      rotate: 5,
      filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))"
    }}
    whileDrag={{ 
      scale: 1.2, 
      rotate: 10,
      filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.7))"
    }}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0]
    }}
    transition={{
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      },
      rotate: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
); 