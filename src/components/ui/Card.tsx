import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, className, noPadding = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm", className)}
    >
      {title && (
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{title}</h3>
        </div>
      )}
      <div className={cn(noPadding ? "" : "p-6")}>
        {children}
      </div>
    </motion.div>
  );
};
