import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardCard = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  route, 
  onClick,
  isHighlighted = false,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <div 
      className={`
        card-base 
        transition-default 
        hover:shadow-coral-lg 
        hover:-translate-y-1
        ${isHighlighted ? 'border-2 border-primary' : ''}
        ${className}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          ${isHighlighted ? 'bg-primary' : 'bg-primary/10'}
        `}>
          <Icon 
            name={icon} 
            size={32} 
            color={isHighlighted ? 'var(--color-primary-foreground)' : 'var(--color-primary)'} 
          />
        </div>
        
        <h3 className="font-heading font-semibold text-xl text-foreground">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {buttonText && (
          <Button
            variant={isHighlighted ? 'default' : 'outline'}
            onClick={handleClick}
            className="mt-2"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;