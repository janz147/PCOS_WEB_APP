import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <header className="text-center mb-12 md:mb-16 lg:mb-20">
      <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-4 md:mb-6">
        <Icon name="Heart" size={32} className="md:w-10 md:h-10" color="var(--color-primary)" />
      </div>
      <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 md:mb-4 px-4">
        Welcome to PCOS Care
      </h1>
      <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
        Your comprehensive resource for understanding, managing, and thriving with PCOS
      </p>
    </header>
  );
};

export default WelcomeHeader;