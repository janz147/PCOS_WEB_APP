/*
 * PCOS Quiz - Clinical Data Collection
 * 
 * REQUIRED FIELDS: Age (yrs)
 * OPTIONAL FIELDS: All other fields
 * AUTO-CALCULATED: BMI (from Weight & Height), Waist:Hip Ratio (from Waist & Hip)
 * 
 * Model expects these exact keys:
 * ["Age (yrs)","Weight (Kg)","Height(Cm)","BMI","Cycle(R/I)","Cycle length(days)",
 *  "Marraige Status (Yrs)","Pregnant(Y/N)","No. of aborptions","I   beta-HCG(mIU/mL)",
 *  "FSH(mIU/mL)","LH(mIU/mL)","FSH/LH","Hip(inch)","Waist(inch)","Waist:Hip Ratio",
 *  "TSH (mIU/L)","PRL(ng/mL)","Vit D3 (ng/mL)","PRG(ng/mL)","RBS(mg/dl)",
 *  "Weight gain(Y/N)","hair growth(Y/N)","Skin darkening (Y/N)","Hair loss(Y/N)",
 *  "Pimples(Y/N)","Fast food (Y/N)","Reg.Exercise(Y/N)"]
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { cn } from '../../utils/cn';
import { predictTabular, predictImage } from '../../hooks/usePrediction';

// Map UI answers to model-ready JSON
const mapAnswersToModel = (answers) => {
  // Helper to convert Y/N toggle values
  const toYN = (val) => val === true || val === 'Y' ? 'Y' : 'N';
  
  // Helper to parse numeric or return null
  const toNum = (val) => {
    if (val === '' || val === null || val === undefined) return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  // Check if important fields are missing
  const age = toNum(answers?.['Age (yrs)']);
  const importantFieldsMissing = !age;

  // Build model payload with exact keys
  const payload = {
    "Age (yrs)": age, // REQUIRED - maps to age input
    "Weight (Kg)": toNum(answers?.['Weight (Kg)']), // maps to weight input
    "Height(Cm)":toNum(answers?.['Height(Cm)']), // maps to height input
    "BMI":toNum(answers?.['BMI']), // auto-calculated or manual override
    "Cycle(R/I)":toNum(answers?.['Cycle(R/I)']), // 0=Regular, 1=Irregular
    "Cycle length(days)":toNum(answers?.['Cycle length(days)']),
    "Marraige Status (Yrs)":toNum(answers?.['Marraige Status (Yrs)']),
    "Pregnant(Y/N)":toYN(answers?.['Pregnant(Y/N)']),
    "No. of aborptions":toNum(answers?.['No. of aborptions']),
    "I   beta-HCG(mIU/mL)":toNum(answers?.['I   beta-HCG(mIU/mL)']),
    "FSH(mIU/mL)":toNum(answers?.['FSH(mIU/mL)']),
    "LH(mIU/mL)":toNum(answers?.['LH(mIU/mL)']),
    "FSH/LH":toNum(answers?.['FSH/LH']),
    "Hip(inch)":toNum(answers?.['Hip(inch)']),
    "Waist(inch)":toNum(answers?.['Waist(inch)']),
    "Waist:Hip Ratio":toNum(answers?.['Waist:Hip Ratio']),
    "TSH (mIU/L)":toNum(answers?.['TSH (mIU/L)']),
    "PRL(ng/mL)":toNum(answers?.['PRL(ng/mL)']),
    "Vit D3 (ng/mL)":toNum(answers?.['Vit D3 (ng/mL)']),
    "PRG(ng/mL)":toNum(answers?.['PRG(ng/mL)']),
    "RBS(mg/dl)":toNum(answers?.['RBS(mg/dl)']),
    "Weight gain(Y/N)":toYN(answers?.['Weight gain(Y/N)']),
    "hair growth(Y/N)":toYN(answers?.['hair growth(Y/N)']),
    "Skin darkening (Y/N)":toYN(answers?.['Skin darkening (Y/N)']),
    "Hair loss(Y/N)":toYN(answers?.['Hair loss(Y/N)']),
    "Pimples(Y/N)":toYN(answers?.['Pimples(Y/N)']),
    "Fast food (Y/N)":toYN(answers?.['Fast food (Y/N)']),
    "Reg.Exercise(Y/N)":toYN(answers?.['Reg.Exercise(Y/N)']),
    partial_input: importantFieldsMissing
  };

  return payload;
};

const QuizPage = () => {
  const location = useLocation();
  const quizType = location?.state?.quizType || 'general';
  const [currentSection, setCurrentSection] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showPartialWarning, setShowPartialWarning] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Auto-calculate BMI when weight and height change
  useEffect(() => {
    const weight = parseFloat(answers?.['Weight (Kg)']);
    const height = parseFloat(answers?.['Height(Cm)']);
    
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      setAnswers(prev => ({
        ...prev,
        'BMI': bmi?.toFixed(2)
      }));
    }
  }, [answers?.['Weight (Kg)'], answers?.['Height(Cm)']]);

  // Auto-calculate Waist:Hip Ratio
  useEffect(() => {
    const waist = parseFloat(answers?.['Waist(inch)']);
    const hip = parseFloat(answers?.['Hip(inch)']);
    
    if (waist > 0 && hip > 0) {
      const ratio = waist / hip;
      setAnswers(prev => ({
        ...prev,
        'Waist:Hip Ratio': ratio?.toFixed(3)
      }));
    }
  }, [answers?.['Waist(inch)'], answers?.['Hip(inch)']]);

  // Quiz sections - reorganized to group related inputs
  const quizSections = quizType === 'general' ? [
    {
      id: 1,
      title: '🌸 Period & Cycle Tracking',
      description: 'Tell us about your menstrual cycle and period symptoms',
      questions: [
        {
          id: 'Age (yrs)',
          type: 'number',
          label: 'How old are you?',
          placeholder: 'Enter your age',
          unit: 'years',
          min: 10,
          max: 80,
          step: 1,
          required: true,
          helpText: 'Age is required for accurate assessment (10–80 years)'
        },
        {
          id: 'last_period_date',
          type: 'date',
          label: 'When did your last period start?',
          required: false,
          helpText: 'The first day you noticed bleeding'
        },
        {
          id: 'Cycle(R/I)',
          type: 'radio',
          label: 'Are your periods usually:',
          options: [
            { value: '0', label: 'Regular (come around the same time each month)' },
            { value: '1', label: 'Irregular (hard to predict or often late/early)' }
          ],
          required: false
        },
        {
          id: 'Cycle length(days)',
          type: 'radio',
          label: 'How many days does your period usually last?',
          options: [
            { value: '1.5', label: '1–2 days' },
            { value: '3.5', label: '3–4 days' },
            { value: '6', label: '5–7 days' },
            { value: '8', label: 'More than 7 days' }
          ],
          required: false
        },
        {
          id: 'skipped_period',
          type: 'radio',
          label: 'Have you skipped a period in the last 6 months (not pregnant)?',
          options: [
            { value: 'no', label: 'No' },
            { value: 'once', label: 'Yes, once' },
            { value: 'more', label: 'Yes, more than once' }
          ],
          required: false
        },
        {
          id: 'period_symptoms',
          type: 'checkbox',
          label: 'Which of these do you notice around your period? (Select all that apply)',
          options: [
            { value: 'cramps', label: 'Cramps or pain' },
            { value: 'bloating', label: 'Bloating or PMS symptoms' },
            { value: 'mood_changes', label: 'Mood changes (irritability, sadness, anxiety)' },
            { value: 'loose_stools', label: 'Loose stools or mild diarrhea' },
            { value: 'constipation', label: 'Constipation' },
            { value: 'fatigue', label: 'Low energy or fatigue' },
            { value: 'sleep_trouble', label: 'Trouble sleeping' },
            { value: 'none', label: 'None of these' }
          ],
          required: false
        }
      ]
    },
    {
      id: 2,
      title: '📏 Body Measurements',
      description: 'Help us understand your body measurements',
      questions: [
        {
          id: 'Weight (Kg)',
          type: 'number',
          label: 'Your weight',
          placeholder: 'Enter weight',
          unit: 'kg',
          min: 20,
          max: 300,
          step: 0.1,
          required: false,
          helpText: 'Weight in kilograms'
        },
        {
          id: 'Height(Cm)',
          type: 'number',
          label: 'Your height',
          placeholder: 'Enter height',
          unit: 'cm',
          min: 100,
          max: 250,
          step: 0.1,
          required: false,
          helpText: 'Height in centimeters'
        },
        {
          id: 'Waist(inch)',
          type: 'number',
          label: 'Waist size',
          placeholder: 'Enter waist measurement',
          unit: 'in',
          min: 15,
          max: 80,
          step: 0.1,
          required: false,
          helpText: 'Measure around your belly at belly-button level'
        },
        {
          id: 'Hip(inch)',
          type: 'number',
          label: 'Hip size',
          placeholder: 'Enter hip measurement',
          unit: 'in',
          min: 20,
          max: 80,
          step: 0.1,
          required: false,
          helpText: 'Measure around the widest part of your hips or buttocks'
        }
      ]
    },
    {
      id: 3,
      title: '⚡ Energy & Hunger Signals',
      description: 'Tell us about your energy levels and hunger patterns',
      questions: [
        {
          id: 'energy_hunger_signals',
          type: 'checkbox',
          label: 'Do you often experience any of the following? (Select all that apply)',
          options: [
            { value: 'tired_after_meals', label: 'Feeling very tired or sleepy after meals' },
            { value: 'sweet_cravings', label: 'Strong cravings for sweets or carbs' },
            { value: 'weight_gain_easy', label: 'Gaining weight easily' },
            { value: 'hungry_after_eating', label: 'Feeling hungry again shortly after eating' },
            { value: 'none', label: 'None of these' }
          ],
          required: false
        }
      ]
    },
    {
      id: 4,
      title: '💆‍♀️ Skin & Hair',
      description: 'Tell us about any skin or hair changes you\'ve noticed',
      questions: [
        {
          id: 'Pimples(Y/N)',
          type: 'toggle',
          label: 'Do you have ongoing acne (not just occasional breakouts)?',
          required: false,
          helpText: 'Persistent acne or oily skin'
        },
        {
          id: 'Hair loss(Y/N)',
          type: 'toggle',
          label: 'Have you noticed thinning hair on your scalp?',
          required: false,
          helpText: 'Thinning or shedding hair on the scalp'
        },
        {
          id: 'hair growth(Y/N)',
          type: 'toggle',
          label: 'Do you have more body or facial hair than you\'re comfortable with?',
          required: false,
          helpText: 'Excess hair growth in male-pattern areas (hirsutism)'
        }
      ]
    },
    {
      id: 5,
      title: '🧠 Daily Lifestyle',
      description: 'Tell us about your daily activity, sleep, and stress',
      questions: [
        {
          id: 'Reg.Exercise(Y/N)',
          type: 'radio',
          label: 'How active are you most days?',
          options: [
            { value: 'N', label: 'Mostly sitting or little movement' },
            { value: 'light', label: 'Light activity (walking, light exercise)' },
            { value: 'Y', label: 'Regular exercise or active lifestyle' }
          ],
          required: false
        },
        {
          id: 'sleep_hours',
          type: 'radio',
          label: 'How much do you usually sleep per night?',
          options: [
            { value: 'less5', label: 'Less than 5 hours' },
            { value: '5to6', label: '5–6 hours' },
            { value: '7to9', label: '7–9 hours' },
            { value: 'more9', label: 'More than 9 hours' }
          ],
          required: false
        },
        {
          id: 'stress_level',
          type: 'radio',
          label: 'How stressed do you feel most days?',
          options: [
            { value: 'low', label: 'Low' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'high', label: 'High' }
          ],
          required: false
        }
      ]
    },
    {
      id: 6,
      title: '🍽️ Eating Habits',
      description: 'Tell us about your typical eating patterns',
      questions: [
        {
          id: 'meal_pattern',
          type: 'radio',
          label: 'Which best describes how you eat most days?',
          options: [
            { value: '3meals', label: '3 regular meals a day' },
            { value: 'small_snacks', label: 'Small meals or snacks throughout the day' },
            { value: 'irregular', label: 'Meal times change a lot' }
          ],
          required: false
        },
        {
          id: 'Fast food (Y/N)',
          type: 'radio',
          label: 'How often do you eat or drink sugary foods (desserts, sweet drinks)?',
          options: [
            { value: 'N', label: 'Rarely' },
            { value: 'sometimes', label: 'Sometimes' },
            { value: 'Y', label: 'Often' }
          ],
          required: false
        }
      ]
    },
    {
      id: 7,
      title: '👨‍👩‍👧 Family Health',
      description: 'Tell us about your family health history',
      questions: [
        {
          id: 'family_diabetes',
          type: 'toggle',
          label: 'Does anyone in your family have diabetes?',
          required: false,
          helpText: 'Includes parents, siblings, or grandparents'
        },
        {
          id: 'family_pcos',
          type: 'toggle',
          label: 'Does anyone in your family have PCOS?',
          required: false,
          helpText: 'Includes mother, sisters, or other female relatives'
        }
      ]
    }
  ] : [
    {
      id: 1,
      title: 'Personal Details',
      description: 'Basic information and body measurements',
      questions: [
        {
          id: 'Age (yrs)',
          type: 'number',
          label: 'Age',
          placeholder: 'Enter age in years',
          unit: 'years',
          min: 10,
          max: 80,
          step: 1,
          required: true,
          helpText: 'Age is required for accurate assessment (10-80 years)'
        },
        {
          id: 'Weight (Kg)',
          type: 'number',
          label: 'Weight',
          placeholder: 'Enter weight',
          unit: 'Kg',
          min: 20,
          max: 300,
          step: 0.1,
          required: false,
          helpText: 'Weight in kilograms'
        },
        {
          id: 'Height(Cm)',
          type: 'number',
          label: 'Height',
          placeholder: 'Enter height',
          unit: 'cm',
          min: 100,
          max: 250,
          step: 0.1,
          required: false,
          helpText: 'Height in centimeters'
        },
        {
          id: 'BMI',
          type: 'number',
          label: 'Body Mass Index (BMI)',
          placeholder: 'Auto-calculated',
          unit: 'kg/m²',
          step: 0.01,
          required: false,
          helpText: 'BMI auto-calculated from weight & height. You can override if needed.',
          autoCalculated: true
        }
      ]
    },
    {
      id: 2,
      title: 'Optional Measurements',
      description: 'Additional measurements (all optional)',
      questions: [
        {
          id: 'Marraige Status (Yrs)',
          type: 'number',
          label: 'Marriage Status',
          placeholder: 'Years married (optional)',
          unit: 'years',
          min: 0,
          step: 1,
          required: false,
          helpText: 'Leave blank if not applicable'
        },
        {
          id: 'Hip(inch)',
          type: 'number',
          label: 'Hip Measurement',
          placeholder: 'Enter hip measurement',
          unit: 'inches',
          min: 20,
          max: 80,
          step: 0.1,
          required: false,
          helpText: 'Hip circumference in inches'
        },
        {
          id: 'Waist(inch)',
          type: 'number',
          label: 'Waist Measurement',
          placeholder: 'Enter waist measurement',
          unit: 'inches',
          min: 15,
          max: 80,
          step: 0.1,
          required: false,
          helpText: 'Waist circumference in inches'
        },
        {
          id: 'Waist:Hip Ratio',
          type: 'number',
          label: 'Waist to Hip Ratio',
          placeholder: 'Auto-calculated',
          step: 0.001,
          required: false,
          helpText: 'Auto-calculated from waist & hip. You can override if needed.',
          autoCalculated: true
        }
      ]
    },
    {
      id: 3,
      title: 'Reproductive & Labs',
      description: 'Menstrual cycle, pregnancy history, and lab values (all optional)',
      questions: [
        {
          id: 'Cycle(R/I)',
          type: 'select',
          label: 'Menstrual Cycle',
          options: [
            { value: '0', label: 'Regular' },
            { value: '1', label: 'Irregular' }
          ],
          required: false,
          helpText: 'Regular = predictable cycle length; Irregular = unpredictable'
        },
        {
          id: 'Cycle length(days)',
          type: 'number',
          label: 'Cycle Length',
          placeholder: 'Average cycle length',
          unit: 'days',
          min: 15,
          max: 60,
          step: 1,
          required: false,
          helpText: 'Typical range: 21-35 days'
        },
        {
          id: 'No. of aborptions',
          type: 'number',
          label: 'Number of Miscarriages',
          placeholder: 'Enter number',
          min: 0,
          step: 1,
          required: false,
          helpText: 'Leave blank if not applicable'
        },
        {
          id: 'Pregnant(Y/N)',
          type: 'toggle',
          label: 'Currently Pregnant',
          required: false,
          helpText: 'Select Yes or No'
        }
      ]
    },
    {
      id: 5,
      title: 'Symptoms & Lifestyle',
      description: 'Common PCOS symptoms and lifestyle factors',
      questions: [
        {
          id: 'Weight gain(Y/N)',
          type: 'toggle',
          label: 'Weight Gain',
          required: false,
          helpText: 'Unexplained or difficult-to-control weight gain'
        },
        {
          id: 'hair growth(Y/N)',
          type: 'toggle',
          label: 'Excess Hair Growth',
          required: false,
          helpText: 'Hirsutism - excess hair growth in male-pattern areas'
        },
        {
          id: 'Skin darkening (Y/N)',
          type: 'toggle',
          label: 'Skin Darkening',
          required: false,
          helpText: 'Dark patches in skin folds (acanthosis nigricans)'
        },
        {
          id: 'Hair loss(Y/N)',
          type: 'toggle',
          label: 'Hair Loss',
          required: false,
          helpText: 'Thinning hair on scalp'
        },
        {
          id: 'Pimples(Y/N)',
          type: 'toggle',
          label: 'Acne',
          required: false,
          helpText: 'Persistent acne or oily skin'
        },
        {
          id: 'Fast food (Y/N)',
          type: 'toggle',
          label: 'Fast Food Consumption',
          required: false,
          helpText: 'Frequent consumption of processed or fast food'
        },
        {
          id: 'Reg.Exercise(Y/N)',
          type: 'toggle',
          label: 'Regular Exercise',
          required: false,
          helpText: 'Regular physical activity (3+ times per week)'
        }
      ]
    }
  ];

  // Add hormones section ONLY for professional quiz
  if (quizType === 'professional') {
    const hormonesSection = {
      id: 4,
      title: 'Hormones & Lab Values',
      description: 'Hormone levels and laboratory test results (all optional)',
      questions: [
        {
          id: 'I   beta-HCG(mIU/mL)',
          type: 'number',
          label: 'Beta-HCG Level',
          placeholder: 'Enter value',
          unit: 'mIU/mL',
          min: 0,
          step: 0.1,
          required: false,
          helpText: 'Pregnancy hormone level'
        },
        {
          id: 'FSH(mIU/mL)',
          type: 'number',
          label: 'FSH Level',
          placeholder: 'Enter value',
          unit: 'mIU/mL',
          min: 0,
          step: 0.1,
          required: false,
          helpText: 'Follicle Stimulating Hormone - typical range: 3-20 mIU/mL'
        },
        {
          id: 'LH(mIU/mL)',
          type: 'number',
          label: 'LH Level',
          placeholder: 'Enter value',
          unit: 'mIU/mL',
          min: 0,
          step: 0.1,
          required: false,
          helpText: 'Luteinizing Hormone - typical range: 2-15 mIU/mL'
        },
        {
          id: 'FSH/LH',
          type: 'number',
          label: 'FSH/LH Ratio',
          placeholder: 'Enter ratio',
          min: 0,
          step: 0.01,
          required: false,
          helpText: 'Ratio of FSH to LH'
        },
        {
          id: 'PRG(ng/mL)',
          type: 'number',
          label: 'Progesterone Level',
          placeholder: 'Enter value',
          unit: 'ng/mL',
          min: 0,
          step: 0.1,
          required: false,
          helpText: 'Varies by cycle phase'
        },
        {
          id: 'TSH (mIU/L)',
          type: 'number',
          label: 'TSH Level',
          placeholder: 'Enter value',
          unit: 'mIU/L',
          min: 0,
          step: 0.01,
          required: false,
          helpText: 'Thyroid Stimulating Hormone - normal: 0.4-4.0 mIU/L'
        },
        {
          id: 'PRL(ng/mL)',
          type: 'number',
          label: 'Prolactin Level',
          placeholder: 'Enter value',
          unit: 'ng/mL',
          min: 0,
          step: 0.1,
          required: false,
          helpText: 'Normal range: 4-25 ng/mL'
        },
        {
          id: 'Vit D3 (ng/mL)',
          type: 'number',
          label: 'Vitamin D3 Level',
          placeholder: 'Enter value',
          unit: 'ng/mL',
          min: 0,
          step: 0.1,
          required: false,
          helpText: 'Optimal range: 30-50 ng/mL'
        },
        {
          id: 'RBS(mg/dl)',
          type: 'number',
          label: 'Random Blood Sugar',
          placeholder: 'Enter value',
          unit: 'mg/dL',
          min: 0,
          step: 1,
          required: false,
          helpText: 'Normal range: 70-140 mg/dL'
        }
      ]
    };
    
    // Insert hormones section at position 3 (after Reproductive & Labs, before Symptoms)
    quizSections?.splice(3, 0, hormonesSection);
  }

  // Add image upload section for Professional Quiz
  if (quizType === 'professional') {
    const imageUploadSection = {
      id: 6,
      title: 'Optional Imaging',
      description: 'Upload ultrasound images for additional analysis (completely optional)',
      questions: [
        {
          id: 'image-upload',
          type: 'image-upload',
          label: 'Ultrasound Images',
          description: 'You can upload ultrasound images for more detailed analysis. This step is completely optional and can be skipped.'
        }
      ]
    };
    
    quizSections?.push(imageUploadSection);
  }

  const currentSectionData = quizSections?.[currentSection];
  const progressPercentage = ((currentSection + 1) / quizSections?.length) * 100;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors?.[questionId];
      return newErrors;
    });
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

  // Validate all required fields in current section
  const validateCurrentSection = () => {
    const errors = {};
    currentSectionData?.questions?.forEach(question => {
      if (question?.required) {
        const value = answers?.[question?.id];
        if (value === undefined || value === null || value === '') {
          errors[question?.id] = 'This field is required';
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  // Submission orchestration
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setResults(null);

    try {
      let imageResult = null;

      // Step 1: Upload image if professional quiz and images exist
      if (quizType === 'professional' && uploadedImages?.length > 0) {
        const mostRecentImage = uploadedImages?.[uploadedImages?.length - 1];
        
        console.log('Uploading image to /predict-image...');
        const imgResponse = await predictImage(mostRecentImage?.file);

        if (imgResponse?.ok) {
          imageResult = imgResponse?.result;
          console.log('Image prediction result:', imageResult);
        } else {
          // Image failed but continue with tabular
          console.warn('Image prediction failed:', imgResponse?.error);
        }
      }

      // Step 2: Submit tabular data
      const modelPayload = mapAnswersToModel(answers);
      console.log('Submitting tabular data to /predict-pcos:', modelPayload);

      const tabularResponse = await predictTabular(modelPayload);

      if (!tabularResponse?.ok) {
        throw new Error(tabularResponse?.error || 'Prediction failed');
      }

      const tabularResult = tabularResponse?.result;
      console.log('Tabular prediction result:', tabularResult);

      // Step 3: Display results (even if image failed, show tabular result)
      setResults({
        tabular: tabularResult,
        image: imageResult
      });
      setShowResultModal(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err?.message || 'An unexpected error occurred');
      setShowResultModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setResults(null);
    setError(null);
    setShowResultModal(false);
    setCurrentSection(0);
    setAnswers({});
    setUploadedImages([]);
    setValidationErrors({});
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
  };

  const handleNext = () => {
    // Validate current section
    if (!validateCurrentSection()) {
      return;
    }

    // Check if we're on the last section
    const isLastSection = currentSection === quizSections?.length - 1;
    
    if (isLastSection) {
      const modelPayload = mapAnswersToModel(answers);
      if (modelPayload?.partial_input && !showPartialWarning) {
        setShowPartialWarning(true);
        return; // Don't submit yet, show warning first
      }
      // If warning already shown or no partial input, proceed with submission
      handleSubmit();
      return;
    }

    // Navigate to next section
    setCurrentSection(prev => prev + 1);
    setShowPartialWarning(false);
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
    setShowPartialWarning(false); // Reset warning when navigating back
  };

  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === quizSections?.length - 1;

  // Render individual question input
  const renderQuestionInput = (question) => {
    const value = answers?.[question?.id];
    const error = validationErrors?.[question?.id];

    return (
      <div key={question?.id} className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {question?.label}
          {question?.required && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
        </label>
        
        {question?.helpText && (
          <p className="text-xs text-muted-foreground flex items-start gap-1">
            <Icon name="Info" size={12} className="flex-shrink-0 mt-0.5" />
            {question?.helpText}
          </p>
        )}

        {/* Number Input */}
        {question?.type === 'number' && (
          <div className="relative">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleAnswer(question?.id, e?.target?.value)}
              placeholder={question?.placeholder}
              min={question?.min}
              max={question?.max}
              step={question?.step}
              disabled={isSubmitting}
              aria-label={question?.label}
              aria-required={question?.required}
              aria-invalid={!!error}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-default",
                error ? "border-red-500" : "border-primary/20 focus:border-primary",
                question?.autoCalculated && "bg-muted/30"
              )}
            />
            {question?.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {question?.unit}
              </span>
            )}
          </div>
        )}

        {/* Date Input */}
        {question?.type === 'date' && (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleAnswer(question?.id, e?.target?.value)}
            disabled={isSubmitting}
            aria-label={question?.label}
            aria-required={question?.required}
            aria-invalid={!!error}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-default",
              error ? "border-red-500" : "border-primary/20 focus:border-primary"
            )}
          />
        )}

        {/* Radio Buttons */}
        {question?.type === 'radio' && (
          <div className="space-y-2">
            {question?.options?.map((option) => (
              <label
                key={option?.value}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-default",
                  value === option?.value
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="radio"
                  name={question?.id}
                  value={option?.value}
                  checked={value === option?.value}
                  onChange={() => handleAnswer(question?.id, option?.value)}
                  disabled={isSubmitting}
                  className="accent-primary w-4 h-4 flex-shrink-0"
                />
                <span className="text-sm">{option?.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Checkbox (multi-select) */}
        {question?.type === 'checkbox' && (
          <div className="space-y-2">
            {question?.options?.map((option) => {
              const selected = Array.isArray(value) ? value?.includes(option?.value) : false;
              return (
                <label
                  key={option?.value}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-default",
                    selected
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="checkbox"
                    value={option?.value}
                    checked={selected}
                    onChange={() => {
                      const current = Array.isArray(value) ? [...value] : [];
                      if (option?.value === 'none') {
                        handleAnswer(question?.id, selected ? [] : ['none']);
                      } else {
                        const withoutNone = current?.filter(v => v !== 'none');
                        if (selected) {
                          handleAnswer(question?.id, withoutNone?.filter(v => v !== option?.value));
                        } else {
                          handleAnswer(question?.id, [...withoutNone, option?.value]);
                        }
                      }
                    }}
                    disabled={isSubmitting}
                    className="accent-primary w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm">{option?.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* Select/Dropdown */}
        {question?.type === 'select' && (
          <select
            value={value || ''}
            onChange={(e) => handleAnswer(question?.id, e?.target?.value)}
            disabled={isSubmitting}
            aria-label={question?.label}
            aria-required={question?.required}
            aria-invalid={!!error}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-default",
              error ? "border-red-500" : "border-primary/20 focus:border-primary"
            )}
          >
            <option value="">Select an option...</option>
            {question?.options?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        )}

        {/* Toggle (Y/N) */}
        {question?.type === 'toggle' && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAnswer(question?.id, false)}
              disabled={isSubmitting}
              aria-label="No"
              aria-pressed={value === false}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-default text-sm",
                value === false
                  ? "border-primary bg-primary text-white" :"border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(question?.id, true)}
              disabled={isSubmitting}
              aria-label="Yes"
              aria-pressed={value === true}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-default text-sm",
                value === true
                  ? "border-primary bg-primary text-white" :"border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              Yes
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <Icon name="AlertCircle" size={12} />
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 page-transition">
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
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
                {currentSectionData?.description}
              </p>
            </header>

            {/* Progress Bar */}
            <div className="mb-8 md:mb-12">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Section {currentSection + 1} of {quizSections?.length}</span>
                <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-default"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Partial Input Warning Modal */}
            {showPartialWarning && isLastSection && (
              <div className="card-base mb-8 border-2 border-yellow-500 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={24} color="#eab308" />
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-xl text-foreground">Some Information Missing</h3>
                    <p className="text-sm text-muted-foreground mt-1">Some clinical inputs are missing. Results will be partial. Do you want to proceed?</p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPartialWarning(false)}
                      >
                        Edit Answers
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Proceed Anyway'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Result Modal */}
            {showResultModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 md:p-8">
                    {/* Modal Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          error ? "bg-red-100" : "bg-primary/10"
                        )}>
                          <Icon 
                            name={error ? "AlertCircle" : "CheckCircle"} 
                            size={24} 
                            color={error ? "#ef4444" : "var(--color-primary)"} 
                          />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-2xl text-foreground">
                            {error ? 'Submission Failed' : 'Assessment Complete'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {error ? 'An error occurred during submission' : 'Your results are ready'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-default"
                        aria-label="Close modal"
                      >
                        <Icon name="X" size={20} />
                      </button>
                    </div>

                    {/* Error Content */}
                    {error && (
                      <div className="mb-6">
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                          <p className="text-sm text-red-700 mb-1 font-medium">Error Details:</p>
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-muted/50">
                          <p className="text-xs text-muted-foreground">
                            <strong>Troubleshooting:</strong> Please check your internet connection and ensure the backend server is running. If the problem persists, try again later.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Results Content */}
                    {results && (
                      <div className="space-y-6 mb-6">
                        {/* Tabular Result */}
                        {results?.tabular && (
                          <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Icon name="Activity" size={20} />
                              Clinical Assessment
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Prediction:</span>
                                <span className="font-bold text-foreground text-lg">{results?.tabular?.predicted_label}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Probability:</span>
                                <span className="font-bold text-foreground text-lg">
                                  {results?.tabular?.probability_display || `${(results?.tabular?.probability * 100)?.toFixed(1)}%`}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Risk Level:</span>
                                <span className={cn(
                                  "px-4 py-1.5 rounded-full text-sm font-semibold",
                                  results?.tabular?.probability >= 0.5
                                    ? "bg-red-100 text-red-700" :"bg-green-100 text-green-700"
                                )}>
                                  {results?.tabular?.probability >= 0.5 ? 'High Risk' : 'Low Risk'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Image Result */}
                        {results?.image && (
                          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Icon name="Image" size={20} />
                              Ultrasound Analysis
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Prediction:</span>
                                <span className="font-bold text-foreground text-lg">{results?.image?.predicted_label}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Probability:</span>
                                <span className="font-bold text-foreground text-lg">
                                  {results?.image?.probability_display || `${(results?.image?.probability * 100)?.toFixed(1)}%`}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Risk Level:</span>
                                <span className={cn(
                                  "px-4 py-1.5 rounded-full text-sm font-semibold",
                                  results?.image?.probability >= 0.5
                                    ? "bg-red-100 text-red-700" :"bg-green-100 text-green-700"
                                )}>
                                  {results?.image?.probability >= 0.5 ? 'High Risk' : 'Low Risk'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Modal Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {error ? (
                        <>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleCloseModal}
                            className="flex-1"
                            iconName="X"
                            iconPosition="left"
                          >
                            Close
                          </Button>
                          <Button
                            variant="default"
                            size="lg"
                            onClick={() => {
                              setShowResultModal(false);
                              handleSubmit();
                            }}
                            disabled={isSubmitting}
                            className="flex-1"
                            iconName="RefreshCw"
                            iconPosition="left"
                          >
                            Retry Submission
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleCloseModal}
                            className="flex-1"
                            iconName="X"
                            iconPosition="left"
                          >
                            Close
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleRetakeQuiz}
                            className="flex-1"
                            iconName="RotateCcw"
                            iconPosition="left"
                          >
                            Retake Quiz
                          </Button>
                          <Button
                            variant="default"
                            size="lg"
                            onClick={() => window.location.href = '/pcos-care-dashboard'}
                            className="flex-1"
                            iconName="Home"
                            iconPosition="left"
                          >
                            Back to Dashboard
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Content */}
            {!showResultModal && (
              <div className="card-base mb-8">
                {/* Image Upload Section */}
                {currentSectionData?.questions?.[0]?.type === 'image-upload' ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
                        {currentSectionData?.questions?.[0]?.label}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentSectionData?.questions?.[0]?.description}
                      </p>
                    </div>

                    {/* Upload Button */}
                    <div className="flex justify-center">
                      <label className={cn("cursor-pointer", isSubmitting && "opacity-50 cursor-not-allowed")}>
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
                          aria-label="Upload ultrasound images"
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
                              aria-label={`Remove ${image?.name}`}
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
                ) : (
                  /* Regular Questions Grid */
                  (<div className={cn(
                    "grid gap-6",
                    currentSectionData?.questions?.some(q => q?.type === 'radio' || q?.type === 'checkbox' || q?.type === 'date')
                      ? "grid-cols-1" :"grid-cols-1 md:grid-cols-2"
                  )}>
                    {currentSectionData?.questions?.map(question => renderQuestionInput(question))}
                  </div>)
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {!results && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePrevious}
                    disabled={isFirstSection || isSubmitting}
                    iconName="ArrowLeft"
                    iconPosition="left"
                    className="flex-1 max-w-xs"
                  >
                    Previous
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <span className="font-medium text-primary">{currentSection + 1}</span> / {quizSections?.length}
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleNext}
                    iconName={isLastSection ? 'Check' : 'ArrowRight'}
                    iconPosition="right"
                    className="flex-1 max-w-xs"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : (isLastSection ? 'Complete' : 'Next')}
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
              </>
            )}
          </div>
        </main>
      </>
    </div>
  );
};

export default QuizPage;