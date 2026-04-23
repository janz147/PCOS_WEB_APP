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

const TABULAR_MODEL_FIELDS = [
  "Age (yrs)",
  "Weight (Kg)",
  "Height(Cm)",
  "BMI",
  "Cycle(R/I)",
  "Cycle length(days)",
  "Marraige Status (Yrs)",
  "Pregnant(Y/N)",
  "No. of aborptions",
  "I   beta-HCG(mIU/mL)",
  "FSH(mIU/mL)",
  "LH(mIU/mL)",
  "FSH/LH",
  "Hip(inch)",
  "Waist(inch)",
  "Waist:Hip Ratio",
  "TSH (mIU/L)",
  "PRL(ng/mL)",
  "Vit D3 (ng/mL)",
  "PRG(ng/mL)",
  "RBS(mg/dl)",
  "Weight gain(Y/N)",
  "hair growth(Y/N)",
  "Skin darkening (Y/N)",
  "Hair loss(Y/N)",
  "Fast food (Y/N)",
  "Reg.Exercise(Y/N)"
];

const MIN_FIELDS_FOR_ANY_RESULT = 1;
const MIN_FIELDS_FOR_PRELIMINARY = 4;
const MIN_FIELDS_FOR_CONFIDENT = 8;

const getCompletenessLevel = (filledCount) => {
  if (filledCount >= MIN_FIELDS_FOR_CONFIDENT) return 'confident';
  if (filledCount >= MIN_FIELDS_FOR_PRELIMINARY) return 'preliminary';
  if (filledCount >= MIN_FIELDS_FOR_ANY_RESULT) return 'insufficient';
  return 'invalid';
};

// Build user-friendly result items based on key answers for the general quiz (NEW UPDATE)
const buildGeneralStaticAnswers = (answers) => {
  const items = [];

  const cycle = answers?.['Cycle(R/I)'];
  if (cycle === '0') {
    items.push({
      title: 'Regular Menstruation',
      text: 'Regular periods often mean your hormones are working in balance and ovulation is steady. Keeping up supportive habits like nourishing meals, gentle movement, good sleep, stress care, and staying aware of cycle changes can help maintain long-term hormonal and overall well-being.'
    });
  }

  if (cycle === '1') {
    items.push({
      title: 'Irregular Menstruation',
      text: 'Irregular periods can sometimes be a sign of changes in hormone balance. Missed or unpredictable cycles may be linked to ovulation or metabolic concerns. Supporting your body with regular routines, nourishing meals, good sleep, stress care, and seeking guidance when changes continue can help support cycle balance and overall well-being.'
    });
  }

  const bleeding = Array.isArray(answers?.['days_of_bleeding'])
    ? answers?.['days_of_bleeding']?.[0]
    : answers?.['days_of_bleeding'];

  if (bleeding === '1-2') {
    items.push({
      title: 'Bleeding Less Than 3 Days',
      text: 'Short periods can sometimes be linked to low energy intake, stress, poor sleep, or changes in body weight. Supporting your body with nourishing meals, enough rest, stress care, and steady daily routines may help improve cycle balance and overall well-being.'
    });
  }

  if (bleeding === '3-4' || bleeding === '5-7') {
    items.push({
      title: 'Bleeding 3 to 7 Days',
      text: 'Bleeding that lasts 3 to 7 days is usually a sign of a balanced menstrual cycle. Continuing habits like nourishing meals, gentle movement, good sleep, stress care, and paying attention to cycle changes can help support overall well-being.'
    });
  }

  if (bleeding === 'more_than_7') {
    items.push({
      title: 'Bleeding More Than 7 Days',
      text: 'Bleeding that lasts longer than 7 days can be tiring for the body and may increase iron needs. Listening to your body, keeping track of your cycle, choosing nourishing foods, resting well, and managing stress can help support balance and overall well-being.'
    });
  }

  const skipped = answers?.['skipped_period'];
  if (skipped === 'yes') {
    items.push({
      title: 'Skipped Periods',
      text: 'Missing a period can sometimes happen when the body is under stress, not getting enough energy, or when hormones are temporarily out of balance. Supporting your body with regular, nourishing meals, adequate sleep, gentle daily movement, and stress care can help encourage more consistent cycle patterns and long-term reproductive well-being.'
    });
  }

  const symptoms = Array.isArray(answers?.['period_symptoms'])
    ? answers?.['period_symptoms']
    : [];

  const symptomMap = {
    cramps: {
      title: 'Menstrual Pain',
      text: 'Period pain can increase when inflammation and muscle tension are higher in the body. Gentle movement, warm foods or heat therapy, adequate hydration, stress reduction, and consistent sleep can help the body relax and may ease discomfort over time.'
    },
    bloating: {
      title: 'Premenstrual Symptoms (PMS)',
      text: 'PMS symptoms often reflect how the body responds to hormonal shifts before a period. Supporting stable blood sugar with regular meals, reducing excess salty or sugary foods, getting enough rest, and practicing stress care can help soften these premenstrual changes.'
    },
    mood_changes: {
      title: 'Mood & Emotional Changes',
      text: 'Mood changes around the cycle can happen when hormone levels interact with stress and sleep patterns. Prioritizing good sleep, balanced meals, gentle movement, and calming daily routines can help support emotional balance throughout the cycle.'
    },
    loose_stools: {
      title: 'Digestive Changes',
      text: 'Digestive changes near your period are common and are often linked to hormone effects on the gut. Staying well hydrated, eating fiber-rich foods, and maintaining regular meal times can help support smoother digestion during this time.'
    },
    constipation: {
      title: 'Digestive Changes',
      text: 'Digestive changes near your period are common and are often linked to hormone effects on the gut. Staying well hydrated, eating fiber-rich foods, and maintaining regular meal times can help support smoother digestion during this time.'
    },
    fatigue: {
      title: 'Energy and Sleep Changes',
      text: 'Feeling more tired or having sleep changes around your period can be a sign that your body is adjusting to hormonal shifts. Supporting consistent sleep routines, nourishing meals, and gentle movement can help stabilize energy levels and improve rest across the cycle.'
    },
    sleep_trouble: {
      title: 'Energy and Sleep Changes',
      text: 'Feeling more tired or having sleep changes around your period can be a sign that your body is adjusting to hormonal shifts. Supporting consistent sleep routines, nourishing meals, and gentle movement can help stabilize energy levels and improve rest across the cycle.'
    }
  };

  const seen = new Set();
  symptoms.forEach((key) => {
    const item = symptomMap[key];
    if (item && !seen.has(item.title)) {
      seen.add(item.title);
      items.push(item);
    }
  });

  return items;
};

