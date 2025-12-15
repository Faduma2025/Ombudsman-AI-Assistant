import React from 'react';
import clsx from 'clsx';
import { RulingType } from '../../types/case';

interface BadgeProps {
  ruling: RulingType;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ ruling, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorClasses = {
    'Applicant': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Bank': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Partially Applicant': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        colorClasses[ruling]
      )}
    >
      {ruling}
    </span>
  );
};
