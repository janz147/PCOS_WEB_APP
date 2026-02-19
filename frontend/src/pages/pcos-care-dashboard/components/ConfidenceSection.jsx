import React from 'react';
import Icon from '../../../components/AppIcon';

const ConfidenceSection = () => {
  const confidencePoints = [
    {
      id: 1,
      icon: "Sparkles",
      title: "Understanding Your Body",
      description: "Learn about PCOS symptoms, causes, and how it affects your body to make informed decisions about your health"
    },
    {
      id: 2,
      icon: "Heart",
      title: "Self-Care Practices",
      description: "Discover effective self-care routines, stress management techniques, and lifestyle modifications that support your wellbeing"
    },
    {
      id: 3,
      icon: "Users",
      title: "Community Support",
      description: "Connect with others who understand your journey and share experiences in a supportive, judgment-free environment"
    },
    {
      id: 4,
      icon: "TrendingUp",
      title: "Track Your Progress",
      description: "Monitor your symptoms, lifestyle changes, and health improvements to celebrate your achievements along the way"
    }
  ];

  return (
    <section className="mb-16 md:mb-20">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2 px-4">
          Building Confidence Through Knowledge
        </h2>
        <p className="text-muted-foreground text-sm md:text-base px-4">
          Empower yourself with understanding and support
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {confidencePoints?.map((point) => (
          <div
            key={point?.id}
            className="card-base transition-default hover:shadow-coral-lg hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name={point?.icon} size={24} className="md:w-7 md:h-7" color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-medium text-base md:text-lg text-foreground mb-2">
                  {point?.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {point?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConfidenceSection;