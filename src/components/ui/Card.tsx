import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md' 
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700';
  const hoverStyles = hover ? 'hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1' : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function CardHeader({ 
  title, 
  subtitle, 
  icon, 
  className = '',
  gradient = 'from-blue-500 to-indigo-600'
}: CardHeaderProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} p-6 text-white rounded-t-xl ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
