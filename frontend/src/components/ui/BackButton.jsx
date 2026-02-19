import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Button from './Button';

const BackButton = ({ isSidebarOpen = false, className = '' }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      iconName="ArrowLeft"
      iconPosition="left"
      onClick={() => navigate(-1)}
      className={cn(
        'fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out',
        className
      )}
    >
      Back
    </Button>
  );
};

export default BackButton;