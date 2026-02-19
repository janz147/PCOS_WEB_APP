import React from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = ({ faqs, searchQuery }) => {
  const filteredFaqs = searchQuery
    ? faqs?.filter(
        (faq) =>
          faq?.question?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          faq?.answer?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
    : faqs;

  if (searchQuery && filteredFaqs?.length === 0) {
    return (
      <div className="text-center py-12 md:py-16">
        <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-base md:text-lg">
          No results found for: <span className="font-medium text-foreground">"{searchQuery}"</span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try different keywords or browse all FAQs below
        </p>
      </div>
    );
  }

  if (searchQuery && filteredFaqs?.length > 0) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center pb-4 border-b border-border">
          <p className="text-muted-foreground text-sm md:text-base">
            Found {filteredFaqs?.length} result{filteredFaqs?.length !== 1 ? 's' : ''} for: <span className="font-medium text-foreground">"{searchQuery}"</span>
          </p>
        </div>
        {filteredFaqs?.map((faq, index) => (
          <div
            key={faq?.id}
            className={`${
              index !== filteredFaqs?.length - 1 ? 'border-b border-border pb-4 md:pb-6' : ''
            }`}
          >
            <h3 className="font-heading font-medium text-base md:text-lg text-foreground mb-2">
              {faq?.question}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {faq?.answer}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {faqs?.map((faq, index) => (
        <div
          key={faq?.id}
          className={`${
            index !== faqs?.length - 1 ? 'border-b border-border pb-4 md:pb-6' : ''
          }`}
        >
          <h3 className="font-heading font-medium text-base md:text-lg text-foreground mb-2">
            {faq?.question}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {faq?.answer}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;