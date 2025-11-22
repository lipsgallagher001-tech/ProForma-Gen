import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  loading = false,
  className = '', 
  disabled,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20 border border-white/10',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/20',
    ghost: 'hover:bg-white/5 text-slate-300 hover:text-white',
  };

  return (
    <button
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="w-4 h-4">{icon}</span>
      )}
      {children}
    </button>
  );
};