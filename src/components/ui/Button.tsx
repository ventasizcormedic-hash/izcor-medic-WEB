import React from 'react';

export const buttonVariants = (props?: any) => '';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'cyan' | string;
  size?: 'sm' | 'md' | 'lg' | string;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-xl font-bold transition-all shadow-md inline-flex items-center justify-center gap-2";
  const variants: Record<string, string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-cyan-500 hover:bg-cyan-400 text-slate-950",
    cyan: "bg-cyan-500 hover:bg-cyan-400 text-slate-950",
    outline: "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span>{loadingText || 'Cargando...'}</span>
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
    </button>
  );
}
