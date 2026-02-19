import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { cn } from '../../utils/cn';

const QuizTypeModal = ({ isOpen, onClose, onSelectQuizType }) => {
  if (!isOpen) return null;

  const handleSelectType = (type) => {
    onSelectQuizType(type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 animate-scaleIn">
        <div className="card-base border-2 border-primary/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Icon name="Sparkles" size={16} />
              <span>Choose Your Quiz Type</span>
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
              Select Quiz Type
            </h2>
            <p className="text-muted-foreground">
              Choose the quiz that best fits your needs
            </p>
          </div>

          {/* Quiz Type Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* General Quiz */}
            <button
              onClick={() => handleSelectType('general')}
              className={cn(
                'group relative p-6 rounded-xl border-2 transition-default text-left',
                'border-border hover:border-primary hover:bg-primary/5',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-default">
                  <Icon name="ClipboardList" size={28} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                    General Quiz
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A comprehensive assessment covering symptoms, lifestyle, and health history. Perfect for anyone seeking PCOS insights.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>5-7 minutes</span>
                </div>
              </div>
            </button>

            {/* Professional Quiz */}
            <button
              onClick={() => handleSelectType('professional')}
              className={cn(
                'group relative p-6 rounded-xl border-2 transition-default text-left',
                'border-border hover:border-primary hover:bg-primary/5',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-default">
                  <Icon name="Stethoscope" size={28} color="var(--color-accent)" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                    Professional Quiz
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Advanced assessment with optional ultrasound image upload. Ideal for healthcare professionals or detailed analysis.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>7-10 minutes</span>
                </div>
              </div>
            </button>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTypeModal;