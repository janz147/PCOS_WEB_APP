import React from 'react';
import image1 from '../../../img/4.png';

const WelcomeHeader = () => {
  return (
    <header className="text-center mb-12 md:mb-16 lg:mb-20">
      <div className="inline-flex items-center justify-center 
  w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 
  rounded-2xl bg-primary/10 mb-4 md:mb-6 overflow-hidden">
        <img
          src={image1}
          alt="CystSense Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 md:mb-4 px-4">
        Welcome to CystSense
      </h1>

      <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
        Your comprehensive resource for understanding, managing, and thriving with PCOS
      </p>
    </header>
  );
};

export default WelcomeHeader;