import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-ocean-300 text-ocean-900 hover:bg-white hover:shadow-lg hover:shadow-ocean-300/20",
    secondary: "bg-ocean-700 text-white hover:bg-ocean-600",
    outline: "border border-ocean-300 text-ocean-300 hover:bg-ocean-300/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};