import React from 'react';
import { Activity } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}

export function Logo({ className = '', size = 'md', variant = 'dark' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-11 sm:h-11',
  };

  const svgIconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg md:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-[10px] sm:text-[11px]',
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-[#0A192F]';
  const subtextColor = variant === 'light' ? 'text-cyan-300' : 'text-slate-500';

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 shrink-0 select-none ${className}`}>
      <div className={`${iconSizes[size]} rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0A192F] via-[#00A3C4] to-[#38BDF8] flex items-center justify-center text-white shadow-sm shrink-0`}>
        <Activity className={`${svgIconSizes[size]}`} />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className={`font-black tracking-tight ${titleSizes[size]} ${textColor} leading-none font-heading`}>
          IZCOR<span className="text-[#00A3C4]">.</span>
        </span>
        <span className={`font-bold uppercase tracking-widest ${subtitleSizes[size]} ${subtextColor} mt-0.5 whitespace-nowrap`}>
          Medicina &amp; Equipamiento
        </span>
      </div>
    </div>
  );
}

