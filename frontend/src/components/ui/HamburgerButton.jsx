import React from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const HamburgerButton = ({ isOpen = false, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed top-4 z-50 w-12 h-12 rounded-xl',
        'bg-card border border-border shadow-coral-md',
        'flex items-center justify-center',
        'hover:bg-primary/10 hover:shadow-coral-lg',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'transition-all duration-300 ease-in-out',
        isOpen ? 'left-24' : 'left-4',
        className
      )}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Icon 
          name="Menu" 
          size={24} 
          className={cn(
            'absolute text-foreground transition-all duration-300 ease-in-out',
            isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          )} 
        />
        <Icon 
          name="ArrowLeft" 
          size={24} 
          className={cn(
            'absolute text-foreground transition-all duration-300 ease-in-out',
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          )} 
        />
      </div>
    </button>
  );
};

export default HamburgerButton;