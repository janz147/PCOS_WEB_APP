import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const Sidebar = ({ className = '', isOpen = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 1,
      name: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/pcos-care-dashboard'
    },
    {
      id: 2,
      name: 'Clinics',
      icon: 'MapPin',
      path: '/clinics-near-me'
    },
    {
      id: 3,
      name: 'About',
      icon: 'Info',
      path: '/about'
    }
  ];

  const isActive = (path) => {
    if (path === '/pcos-care-dashboard') {
      return location?.pathname === '/' || location?.pathname === '/pcos-care-dashboard';
    }
    return location?.pathname === path;
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen w-20 bg-card border-r border-border shadow-coral-md z-40',
      'flex flex-col items-center py-8 gap-6 transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      className
    )}>
      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
        <Icon name="Heart" size={24} color="var(--color-primary-foreground)" />
      </div>

      {/* Divider between logo and navigation */}
      <div className="w-14 h-px bg-border" />

      <nav className="flex flex-col gap-4">
        {navItems?.map((item) => (
          <button
            key={item?.id}
            onClick={() => navigate(item?.path)}
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center transition-default',
              'hover:bg-primary/10 hover:shadow-coral-sm',
              isActive(item?.path)
                ? 'bg-primary text-primary-foreground shadow-coral-md'
                : 'bg-muted text-muted-foreground'
            )}
            title={item?.name}
          >
            <Icon name={item?.icon} size={24} />
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;