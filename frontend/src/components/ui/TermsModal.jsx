import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const TermsModal = ({ isOpen, onAccept, onClose, viewOnly = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={viewOnly ? onClose : undefined}
      />
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 animate-scaleIn">
        <div className="card-base border-2 border-primary/20">
          {/* Header */}
          <div className="text-center mb-6 relative">
            {viewOnly && (
              <button
                onClick={onClose}
                className="absolute right-0 top-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <Icon name="X" size={18} />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Icon name="FileText" size={16} />
              <span>Welcome to CystSense</span>
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
              Terms &amp; Conditions
            </h2>
            <p className="text-muted-foreground text-sm">
              Please read and accept the terms and conditions before using this application.
            </p>
          </div>

          {/* Terms Content */}
          <div className="bg-muted/30 rounded-xl p-5 mb-6 max-h-72 overflow-y-auto text-sm text-muted-foreground space-y-5 border border-border">

            <div>
              <h3 className="font-semibold text-foreground mb-1">1. Introduction</h3>
              <p>
                Welcome to our prototype web application. This Application is a research and educational tool designed to promote early risk awareness of Polycystic Ovarian Syndrome (PCOS) and provide nursing-oriented health guidance.
              </p>
              <p className="mt-2">
                By accessing or using this Application, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please discontinue use immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">2. Nature of the Application</h3>
              <p className="mb-2">This Application:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Is a prototype developed for academic, research, and educational purposes.</li>
                <li>Uses machine learning models to estimate potential risk indicators associated with PCOS.</li>
                <li>Provides general health awareness information and nursing-oriented management suggestions.</li>
                <li>Does <strong>NOT</strong> provide medical diagnosis, treatment, or personalized medical advice.</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-xs mb-2">
                <span className="font-semibold">⚠ Important Medical Disclaimer:</span> "This tool does not diagnose PCOS and cannot replace consultation with a doctor."
              </div>
              <p className="mb-2">Users acknowledge that:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>The results generated are predictive estimations only.</li>
                <li>Outputs may not be accurate, complete, or suitable for medical decision-making.</li>
                <li>The Application must not be relied upon for diagnosing any medical condition.</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-xs mb-2">
                <span className="font-semibold">⚠ Referral Advice:</span> "If you are worried about your symptoms, please consult an OB-GYN or women's health clinic."
              </div>
              <p className="mb-2">The Application is intended for educational and awareness purposes only and is not a substitute for professional medical consultation.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-xs mb-2">
                <span className="font-semibold">⚠ Content Sensitivity Notice:</span> "Content Notice: The following section discusses topics related to weight, fertility, or mental health. Some users may find this content sensitive. You may stop or exit the assessment at any time."
              </div>
              <p className="mb-2">By continuing to use the Application, you acknowledge that:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Sensitive health topics may be discussed.</li>
                <li>You may discontinue use at any time without consequence.</li>
                <li>Emotional discomfort may occur when reviewing personal health information.</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-xs">
                <span className="font-semibold">⚠ Eligibility and Emergency Notice:</span> Users must be within reproductive age. The Application is not intended for emergency use. If you are experiencing a medical emergency, contact your local emergency services immediately.
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">3. Data Collection and Privacy</h3>
              <p className="mb-2">The Application may collect: Self-reported health information.</p>
              <p className="mb-2">All data collection shall follow applicable data protection laws.</p>
              <p>Users understand that no system is completely secure. While reasonable safeguards are implemented, absolute security cannot be guaranteed.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">4. Limitation of Liability</h3>
              <p className="mb-2">To the fullest extent permitted by law:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The developers, researchers, academic institutions, and affiliated parties shall not be liable for any direct, indirect, incidental, or consequential damages resulting from use of the Application.</li>
                <li>Users assume full responsibility for how they interpret and act upon any information provided.</li>
                <li>The Application is provided "as is" without warranties of any kind.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">5. Research and Prototype Disclaimer</h3>
              <p className="mb-2">This system is a prototype developed as part of a research initiative. As such:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The machine learning model may evolve.</li>
                <li>Accuracy levels may vary.</li>
                <li>The system may be modified, suspended, or discontinued without prior notice.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">6. Intellectual Property</h3>
              <p>
                All content, algorithms, interface design, and documentation are the intellectual property of the developers unless otherwise stated. Unauthorized copying, distribution, or commercial use is prohibited.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">7. Modifications to Terms</h3>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Continued use of the Application after changes constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">8. User Agreement and Acceptance</h3>
              <p>
                By clicking "I Agree," at the end of these Terms and Conditions, you acknowledge that you have read, understood, and agreed to be legally bound by all the provisions stated above. If you do not agree, you must not access or use this Application.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            {viewOnly ? (
              <Button
                variant="default"
                onClick={onClose}
                iconName="X"
                iconPosition="left"
                className="px-10"
              >
                Close
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={onAccept}
                iconName="Check"
                iconPosition="left"
                className="px-10"
              >
                I Agree
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
