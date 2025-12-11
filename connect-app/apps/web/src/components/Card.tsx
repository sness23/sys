import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6',
        onClick && 'cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all',
        className
      )}
    >
      {children}
    </div>
  );
}
