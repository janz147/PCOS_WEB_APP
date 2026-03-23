import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ConsentModal = ({ isOpen, onAccept, onClose }) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (accepted) {
      setAccepted(false);
      onAccept();
    }
  };

  const handleClose = () => {
    setAccepted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-scaleIn">
        <div className="card-base border-2 border-primary/20">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Icon name="ShieldCheck" size={16} />
              <span>Before You Begin</span>
            </div>
            <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
              Consent to Proceed
            </h2>
            <p className="text-muted-foreground text-sm">
              Please review and acknowledge the following before starting the quiz.
            </p>
          </div>

          {/* Consent Content */}
          <div className="bg-muted/30 rounded-xl p-5 mb-6 text-sm text-muted-foreground space-y-3 border border-border">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-xs">
              <span className="font-semibold">⚠ Medical Disclaimer:</span> This tool does not diagnose PCOS and cannot replace consultation with a doctor. Results are predictive estimations only.
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-xs">
              <span className="font-semibold">⚠ Content Sensitivity Notice:</span> The following assessment discusses topics related to weight, fertility, or mental health. Some users may find this content sensitive. You may stop or exit at any time.
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>This quiz is for educational and awareness purposes only.</li>
              <li>Results are not a substitute for professional medical advice.</li>
              <li>If you are experiencing a medical emergency, contact emergency services immediately.</li>
              <li>If worried about your symptoms, please consult an OB-GYN or women's health clinic.</li>
            </ul>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-6 group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e?.target?.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  accepted
                    ? 'bg-primary border-primary' :'border-border bg-background group-hover:border-primary/60'
                }`}
              >
                {accepted && (
                  <Icon name="Check" size={12} color="var(--color-primary-foreground)" />
                )}
              </div>
            </div>
            <span className="text-sm text-foreground leading-relaxed">
              I have read and accept the{' '}
              <span className="text-primary font-medium">terms and conditions</span>. I understand
              this quiz is for informational purposes only and does not replace professional medical advice.
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleProceed}
              disabled={!accepted}
              iconName="ArrowRight"
              iconPosition="right"
              className={`transition-all duration-200 ${
                !accepted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