// Map UI answers to model-ready JSON
const mapAnswersToModel = (answers) => {
  const toNum = (val) => {
    if (val === '' || val === null || val === undefined) return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  const toYN = (val) => {
    if (val === true || val === 'Y') return 'Y';
    if (val === false || val === 'N') return 'N';
    return null;
  };

  const payload = {
    "Age (yrs)": toNum(answers?.["Age (yrs)"]),
    "Weight (Kg)": toNum(answers?.["Weight (Kg)"]),
    "Height(Cm)": toNum(answers?.["Height(Cm)"]),
    "BMI": toNum(answers?.["BMI"]),
    "Cycle(R/I)": toNum(answers?.["Cycle(R/I)"]),
    "Cycle length(days)": toNum(answers?.["Cycle length(days)"]),
    "Marraige Status (Yrs)": toNum(answers?.["Marraige Status (Yrs)"]),
    "Pregnant(Y/N)": toYN(answers?.["Pregnant(Y/N)"]),
    "No. of aborptions": toNum(answers?.["No. of aborptions"]),
    "I   beta-HCG(mIU/mL)": toNum(answers?.["I   beta-HCG(mIU/mL)"]),
    "FSH(mIU/mL)": toNum(answers?.["FSH(mIU/mL)"]),
    "LH(mIU/mL)": toNum(answers?.["LH(mIU/mL)"]),
    "FSH/LH": toNum(answers?.["FSH/LH"]),
    "Hip(inch)": toNum(answers?.["Hip(inch)"]),
    "Waist(inch)": toNum(answers?.["Waist(inch)"]),
    "Waist:Hip Ratio": toNum(answers?.["Waist:Hip Ratio"]),
    "TSH (mIU/L)": toNum(answers?.["TSH (mIU/L)"]),
    "PRL(ng/mL)": toNum(answers?.["PRL(ng/mL)"]),
    "Vit D3 (ng/mL)": toNum(answers?.["Vit D3 (ng/mL)"]),
    "PRG(ng/mL)": toNum(answers?.["PRG(ng/mL)"]),
    "RBS(mg/dl)": toNum(answers?.["RBS(mg/dl)"]),
    "Weight gain(Y/N)": toYN(answers?.["Weight gain(Y/N)"]),
    "hair growth(Y/N)": toYN(answers?.["hair growth(Y/N)"]),
    "Skin darkening (Y/N)": toYN(answers?.["Skin darkening (Y/N)"]),
    "Hair loss(Y/N)": toYN(answers?.["Hair loss(Y/N)"]),
    "Fast food (Y/N)": toYN(answers?.["Fast food (Y/N)"]),
    "Reg.Exercise(Y/N)": toYN(answers?.["Reg.Exercise(Y/N)"])
  };

  const filledFields = TABULAR_MODEL_FIELDS.filter((field) => {
    const v = payload?.[field];
    return v !== null && v !== undefined && v !== '';
  });

  const filledCount = filledFields.length;
  const completenessLevel = getCompletenessLevel(filledCount);

  return {
    ...payload,
    filledCount,
    completenessLevel,
    missingFields: TABULAR_MODEL_FIELDS.filter((field) => {
      const v = payload?.[field];
      return v === null || v === undefined || v === '';
    }),
    readyForPrediction: filledCount >= MIN_FIELDS_FOR_ANY_RESULT
  };
};

const getGeneralSectionGuidance = (section, answers) => {
  const items = [];

  // SECTION 1: Period and cycle tracking
  if (section?.id === 1) {
    const cycle = answers?.['Cycle(R/I)'];
    if (cycle === '0') {
      items.push({
        title: 'Regular Menstruation',
        text: 'Regular periods often mean your hormones are working in balance and ovulation is steady. Keeping up supportive habits like nourishing meals, gentle movement, good sleep, stress care, and staying aware of cycle changes can help maintain long-term hormonal and overall well-being.'
      });
    }

    if (cycle === '1') {
      items.push({
        title: 'Irregular Menstruation',
        text: 'Irregular periods can sometimes be a sign of changes in hormone balance. Missed or unpredictable cycles may be linked to ovulation or metabolic concerns. Supporting your body with regular routines, nourishing meals, good sleep, stress care, and seeking guidance when changes continue can help support cycle balance and overall well-being.'
      });
    }

    const bleeding = answers?.['days_of_bleeding'];
    const bleedingValue = Array.isArray(bleeding) ? bleeding[0] : bleeding;

    if (bleedingValue === '1-2') {
      items.push({
        title: 'Bleeding Less Than 3 Days',
        text: 'Short periods can sometimes be linked to low energy intake, stress, poor sleep, or changes in body weight. Supporting your body with nourishing meals, enough rest, stress care, and steady daily routines may help improve cycle balance and overall well-being.'
      });
    }

    if (bleedingValue === '3-4' || bleedingValue === '5-7') {
      items.push({
        title: 'Bleeding 3 to 7 Days',
        text: 'Bleeding that lasts 3 to 7 days is usually a sign of a balanced menstrual cycle. Continuing habits like nourishing meals, gentle movement, good sleep, stress care, and paying attention to cycle changes can help support overall well-being.'
      });
    }

    if (bleedingValue === 'more_than_7') {
      items.push({
        title: 'Bleeding More Than 7 Days',
        text: 'Bleeding that lasts longer than 7 days can be tiring for the body and may increase iron needs. Listening to your body, keeping track of your cycle, choosing nourishing foods, resting well, and managing stress can help support balance and overall well-being.'
      });
    }

    const skipped = answers?.['skipped_period'];
    if (skipped === 'yes') {
      items.push({
        title: 'Skipped Periods',
        text: 'Missing a period can sometimes happen when the body is under stress, not getting enough energy, or when hormones are temporarily out of balance. Supporting your body with regular, nourishing meals, adequate sleep, gentle daily movement, and stress care can help encourage more consistent cycle patterns and long-term reproductive well-being.'
      });
    }

    const symptoms = Array.isArray(answers?.['period_symptoms'])
      ? answers?.['period_symptoms']
      : [];

    const symptomMap = {
      cramps: {
        title: 'Menstrual Pain',
        text: 'Period pain can increase when inflammation and muscle tension are higher in the body. Gentle movement, warm foods or heat therapy, adequate hydration, stress reduction, and consistent sleep can help the body relax and may ease discomfort over time.'
      },
      bloating: {
        title: 'Premenstrual Symptoms (PMS)',
        text: 'PMS symptoms often reflect how the body responds to hormonal shifts before a period. Supporting stable blood sugar with regular meals, reducing excess salty or sugary foods, getting enough rest, and practicing stress care can help soften these premenstrual changes.'
      },
      mood_changes: {
        title: 'Mood & Emotional Changes',
        text: 'Mood changes around the cycle can happen when hormone levels interact with stress and sleep patterns. Prioritizing good sleep, balanced meals, gentle movement, and calming daily routines can help support emotional balance throughout the cycle.'
      },
      loose_stools: {
        title: 'Digestive Changes',
        text: 'Digestive changes near your period are common and are often linked to hormone effects on the gut. Staying well hydrated, eating fiber-rich foods, and maintaining regular meal times can help support smoother digestion during this time.'
      },
      constipation: {
        title: 'Digestive Changes',
        text: 'Digestive changes near your period are common and are often linked to hormone effects on the gut. Staying well hydrated, eating fiber-rich foods, and maintaining regular meal times can help support smoother digestion during this time.'
      },
      fatigue: {
        title: 'Energy and Sleep Changes',
        text: 'Feeling more tired or having sleep changes around your period can be a sign that your body is adjusting to hormonal shifts. Supporting consistent sleep routines, nourishing meals, and gentle movement can help stabilize energy levels and improve rest across the cycle.'
      },
      sleep_trouble: {
        title: 'Energy and Sleep Changes',
        text: 'Feeling more tired or having sleep changes around your period can be a sign that your body is adjusting to hormonal shifts. Supporting consistent sleep routines, nourishing meals, and gentle movement can help stabilize energy levels and improve rest across the cycle.'
      }
    };

    const seen = new Set();
    symptoms.forEach((key) => {
      const item = symptomMap[key];
      if (item && !seen.has(item.title)) {
        seen.add(item.title);
        items.push(item);
      }
    });
  }

  // SECTION 2: BMI and waist circumference
  if (section?.id === 2) {
    const bmi = parseFloat(answers?.BMI);
    const waistIn = parseFloat(answers?.['Waist(inch)']);
    const waistCm = Number.isFinite(waistIn) ? waistIn * 2.54 : null;

    if (Number.isFinite(bmi)) {
      if (bmi >= 35) {
        items.push({
          title: 'Severe Obese',
          text: 'This range can place added strain on the body’s energy and hormone systems. Small, compassionate steps—like regular nourishing meals, light daily movement, improved sleep routines, and stress support—can make meaningful differences in supporting metabolic and reproductive well-being.'
        });
      } else if (bmi > 30) {
        items.push({
          title: 'Obese',
          text: 'This range may increase the body’s workload in managing energy and hormone signals. Gentle, sustainable lifestyle changes—such as consistent meals, gradual increases in physical activity, stress care, and quality rest—can help support metabolic health and hormonal balance over time.'
        });
      } else if (bmi >= 25) {
        items.push({
          title: 'Overweight',
          text: 'Being in this range can sometimes be linked to changes in how the body handles energy and hormones. Supporting steady blood sugar through balanced meals, regular movement, stress reduction, and good sleep can help improve metabolic balance and support long-term hormonal health.'
        });
      } else if (bmi >= 18.5) {
        items.push({
          title: 'Normal',
          text: 'A weight range within this category often supports balanced energy use and hormone function. Continuing healthy habits like regular meals, consistent movement, quality sleep, and stress care can help maintain metabolic and reproductive well-being over time.'
        });
      } else {
        items.push({
          title: 'Underweight',
          text: 'Being underweight can sometimes mean the body isn’t getting enough energy or nutrients to support regular hormone and cycle function. Focusing on nourishing meals, regular eating times, adequate protein, good sleep, and gentle movement can help support energy balance and reproductive health.'
        });
      }
    }

    if (Number.isFinite(waistCm) && waistCm > 88) {
      items.push({
        title: 'Waist Circumference High',
        text: 'Waist circumference reflects how the body stores fat around the midsection, which is closely linked to metabolic and hormonal health. When measurements are higher than normal, supporting core health through regular movement (especially strength and walking), balanced meals that support blood sugar, stress regulation, quality sleep, and daily activity helps promote long-term wellness.'
      });
    }
  }

  // SECTION 3: Energy crashes after meals
  if (section?.id === 3) {
    const values = Array.isArray(answers?.['energy_hunger_signals'])
      ? answers?.['energy_hunger_signals']
      : [];

    if (values.includes('tired_after_meals')) {
      items.push({
        title: 'Energy Crashes After Meals',
        text: 'Feeling very tired after eating can be a sign that your body is having trouble keeping energy levels steady. Supporting balanced meals with protein, fiber, and healthy fats, eating at regular times, gentle daily movement, and good sleep can help your body use energy more smoothly and support long-term hormone balance.'
      });
    }

    if (values.includes('sweet_cravings')) {
      items.push({
        title: 'Sugar Cravings',
        text: 'Frequent sugar cravings often happen when blood sugar levels rise and fall quickly. Eating regular meals, including protein at each meal, choosing whole foods more often, and managing stress can help reduce cravings and support healthier energy and hormone balance over time.'
      });
    }

    if (values.includes('hungry_after_eating')) {
      items.push({
        title: 'Feeling Hungry Soon After Eating',
        text: 'Getting hungry shortly after meals may mean your body needs more steady nourishment. Adding protein, fiber, and healthy fats to meals, slowing down while eating, and avoiding skipped meals can help you feel fuller longer and support metabolic and hormonal health.'
      });
    }
  }

  // SECTION 4: Skin & hair
  if (section?.id === 4) {
    if (answers?.['Pimples(Y/N)'] === true) {
      items.push({
        title: 'Persistent Acne',
        text: 'Ongoing acne can happen when oil production and skin turnover are being influenced by hormone shifts. Keeping blood sugar steady by eating regular meals, reducing frequent sugary snacks, managing stress, and getting enough sleep can help calm oil activity and support clearer skin over time.'
      });
    }

    if (answers?.['Hair loss(Y/N)'] === true) {
      items.push({
        title: 'Scalp Hair Thinning',
        text: 'Hair thinning often reflects how the body is prioritizing nutrients during times of stress or low energy availability. Eating enough protein, avoiding skipped meals, supporting iron-rich and whole foods, and prioritizing rest can help the body redirect nutrients toward healthier hair growth.'
      });
    }

    if (answers?.['hair growth(Y/N)'] === true) {
      items.push({
        title: 'Excess Hair Growth',
        text: 'Excess hair growth can be linked to increased sensitivity to certain hormones. Supporting steady energy levels through balanced meals, regular movement, and stress reduction can help the body regulate hormone signals more smoothly and support healthier hair patterns over time.'
      });
    }
  }

  // SECTION 5: Daily lifestyle
  if (section?.id === 5) {
    const activity = answers?.['physical_activity_level'];
    if (activity === 'sedentary') {
      items.push({
        title: 'Sedentary',
        text: 'Spending most of the day sitting can make it harder for the body to use energy efficiently, which may affect hormone balance over time. Even small amounts of daily movement—like short walks, stretching, or light household activity—can help improve energy use and support metabolic and reproductive health.'
      });
    }

    if (activity === 'light') {
      items.push({
        title: 'Light',
        text: 'Light movement is a great foundation for health. To further support hormone balance, adding a bit more consistency—such as daily walks, gentle strength exercises, or longer movement sessions—can help the body manage energy, support insulin balance, and promote overall well-being.'
      });
    }

    if (activity === 'active') {
      items.push({
        title: 'Active',
        text: 'Regular physical activity strongly supports hormone balance, energy regulation, and long-term reproductive health. Continuing a mix of movement, strength, and recovery—along with adequate rest and nutrition—helps maintain these benefits and protects against burnout.'
      });
    }

    const sleep = answers?.['sleep_duration'];
    if (sleep === 'very_short') {
      items.push({
        title: 'Very Short Sleep',
        text: 'Sleeping very little on a regular basis can place stress on the body and make it harder to regulate energy and hormones. Prioritizing longer, more consistent sleep—along with calming bedtime routines and regular meal times—can help support hormone balance and protect long-term reproductive health.'
      });
    }

    if (sleep === 'short') {
      items.push({
        title: 'Short Sleep',
        text: 'Regularly getting short sleep can affect how the body manages blood sugar, appetite, and stress hormones. Gradually increasing sleep time, keeping a steady sleep schedule, and limiting late-night stimulation can help improve energy balance and support hormonal well-being over time.'
      });
    }

    if (sleep === 'normal') {
      items.push({
        title: 'Normal Sleep',
        text: 'This amount of sleep generally supports healthy energy use and hormone regulation. Maintaining consistent sleep and wake times, along with balanced nutrition and daily movement, helps protect metabolic and reproductive health.'
      });
    }

    if (sleep === 'long') {
      items.push({
        title: 'Long Sleep',
        text: 'Sleeping longer than usual is not always a problem, but when it happens often, it can sometimes reflect low energy, poor sleep quality, or underlying stress. Supporting daytime movement, regular meal timing, and good sleep quality can help improve overall energy and hormonal balance.'
      });
    }

    const stress = answers?.['stress_level'];
    if (stress === 'low') {
      items.push({
        title: 'Low Stress',
        text: 'Low stress levels help keep the body’s stress hormones and reproductive hormones working in balance. Continuing supportive habits like regular sleep, nourishing meals, gentle movement, and daily moments of calm can help maintain long-term hormonal and overall well-being.'
      });
    }

    if (stress === 'moderate') {
      items.push({
        title: 'Moderate Stress',
        text: 'Moderate stress can cause temporary shifts in hormones, especially during busy or demanding periods of life. Supporting yourself with consistent routines, balanced meals, regular movement, and simple stress-relief practices can help the body recover and maintain hormonal balance.'
      });
    }

    if (stress === 'high') {
      items.push({
        title: 'High Stress',
        text: 'High stress over time can strain the body’s stress response system and affect how hormones and energy are regulated. Prioritizing stress care—such as improving sleep, creating regular meal times, gentle daily movement, and intentional relaxation—can help reduce strain on the body and support healthier hormonal patterns.'
      });
    }
  }

  // SECTION 6: Eating habits
  if (section?.id === 6) {
    const mealPattern = answers?.['meal_pattern'];
    if (mealPattern === '3meals') {
      items.push({
        title: 'Regular Meal Timing',
        text: 'Eating meals at regular times helps the body know when to release energy and hormones. This pattern supports stable blood sugar and metabolic balance, which helps protect long-term hormonal and reproductive health.'
      });
    }

    if (mealPattern === 'small_snacks') {
      items.push({
        title: 'Frequent Small Meals',
        text: 'Eating smaller meals or snacks throughout the day can work well when meals are balanced and planned. Including protein, fiber, and healthy fats helps prevent energy dips and supports steady hormone signals.'
      });
    }

    if (mealPattern === 'irregular') {
      items.push({
        title: 'Irregular Meals',
        text: 'Skipping meals or eating at unpredictable times can stress the body and make it harder to regulate energy and hormones. Creating more consistent meal times—even gradually—can help support metabolic stability and healthier hormone patterns.'
      });
    }

    const sugary = answers?.['sugary_intake'];
    if (sugary === 'low') {
      items.push({
        title: 'Low Sugary Food or Drink Intake',
        text: 'Keeping sugary drinks to a low level helps the body maintain steady energy and healthy hormone signals. Continuing this habit supports metabolic balance and helps protect long-term reproductive and hormonal well-being.'
      });
    }

    if (sugary === 'moderate') {
      items.push({
        title: 'Moderate Sugary Food or Drink Intake',
        text: 'Having sugary drinks sometimes may be okay on its own, but when combined with other factors like stress, irregular meals, or poor sleep, it can affect energy and hormone balance. Pairing sweet drinks with meals and choosing water or unsweetened options more often can help reduce their impact.'
      });
    }

    if (sugary === 'high') {
      items.push({
        title: 'High Sugary Food or Drink Intake',
        text: 'Frequent sugary drinks can cause repeated spikes in blood sugar, which may strain the body’s ability to regulate energy and hormones over time. Gradually reducing sugary drinks and replacing them with water, herbal teas, or unsweetened options can strongly support metabolic and hormonal health.'
      });
    }
  }

  return items;
};



// NEW - SHOW SUMMARY OF ANSWERS AFTER EACH
const getReadableAnswer = (question, value) => {
  if (value === undefined || value === null || value === '') return '';

  if (question?.type === 'toggle') {
    return value === true ? 'Yes' : 'No';
  }

  if (question?.type === 'date') {
    return value;
  }

  if (question?.type === 'checkbox') {
    const values = Array.isArray(value) ? value : [value];
    return values
      .map(v => question?.options?.find(opt => opt?.value === v)?.label || v)
      .join(', ');
  }

  if (question?.type === 'radio' || question?.type === 'select') {
    return question?.options?.find(opt => opt?.value === value)?.label || value;
  }

  return String(value);
};

const buildSectionSummary = (section, answers) => {
  return section?.questions
    ?.map((question) => {
      const value = answers?.[question?.id];
      if (value === undefined || value === null || value === '') return null;

      return {
        id: question?.id,
        label: question?.label,
        value: getReadableAnswer(question, value)
      };
    })
    .filter(Boolean);
};

// NEW - PROFESSIONAL GUIDANCE BASED ON KEY ANSWERS (NEW UPDATE)
const getProfessionalSectionGuidance = (section, answers) => {
  const items = [];
  const phase = answers?.cycle_phase;

  if (section?.id === 1) {
    // Age / LMP section usually has no static guidance unless you want a note for LMP
    return items;
  }

  if (section?.id === 2) {
    const fsh = parseFloat(answers?.['FSH(mIU/mL)']);
    const lh = parseFloat(answers?.['LH(mIU/mL)']);

    // HOMA-IR
    const insulin = parseFloat(answers?.['Fasting Insulin (µIU/mL)']);
    const glucose = parseFloat(answers?.['Fasting Plasma Glucose (mg/dL)']);
    const homaIr = Number.isFinite(insulin) && Number.isFinite(glucose)
      ? (insulin * glucose) / 405
      : null;

    if (Number.isFinite(fsh)) {
      items.push({
        title: 'FSH Levels',
        text: getFSHStaticText(fsh, phase)
      });
    }

    if (Number.isFinite(lh)) {
      items.push({
        title: 'LH Levels',
        text: getLHStaticText(lh, phase)
      });
    }

    const testosterone = parseFloat(answers?.['Total Testosterone (ng/dL)']);
    if (Number.isFinite(testosterone)) {
      items.push({
        title: 'Total Testosterone',
        text: getAndrogenStaticText('testosterone', testosterone)
      });
    }

    const androstenedione = parseFloat(answers?.['Androstenedione (ng/dL)']);
    if (Number.isFinite(androstenedione)) {
      items.push({
        title: 'Androstenedione',
        text: getAndrogenStaticText('androstenedione', androstenedione)
      });
    }

    const shbg = parseFloat(answers?.['SHBG (nmol/L)']);
    if (Number.isFinite(shbg)) {
      items.push({
        title: 'SHBG',
        text: getSHBGStaticText(shbg)
      });
    }

    const dheas = parseFloat(answers?.['DHEAS (µg/dL)']);
    if (Number.isFinite(dheas)) {
      items.push({
        title: 'DHEA-S',
        text: getDHEASStaticText(dheas)
      });
    }

    const fastingInsulin = parseFloat(answers?.['Fasting Insulin (µIU/mL)']);
    if (Number.isFinite(fastingInsulin)) {
      items.push({
        title: 'Fasting Insulin',
        text: getInsulinStaticText(fastingInsulin)
      });
    }

    const fastingGlucose = parseFloat(answers?.['Fasting Plasma Glucose (mg/dL)']);
    if (Number.isFinite(fastingGlucose)) {
      items.push({
        title: 'Fasting Plasma Glucose',
        text: getGlucoseStaticText(fastingGlucose)
      });
    }

    if (Number.isFinite(homaIr)) {
      items.push({
        title: 'HOMA-IR',
        text: getHomaIrStaticText(homaIr)
      });
    }

    const estradiol = parseFloat(answers?.['Estradiol (pg/mL)']);
    if (Number.isFinite(estradiol)) {
      items.push({
        title: 'Estradiol',
        text: getEstradiolStaticText(estradiol, phase)
      });
    }

    const progesterone = parseFloat(answers?.['PRG(ng/mL)']);
    if (Number.isFinite(progesterone)) {
      items.push({
        title: 'Progesterone',
        text: getProgesteroneStaticText(progesterone, phase)
      });
    }
  }

  if (section?.id === 3) {
    const bmi = parseFloat(answers?.BMI);
    const waist = parseFloat(answers?.['Waist(Cm)']);
    const activity = answers?.['physical_activity_level'];
    const sleep = answers?.['sleep_duration'];
    const stress = answers?.['stress_level'];
    const mealPattern = answers?.['meal_pattern'];
    const sugary = answers?.['sugary_intake'];

    if (Number.isFinite(bmi)) {
      items.push({ title: 'BMI', text: getBmiStaticText(bmi) });
    }

    if (Number.isFinite(waist)) {
      items.push({ title: 'Waist Circumference', text: getWaistStaticText(waist) });
    }

    if (activity) {
      items.push({ title: 'Level of Physical Activity', text: getActivityStaticText(activity) });
    }

    if (sleep) {
      items.push({ title: 'Sleep Duration', text: getSleepStaticText(sleep) });
    }

    if (stress) {
      items.push({ title: 'Stress Perception', text: getStressStaticText(stress) });
    }

    if (mealPattern) {
      items.push({ title: 'Eating Habits', text: getMealPatternStaticText(mealPattern) });
    }

    if (sugary) {
      items.push({ title: 'Sugary Food or Drink Intake', text: getSugaryStaticText(sugary) });
    }
  }

  return items;
};

// QUIZ PAGE COMPONENT ------------------------------------------------------------------------>
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

  const [sectionResults, setSectionResults] = useState(null);
  const [showSectionResultModal, setShowSectionResultModal] = useState(false);

  const [renderSectionResultModal, setRenderSectionResultModal] = useState(false);
  const [renderResultModal, setRenderResultModal] = useState(false);

  const [isSectionTransitioning, setIsSectionTransitioning] = useState(false);

  const handleBackToDashboard = () => {
    window.location.href = '/pcos-care-dashboard';
  };

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

  // Handle showing/hiding Section Result modals with smooth transitions
  useEffect(() => {
    if (showSectionResultModal) {
      setRenderSectionResultModal(true);
      return;
    }

    const t = setTimeout(() => setRenderSectionResultModal(false), 220);
    return () => clearTimeout(t);
  }, [showSectionResultModal]);

  // Handle showing/hiding Final Result modal with smooth transitions
  useEffect(() => {
    if (showResultModal) {
      setRenderResultModal(true);
      return;
    }

    const t = setTimeout(() => setRenderResultModal(false), 220);
    return () => clearTimeout(t);
  }, [showResultModal]);

  // Quiz sections - reorganized to group related inputs
  const quizSections = quizType === 'general' ? [
    // GENERAL/USER-FRIENDLY QUIZ SECTIONS (MORE EXPLANATORY, FOR USERS)
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
          id: 'days_of_bleeding',
          type: 'checkbox',
          label: 'How many days does your period usually last?',
          options: [
            { value: '1-2', label: '1–2 days' },
            { value: '3-4', label: '3–4 days' },
            { value: '5-7', label: '5–7 days' },
            { value: 'more_than_7', label: 'More than 7 days' }
          ],
          required: false,
          singleSelect: true
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
          id: 'physical_activity_level',
          type: 'radio',
          label: 'How active are you most days?',
          options: [
            { value: 'sedentary', label: 'Mostly sitting or little movement' },
            { value: 'light', label: 'Light activity (walking, light exercise)' },
            { value: 'active', label: 'Regular exercise or active lifestyle' }
          ],
          required: false
        },
        {
          id: 'sleep_duration',
          type: 'radio',
          label: 'How much do you usually sleep per night?',
          options: [
            { value: 'very_short', label: 'Less than 5 hours' },
            { value: 'short', label: '5–6 hours' },
            { value: 'normal', label: '7–9 hours' },
            { value: 'long', label: 'More than 9 hours' }
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
        },
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
          id: 'sugary_intake',
          type: 'radio',
          label: 'How often do you have sugary foods or drinks?',
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
    // PROFFESSIONAL/CLINICAL QUIZ SECTIONS (MORE TECHNICAL, FOR PROVIDERS)
    {
      id: 1,
      title: 'Client Details',
      description: 'DATA CHECKLIST',
      questions: [
        {
          id: 'Age (yrs)',
          type: 'number',
          label: 'Age of Client',
          placeholder: 'Enter age',
          unit: 'years',
          min: 10,
          max: 80,
          step: 1,
          required: true,
          helpText: 'Age of the client'
        },
        {
          id: 'LMP',
          type: 'date',
          label: 'LMP',
          required: false,
          helpText: 'Last menstrual period (mm/dd/yr)'
        }
      ]
    },
    {
      id: 2,
      title: '🌸 Hormonal Dynamics',
      description: 'Hormonal and metabolic markers',
      questions: [
        {
          id: 'FSH(mIU/mL)',
          type: 'number',
          label: 'FSH Levels',
          placeholder: 'Enter FSH level',
          unit: 'IU/L',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'LH(mIU/mL)',
          type: 'number',
          label: 'LSH Levels',
          placeholder: 'Enter LSH level',
          unit: 'IU/L',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'Total Testosterone (ng/dL)',
          type: 'number',
          label: 'Total Testosterone',
          placeholder: 'Enter value',
          unit: 'ng/dL',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'Androstenedione (ng/dL)',
          type: 'number',
          label: 'Androstenedione',
          placeholder: 'Enter value',
          unit: 'ng/dL',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'SHBG (nmol/L)',
          type: 'number',
          label: 'Sex Hormone Binding Globulin',
          placeholder: 'Enter value',
          unit: 'nmol/L',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'DHEAS (µg/dL)',
          type: 'number',
          label: 'Dehydroepiandosterone Sulfate',
          placeholder: 'Enter value',
          unit: 'µg/dL',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'Fasting Insulin (µIU/mL)',
          type: 'number',
          label: 'Fasting Insulin',
          placeholder: 'Enter value',
          unit: 'µIU/mL',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'Fasting Plasma Glucose (mg/dL)',
          type: 'number',
          label: 'Fasting Plasma Glucose',
          placeholder: 'Enter value',
          unit: 'mg/dL',
          min: 0,
          step: 1,
          required: false
        },
        {
          id: 'Estradiol (pg/mL)',
          type: 'number',
          label: 'Estradiol Levels',
          placeholder: 'Enter value',
          unit: 'pg/mL',
          min: 0,
          step: 0.1,
          required: false
        },
        {
          id: 'PRG(ng/mL)',
          type: 'number',
          label: 'Progesterone Levels',
          placeholder: 'Enter value',
          unit: 'ng/mL',
          min: 0,
          step: 0.1,
          required: false
        }
      ]
    },
    {
      id: 3,
      title: '📏 Body Measurements',
      description: 'Physical measurements',
      questions: [
        {
          id: 'Weight (Kg)',
          type: 'number',
          label: 'Weight',
          placeholder: 'Enter weight',
          unit: 'kg',
          min: 20,
          max: 300,
          step: 0.1,
          required: false
        },
        {
          id: 'Height(In)',
          type: 'number',
          label: 'Height',
          placeholder: 'Enter height',
          unit: 'in',
          min: 40,
          max: 90,
          step: 0.1,
          required: false
        },
        {
          id: 'Waist(Cm)',
          type: 'number',
          label: 'Waist Circumference',
          placeholder: 'Enter waist measurement',
          unit: 'cm',
          min: 40,
          max: 200,
          step: 0.1,
          required: false
        },
        {
          id: 'Hip(Cm)',
          type: 'number',
          label: 'Hip Circumference',
          placeholder: 'Enter hip measurement',
          unit: 'cm',
          min: 40,
          max: 200,
          step: 0.1,
          required: false
        },
        {
          id: 'Body Fat Percentage',
          type: 'number',
          label: 'Body Fat Percentage',
          placeholder: 'Enter body fat %',
          unit: '%',
          min: 0,
          max: 100,
          step: 0.1,
          required: false
        },
        {
          id: 'BMI',
          type: 'number',
          label: 'BMI',
          placeholder: 'Auto-calculated',
          unit: 'kg/m²',
          step: 0.01,
          required: false,
          autoCalculated: true
        },
        {
          id: 'Waist:Hip Ratio',
          type: 'number',
          label: 'Waist:Hip Ratio',
          placeholder: 'Auto-calculated',
          step: 0.001,
          required: false,
          autoCalculated: true
        },
        {
          id: 'cycle_phase',
          type: 'select',
          label: 'Cycle / Menopausal Phase',
          options: [
            { value: 'follicular', label: 'Adult Females - Follicular Phase' },
            { value: 'ovulatory', label: 'Adult Females - Ovulatory Peak' },
            { value: 'luteal', label: 'Adult Females - Luteal Phase' },
            { value: 'postmenopausal', label: 'Post-Menopausal Females' }
          ],
          required: false
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

  // Submission orchestration (UPDATED - Static Answers)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setResults(null);

    try {
      if (quizType === 'general') {
        const staticAnswers = buildGeneralStaticAnswers(answers);

        setResults({
          general: staticAnswers
        });
        setShowResultModal(true);
        return;
      }

      let imageResult = null;

      if (quizType === 'professional' && uploadedImages?.length > 0) {
        const mostRecentImage = uploadedImages?.[uploadedImages?.length - 1];

        console.log('Uploading image to /predict-image...');
        const imgResponse = await predictImage(mostRecentImage?.file);

        if (imgResponse?.ok) {
          imageResult = imgResponse?.result;
        }
      }

      const modelPayload = mapAnswersToModel(answers, quizType);
      console.log('Submitting tabular data to /predict-pcos:', modelPayload);

      const tabularResponse = await predictTabular(modelPayload);

      if (!tabularResponse?.ok) {
        throw new Error(tabularResponse?.error || 'Prediction failed');
      }

      setResults({
        tabular: tabularResponse?.result,
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
    if (!validateCurrentSection()) return;

    // General quiz: show section result first, do NOT advance yet
    if (quizType === 'general') {
      const sectionSummary = buildSectionSummary(currentSectionData, answers);
      const guidance = getGeneralSectionGuidance(currentSectionData, answers);

      // If there is nothing to show, move on immediately
      if (sectionSummary.length === 0 && guidance.length === 0) {
        if (currentSection < quizSections?.length - 1) {
          setCurrentSection(prev => prev + 1);
          setShowPartialWarning(false);
        } else {
          handleBackToDashboard();
        }
        return;
      }

      setSectionResults({
        sectionTitle: currentSectionData?.title,
        answers: sectionSummary,
        guidance
      });
      setShowSectionResultModal(true);
      return;
    }

    // Professional quiz logic
    const isLastSection = currentSection === quizSections?.length - 1;

    if (isLastSection) {
      const modelPayload = mapAnswersToModel(answers, quizType);
      if (modelPayload?.partial_input && !showPartialWarning) {
        setShowPartialWarning(true);
        return;
      }
      handleSubmit();
      return;
    }

    setCurrentSection(prev => prev + 1);
    setShowPartialWarning(false);
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
    setShowPartialWarning(false); // Reset warning when navigating back
  };

  // Handle "Continue" after showing section results in General Quiz (NEW)
  const handleContinueFromSectionResult = () => {
    setIsSectionTransitioning(true);

    setTimeout(() => {
      setShowSectionResultModal(false);
      setSectionResults(null);

      if (currentSection < quizSections?.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else {
        handleBackToDashboard();
      }

      setIsSectionTransitioning(false);
    }, 200);
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
                      if (question?.singleSelect) {
                        handleAnswer(question?.id, selected ? [] : [option?.value]);
                        return;
                      }

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
                  ? "border-primary bg-primary text-white" : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5",
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
                  ? "border-primary bg-primary text-white" : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5",
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
          <title>PCOS Assessment Quiz - CystSense App</title>
          <meta name="description" content="Take our comprehensive PCOS assessment quiz to understand your symptoms and get personalized recommendations." />
        </Helmet>
        <Sidebar isOpen={isSidebarOpen} />
        <HamburgerButton
          isOpen={isSidebarOpen}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <BackButton isSidebarOpen={isSidebarOpen} />
        <main className="min-h-screen bg-background smooth-scroll ml-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 lg:pt-20 ">
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
                    <p className="text-sm text-muted-foreground mt-1">Some fields are missing. The result will be partial, but you can still proceed.</p>
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
                        {isSubmitting ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          'Proceed Anyway'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Result Modal */}
            {renderSectionResultModal && sectionResults && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-2xl shadow-2xl max-w-3xl lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-heading font-bold text-2xl text-foreground">
                          Section Summary
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {sectionResults?.sectionTitle}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSectionResultModal(false)}
                        className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-default"
                        aria-label="Close modal"
                      >
                        <Icon name="X" size={20} />
                      </button>
                    </div>

                    <div className="space-y-6 mb-6">
                      <div className="p-5 rounded-xl bg-muted/30 border border-border">
                        <h4 className="font-semibold text-foreground mb-3">Your Answers</h4>
                        <div className="space-y-3">
                          {sectionResults?.answers?.map((item) => (
                            <div key={item.id} className="flex justify-between gap-4">
                              <span className="text-sm text-muted-foreground">{item.label}</span>
                              <span className="text-sm font-medium text-foreground text-right">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {sectionResults?.guidance?.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground">Health Prompts :</h4>
                          {sectionResults.guidance.map((item, index) => (
                            <div
                              key={index}
                              className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                            >
                              <h5 className="font-semibold text-foreground mb-2">{item.title}</h5>
                              <p className="text-sm text-muted-foreground leading-6">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t bg-background p-4 md:p-6 sticky bottom-0">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setShowSectionResultModal(false)}
                          className="flex-1"
                        >
                          Stay Here
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleBackToDashboard}
                          className="flex-1"
                          iconName="Home"
                          iconPosition="left"
                        >
                          Back to Dashboard
                        </Button>
                        <Button
                          variant="default"
                          size="lg"
                          onClick={handleContinueFromSectionResult}
                          className="flex-1"
                          disabled={isSectionTransitioning}
                        >
                          {isSectionTransitioning ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                              Loading...
                            </span>
                          ) : (
                            'Continue'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Result Modal */}
            {showResultModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-2xl shadow-2xl max-w-3xl lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                            {error ? 'Submission Failed' : quizType === 'general' ? 'Guidance Ready' : 'Assessment Complete'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {error ? 'An error occurred during submission' : quizType === 'general' ? 'Your static guidance is ready' : 'Your results are ready'}
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
                              {/* <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Prediction:</span>
                                <span className="font-bold text-foreground text-lg">
                                  {results?.tabular?.predicted_label}
                                </span>
                              </div> */}

                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Probability:</span>
                                <span className="font-bold text-foreground text-lg">
                                  {results?.tabular?.probability_display || `${(results?.tabular?.probability * 100)?.toFixed(1)}%`}
                                </span>
                              </div>

                              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Assessment Type:</span>
                                <span className={cn(
                                  "px-4 py-1.5 rounded-full text-sm font-semibold",
                                  results?.tabular?.completenessLevel === 'confident'
                                    ? "bg-green-100 text-green-700"
                                    : results?.tabular?.completenessLevel === 'preliminary'
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                )}>
                                  {results?.tabular?.completenessLevel === 'confident'
                                    ? 'Full Assessment'
                                    : results?.tabular?.completenessLevel === 'preliminary'
                                      ? 'Preliminary Assessment'
                                      : 'Insufficient Data'}
                                </span>
                              </div>

                              {results?.tabular?.completenessLevel !== 'confident' && (
                                <div className={cn(
                                  "p-4 rounded-xl border",
                                  results?.tabular?.completenessLevel === 'preliminary'
                                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                )}>
                                  <p className="text-sm font-medium">
                                    {results?.tabular?.completenessLevel === 'preliminary'
                                      ? 'This is a preliminary result due to incomplete clinical data.'
                                      : 'There is not enough data for a reliable clinical assessment.'}
                                  </p>
                                </div>
                              )}

                              {results?.tabular?.completenessLevel === 'confident' && (
                                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                  <span className="text-sm text-muted-foreground">Risk Level:</span>
                                  <span className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-semibold",
                                    results?.tabular?.probability >= 0.5
                                      ? "bg-red-100 text-red-700"
                                      : "bg-green-100 text-green-700"
                                  )}>
                                    {results?.tabular?.probability >= 0.5 ? 'High Risk' : 'Low Risk'}
                                  </span>
                                </div>
                              )}
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
                              {/* <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-sm text-muted-foreground">Prediction:</span>
                                <span className="font-bold text-foreground text-lg">{results?.image?.predicted_label}</span>
                              </div> */}
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
                                    ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
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
                      ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
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
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        {isLastSection ? 'Submitting...' : 'Next'}
                      </span>
                    ) : (
                      isLastSection ? 'Complete' : 'Next'
                    )}
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