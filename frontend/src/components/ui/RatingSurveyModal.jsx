import React, { useState } from 'react';
import Icon from '../AppIcon';

const questions = [
  { id: 1, label: 'How would you rate the overall usefulness of this application?' },
  { id: 2, label: 'How easy was it to navigate through the app?' },
  { id: 3, label: 'How helpful was the PCOS risk assessment tool?' },
  { id: 4, label: 'How satisfied are you with the educational content provided?' },
  { id: 5, label: 'How likely are you to recommend this app to others?' }
];

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5]?.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${star} out of 5`}
        >
          <Icon
            name="Star"
            size={28}
            color={(hovered || value) >= star ? '#f59e0b' : '#d1d5db'}
            fill={(hovered || value) >= star ? '#f59e0b' : 'none'}
          />
        </button>
      ))}
    </div>
  );
};

const RatingSurveyModal = ({ isOpen, onClose }) => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleRating = (questionId, value) => {
    setRatings((prev) => ({ ...prev, [questionId]: value }));
  };

  const allRated = questions?.every((q) => ratings?.[q?.id]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!allRated) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setRatings({});
    setComments('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="Star" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground">Rating Survey</h2>
              <p className="text-xs text-muted-foreground">Help us improve CystSense</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={36} color="#16a34a" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your feedback has been recorded. We appreciate your time in helping us improve the CystSense application.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Please rate your experience with the CystSense application. Your feedback helps us improve the quality of our service.
              </p>

              {questions?.map((q) => (
                <div key={q?.id} className="space-y-2">
                  <p className="text-sm font-medium text-foreground">{q?.label}</p>
                  <StarRating
                    value={ratings?.[q?.id] || 0}
                    onChange={(val) => handleRating(q?.id, val)}
                  />
                  {ratings?.[q?.id] && (
                    <p className="text-xs text-muted-foreground">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']?.[ratings?.[q?.id]]}
                    </p>
                  )}
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Additional Comments <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e?.target?.value)}
                  placeholder="Share any additional thoughts or suggestions..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!allRated}
                className={`
                  w-full py-3 rounded-xl font-semibold text-sm transition-all
                  ${allRated
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'}
                `}
              >
                {allRated ? 'Submit Survey' : 'Please rate all questions to submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingSurveyModal;
