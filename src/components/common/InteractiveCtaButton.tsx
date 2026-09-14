import React from 'react';
import { Link } from 'react-router-dom';

interface InteractiveCtaButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | string;
  id?: string;
  title?: string;
  previewImage?: string;
  previewTitle?: string;
  previewSubtitle?: string;
  previewPosition?: string;
  icon?: React.ReactNode;
  iconPosition?: string;
  className?: string;
}

export function InteractiveCtaButton({
  children,
  to,
  href,
  target,
  rel,
  onClick,
  className = '',
}: InteractiveCtaButtonProps) {
  if (to) {
    return (
      <Link to={to} className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${className}`}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${className}`}>
      {children}
    </button>
  );
}
