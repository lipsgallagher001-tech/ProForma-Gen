import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  as?: 'input' | 'textarea';
}

export const Input: React.FC<InputProps> = ({ label, as = 'input', className = '', ...props }) => {
  const baseClasses = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-purple-200 uppercase tracking-wider ml-1">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          className={`${baseClasses} min-h-[100px] resize-y ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={`${baseClasses} ${className}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
};
