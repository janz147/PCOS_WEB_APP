import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import QuizTypeModal from './QuizTypeModal';
import ConsentModal from './ConsentModal';

const QuizLauncher = ({ 
  onStart,
  className = ''
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (onStart) {
      await onStart();
    }
    setShowConsent(true);
  };

  const handleConsentAccept = () => {
    setShowConsent(false);
    setShowModal(true);
  };

  const handleSelectQuizType = (type) => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      navigate('/quiz', { state: { quizType: type } });
    }, 800);
  };

  return (
    <>
      <div className={`
        card-base 
        border-2 
        border-primary 
        bg-gradient-to-br 
        from-primary/5 
        to-accent/5
        transition-default 
        hover:shadow-coral-xl 
        hover:-translate-y-2
        ${className}
      `}>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
            <Icon name="ClipboardList" size={40} color="var(--color-primary-foreground)" />
          </div>
          
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-2xl text-foreground">
              PCOS Assessment Quiz
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Take our comprehensive quiz to understand your PCOS symptoms and get personalized recommendations
            </p>
          </div>
          
          <Button
            variant="default"
            size="lg"
            onClick={handleStart}
            loading={isStarting}
            iconName="ArrowRight"
            iconPosition="right"
            className="text-lg px-10 py-6 h-auto"
          >
            START QUIZ NOW
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Takes approximately 5-7 minutes</span>
          </div>
        </div>
      </div>

      <ConsentModal
        isOpen={showConsent}
        onAccept={handleConsentAccept}
        onClose={() => setShowConsent(false)}
      />

      <QuizTypeModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectQuizType={handleSelectQuizType}
      />
    </>
  );
};

export default QuizLauncher;