import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { cn } from '../../utils/cn';
import Footer from '../../components/ui/Footer';

const QuizPage = () => {
  const location = useLocation();
  const quizType = location?.state?.quizType || 'general';
  const [currentSection, setCurrentSection] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);

  // NEW: submission & result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [tabularResult, setTabularResult] = useState(null);
  const [imageResult, setImageResult] = useState(null);

  // Sample quiz sections with PCOS-related questions
  const quizSections = [
    {
      id: 1,
      title: 'Personal Information',
      questions: [
        {
          id: 'q1',
          type: 'textarea',
          question: 'How do you describe yourself?',
          placeholder: 'I am a...'
        },
        {
          id: 'q2',
          type: 'radio',
          question: 'What is your age group?',
          options: [
            { value: 'under-18', label: 'Under 18' },
            { value: '18-25', label: '18-25' },
            { value: '26-35', label: '26-35' },
            { value: '36-45', label: '36-45' },
            { value: 'over-45', label: 'Over 45' }
          ]
        },
        {
          id: 'q3',
          type: 'radio',
          question: 'Who are you taking this quiz for?',
          options: [
            { value: 'myself', label: 'I am a teenager' },
            { value: 'child', label: 'I am taking the quiz for my child' },
            { value: 'other', label: 'Other' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Symptoms & Health',
      questions: [
        {
          id: 'q4',
          type: 'checkbox',
          question: 'Which of the following symptoms do you experience?',
          options: [
            { value: 'irregular-periods', label: 'Irregular or absent periods' },
            { value: 'excess-hair', label: 'Excess facial or body hair' },
            { value: 'acne', label: 'Acne or oily skin' },
            { value: 'weight-gain', label: 'Weight gain or difficulty losing weight' },
            { value: 'hair-loss', label: 'Thinning hair on scalp' },
            { value: 'none', label: 'None of the above' }
          ]
        },
        {
          id: 'q5',
          type: 'radio',
          question: 'Have you been diagnosed with PCOS?',
          options: [
            { value: 'yes', label: 'Yes, I have been diagnosed' },
            { value: 'no', label: 'No, but I suspect I have it' },
            { value: 'unsure', label: 'I am not sure' }
          ]
        },
        {
          id: 'q6',
          type: 'textarea',
          question: 'Please describe any additional symptoms or concerns:',
          placeholder: 'Share any other symptoms or health concerns...'
        }
      ]
    }
  ];

  // Add image upload section for Professional Quiz
  if (quizType === 'professional') {
    const imageUploadSection = {
      id: 3,
      title: 'Medical Imaging (Optional)',
      questions: [
        {
          id: 'q7',
          type: 'image-upload',
          question: 'Upload Ultrasound Images (Optional)',
          description: 'You can upload ultrasound images for more detailed analysis. This step is completely optional and can be skipped.'
        }
      ]
    };
    
    if (quizSections?.length === 2) {
      quizSections?.push(imageUploadSection);
    }
  }

  const totalQuestions = quizSections?.reduce((sum, section) => sum + section?.questions?.length, 0);
  const currentQuestionGlobal = quizSections?.slice(0, currentSection)?.reduce((sum, section) => sum + section?.questions?.length, 0) + currentQuestion + 1;
  const progressPercentage = (currentQuestionGlobal / totalQuestions) * 100;

  const currentSectionData = quizSections?.[currentSection];
  const currentQuestionData = currentSectionData?.questions?.[currentQuestion];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e?.target?.files || []);
    const imageUrls = files?.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file?.name
    }));
    setUploadedImages(prev => [...prev, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages?.[index]?.preview);
      newImages?.splice(index, 1);
      return newImages;
    });
  };

  const handleNext = () => {
    if (isSubmitting) return; // prevent navigation while submitting
    if (currentQuestion < currentSectionData?.questions?.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < quizSections?.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      // Last question: submit the quiz for prediction
      handleCompleteAndSubmit();
    }
  };

  const handlePrevious = () => {
    if (isSubmitting) return; // prevent navigation while submitting
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setCurrentQuestion(quizSections?.[currentSection - 1]?.questions?.length - 1);
    }
  };

  const isFirstQuestion = currentSection === 0 && currentQuestion === 0;
  const isLastQuestion = 
    currentSection === quizSections?.length - 1 && 
    currentQuestion === currentSectionData?.questions?.length - 1;

  // -------------------------
  // Network helpers
  // -------------------------

  /**
   * Simple helper: POST JSON with retry on network errors (not on 4xx).
   * Exponential backoff: 0.5s then 1s (max 2 retries).
   */
  const postJsonWithRetries = async (url, bodyObj) => {
    const body = JSON.stringify(bodyObj);
    const maxAttempts = 3; // initial + 2 retries
    let attempt = 0;
    let waitMs = 500;

    while (attempt < maxAttempts) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        });

        // If client error (4xx) - do not retry
        if (res.status >= 400 && res.status < 500) {
          const text = await res.text().catch(() => null);
          throw new Error(text || `Client error ${res.status}`);
        }

        // parse JSON (may fail)
        const data = await res.json().catch(() => {
          throw new Error('Invalid JSON response from server');
        });

        if (!res.ok) {
          // Server error (5xx) - allow retries
          throw new Error(data?.detail || `Server Error: ${res.status}`);
        }

        return data;
      } catch (err) {
        attempt++;
        const isNetworkError = err.name === 'TypeError' || /network/i.test(String(err.message));
        const isClientError = /Client error|400|401|403|404/.test(String(err.message));
        if (attempt >= maxAttempts || isClientError) {
          // give up
          throw err;
        }
        // wait then retry
        await new Promise(r => setTimeout(r, waitMs));
        waitMs *= 2;
      }
    }
  };

  /**
   * POST FormData (files) with the same retry logic.
   */
  const postFormWithRetries = async (url, formData) => {
    const maxAttempts = 3;
    let attempt = 0;
    let waitMs = 500;

    while (attempt < maxAttempts) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          body: formData
        });

        if (res.status >= 400 && res.status < 500) {
          const text = await res.text().catch(() => null);
          throw new Error(text || `Client error ${res.status}`);
        }

        const data = await res.json().catch(() => {
          throw new Error('Invalid JSON response from server');
        });

        if (!res.ok) {
          throw new Error(data?.detail || `Server Error: ${res.status}`);
        }

        return data;
      } catch (err) {
        attempt++;
        const isClientError = /Client error|400|401|403|404/.test(String(err.message));
        if (attempt >= maxAttempts || isClientError) {
          throw err;
        }
        await new Promise(r => setTimeout(r, waitMs));
        waitMs *= 2;
      }
    }
  };

  // -------------------------
  // Submission orchestration
  // -------------------------

  const handleCompleteAndSubmit = async () => {
    // Reset previous results/errors
    setSubmitError(null);
    setTabularResult(null);
    setImageResult(null);

    // Basic client-side validation: answers must not be empty
    if (!answers || Object.keys(answers).length === 0) {
      setSubmitError('Please answer at least one question before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1) If professional and image(s) exist, upload the most recent image first
      let imageResp = null;
      if (quizType === 'professional' && uploadedImages?.length > 0) {
        const last = uploadedImages[uploadedImages.length - 1];
        if (last && last.file) {
          const fd = new FormData();
          fd.append('image', last.file);
          // Optionally append metadata (patient id etc.) if needed:
          // fd.append('meta', JSON.stringify({ quizId: '...' }));

          // Show minimal progress indicator by setting isSubmitting (already true)
          imageResp = await postFormWithRetries('http://127.0.0.1:8000/predict-image', fd);
          setImageResult(imageResp?.result || imageResp);
        }
      }

      // 2) Post tabular answers (send as-is)
      // Note: backend expects the quiz answers keys as it receives them in your current design
      const tabResp = await postJsonWithRetries('http://127.0.0.1:8000/predict-pcos', answers);
      setTabularResult(tabResp?.result || tabResp);

      // Completed successfully
      setSubmitError(null);
    } catch (err) {
      // Surface friendly errors
      console.error('Submission error', err);
      setSubmitError(String(err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------
  // Small UI helper renderers
  // -------------------------
  const RiskBadge = ({ probability }) => {
    const isHigh = typeof probability === 'number' && probability >= 0.5;
    return (
      <span className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
        isHigh ? 'bg-destructive text-destructive-foreground' : 'bg-success/10 text-success'
      )}>
        {isHigh ? 'High Risk' : 'Low Risk'}
      </span>
    );
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <>
      <Helmet>
        <title>PCOS Assessment Quiz - PCOS Care App</title>
        <meta name="description" content="Take our comprehensive PCOS assessment quiz to understand your symptoms and get personalized recommendations." />
      </Helmet>
      <Sidebar isOpen={isSidebarOpen} />
      <HamburgerButton 
        isOpen={isSidebarOpen} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <BackButton isSidebarOpen={isSidebarOpen} />
      <main className="min-h-screen bg-background smooth-scroll ml-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
          {/* Header */}
          <header className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Icon name="Sparkles" size={16} />
              <span>{quizType === 'professional' ? 'Professional Quiz' : 'General Quiz'}</span>
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">
              {currentSectionData?.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Question {currentQuestionGlobal} of {totalQuestions}
            </p>
          </header>

          {/* Progress Bar */}
          <div className="mb-8 md:mb-12">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-default"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="card-base mb-8">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-6 text-center">
              {currentQuestionData?.question}
            </h2>

            {currentQuestionData?.description && (
              <p className="text-muted-foreground text-center mb-6">
                {currentQuestionData?.description}
              </p>
            )}

            {/* Answer Input */}
            <div className="space-y-4">
              {currentQuestionData?.type === 'textarea' && (
                <textarea
                  value={answers?.[currentQuestionData?.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestionData?.id, e?.target?.value)}
                  placeholder={currentQuestionData?.placeholder}
                  className="w-full min-h-[200px] px-4 py-3 rounded-xl border-2 border-primary/20 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-default resize-none"
                  disabled={isSubmitting}
                />
              )}

              {currentQuestionData?.type === 'radio' && (
                <div className="space-y-3">
                  {currentQuestionData?.options?.map((option) => (
                    <label
                      key={option?.value}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-default',
                        answers?.[currentQuestionData?.id] === option?.value
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-primary/5'
                      )}
                    >
                      <input
                        type="radio"
                        name={currentQuestionData?.id}
                        value={option?.value}
                        checked={answers?.[currentQuestionData?.id] === option?.value}
                        onChange={(e) => handleAnswer(currentQuestionData?.id, e?.target?.value)}
                        className="w-5 h-5 text-primary focus:ring-primary"
                        disabled={isSubmitting}
                      />
                      <span className="text-foreground font-medium">{option?.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestionData?.type === 'checkbox' && (
                <div className="space-y-3">
                  {currentQuestionData?.options?.map((option) => {
                    const selectedValues = answers?.[currentQuestionData?.id] || [];
                    const isChecked = selectedValues?.includes(option?.value);

                    return (
                      <label
                        key={option?.value}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-default',
                          isChecked
                            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-primary/5'
                        )}
                      >
                        <input
                          type="checkbox"
                          value={option?.value}
                          checked={isChecked}
                          onChange={(e) => {
                            const newValues = e?.target?.checked
                              ? [...selectedValues, option?.value]
                              : selectedValues?.filter(v => v !== option?.value);
                            handleAnswer(currentQuestionData?.id, newValues);
                          }}
                          className="w-5 h-5 text-primary focus:ring-primary rounded"
                          disabled={isSubmitting}
                        />
                        <span className="text-foreground font-medium">{option?.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestionData?.type === 'image-upload' && (
                <div className="space-y-6">
                  {/* Upload Button */}
                  <div className="flex justify-center">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-default">
                        <Icon name="Upload" size={20} color="var(--color-primary)" />
                        <span className="text-foreground font-medium">Choose Images</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>

                  {/* Image Previews */}
                  {uploadedImages?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages?.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image?.preview}
                            alt={`Ultrasound ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-border"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-default"
                            disabled={isSubmitting}
                          >
                            <Icon name="X" size={16} />
                          </button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{image?.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skip Notice */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <Icon name="Info" size={20} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      This section is optional. You can skip it and continue with the quiz, or upload ultrasound images for more detailed analysis.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Panel (shows after successful submit) */}
          {(tabularResult || imageResult) && (
            <div className="card-base mb-6 p-6 bg-white border">
              <h3 className="font-heading font-semibold text-lg mb-3">Prediction Results</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageResult && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Image Prediction</div>
                      <RiskBadge probability={Number(imageResult?.probability)} />
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">Probability: {typeof imageResult?.probability === 'number' ? imageResult?.probability_display || String(imageResult?.probability) : 'N/A'}</div>
                    <div className="text-sm">Label: {typeof imageResult?.predicted_label !== 'undefined' ? imageResult?.predicted_label : 'N/A'}</div>
                  </div>
                )}

                {tabularResult && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Quiz Prediction</div>
                      <RiskBadge probability={Number(tabularResult?.probability)} />
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">Probability: {typeof tabularResult?.probability === 'number' ? tabularResult?.probability_display || String(tabularResult?.probability) : 'N/A'}</div>
                    <div className="text-sm">Label: {typeof tabularResult?.predicted_label !== 'undefined' ? tabularResult?.predicted_label : 'N/A'}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Error */}
          {submitError && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive-foreground">
              <div className="flex items-start justify-between gap-4">
                <div>{submitError}</div>
                <div>
                  <Button size="sm" variant="outline" onClick={handleCompleteAndSubmit} disabled={isSubmitting}>Retry</Button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={isFirstQuestion || isSubmitting}
              iconName="ArrowLeft"
              iconPosition="left"
              className="flex-1 max-w-xs"
            >
              Previous
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <span className="font-medium text-primary">{currentQuestionGlobal}</span> / {totalQuestions}
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              iconName={isLastQuestion ? 'Check' : 'ArrowRight'}
              iconPosition="right"
              className="flex-1 max-w-xs"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isLastQuestion ? 'Submitting...' : 'Submitting...') : (isLastQuestion ? 'Complete' : 'Next')}
            </Button>
          </div>

          {/* Section Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {quizSections?.map((section, index) => (
              <div
                key={section?.id}
                className={cn(
                  'h-2 rounded-full transition-default',
                  index === currentSection ? 'w-8 bg-primary' : 'w-2 bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default QuizPage;
