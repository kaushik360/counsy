import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "", showText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
      >
        {/* Head Profile Outline - Dark Teal Stroke */}
        <path 
          d="M38 85 C 18 85 15 45 15 42 C 15 18 35 10 55 10 C 72 10 82 22 82 38 C 82 43 80 45 84 48 C 85 48.5 84 51 82 52 C 82 55 82 59 78 61 C 76 63 70 66 62 66" 
          stroke="#0f766e" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="dark:stroke-teal-400"
        />

        {/* Plant Stem - connects from start of head line */}
        <path 
          d="M38 85 Q 52 85 52 58" 
          stroke="#0f766e" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          className="dark:stroke-teal-400"
        />

        {/* Leaves - Gradient Fill */}
        <defs>
            <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5eead4" /> {/* teal-300 */}
                <stop offset="100%" stopColor="#2dd4bf" /> {/* teal-400 */}
            </linearGradient>
        </defs>

        {/* Left Leaf */}
        <path 
            d="M52 58 Q 35 52 35 40 Q 42 30 52 48" 
            fill="url(#leafGradient)"
            fillOpacity="0.9"
        />
        
        {/* Right Leaf */}
        <path 
            d="M52 58 Q 69 52 69 40 Q 62 30 52 48" 
            fill="url(#leafGradient)"
            fillOpacity="0.9"
        />
      </svg>
      {showText && (
          <span className={`font-medium tracking-tight text-teal-900 dark:text-white ${size > 30 ? 'text-3xl' : 'text-xl'}`}>
              Counsy
          </span>
      )}
    </div>
  );
};