import React from 'react';

const LoadingScreen = ({ isLoading = false }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col items-center gap-4 animate-scaleIn">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-0 rounded-full border-4 border-accent/40 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
        <p className="text-foreground font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;