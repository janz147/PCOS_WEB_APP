import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';

const factsAndMyths = [
  {
    id: 1,
    type: 'myth',
    statement: 'PCOS only affects overweight women.',
    explanation: 'PCOS can affect women of any body weight. While weight gain is a common symptom, many women with PCOS are of normal or even low weight. The condition is caused by hormonal imbalances, not body size.'
  },
  {
    id: 2,
    type: 'fact',
    statement: 'PCOS is one of the most common hormonal disorders in women of reproductive age.',
    explanation: 'PCOS affects approximately 1 in 10 women of reproductive age worldwide, making it one of the most prevalent endocrine disorders. It is a leading cause of female infertility.'
  },
  {
    id: 3,
    type: 'myth',
    statement: 'Women with PCOS cannot get pregnant.',
    explanation: 'While PCOS can make it harder to conceive due to irregular ovulation, many women with PCOS successfully become pregnant — either naturally or with medical assistance such as fertility medications or IVF.'
  },
  {
    id: 4,
    type: 'fact',
    statement: 'PCOS is associated with an increased risk of type 2 diabetes and insulin resistance.',
    explanation: 'Women with PCOS are at a significantly higher risk of developing insulin resistance and type 2 diabetes. Regular blood sugar monitoring and lifestyle modifications are important for long-term health management.'
  },
  {
    id: 5,
    type: 'myth',
    statement: 'PCOS is caused by eating too much sugar.',
    explanation: 'PCOS is a complex hormonal condition with genetic and environmental factors. While a high-sugar diet can worsen insulin resistance (a common feature of PCOS), it does not cause the condition itself.'
  },
  {
    id: 6,
    type: 'fact',
    statement: 'Lifestyle changes such as diet and exercise can significantly improve PCOS symptoms.',
    explanation: 'Even a modest weight loss of 5–10% of body weight can restore ovulation, improve hormone levels, and reduce symptoms. Regular physical activity and a balanced diet are cornerstone treatments for PCOS.'
  },
  {
    id: 7,
    type: 'myth',
    statement: 'If you have regular periods, you cannot have PCOS.',
    explanation: 'Some women with PCOS do have regular menstrual cycles. PCOS diagnosis is based on a combination of criteria including hormone levels, ultrasound findings, and symptoms — not just menstrual regularity.'
  },
  {
    id: 8,
    type: 'fact',
    statement: 'PCOS can affect mental health, increasing the risk of anxiety and depression.',
    explanation: 'Research shows that women with PCOS have a higher prevalence of anxiety, depression, and reduced quality of life. The hormonal imbalances, physical symptoms, and fertility concerns all contribute to psychological distress.'
  },
  {
    id: 9,
    type: 'myth',
    statement: 'PCOS goes away after menopause.',
    explanation: 'While some PCOS symptoms like irregular periods resolve after menopause, the underlying metabolic risks — such as insulin resistance, cardiovascular disease risk, and type 2 diabetes — persist and may even worsen.'
  },
  {
    id: 10,
    type: 'fact',
    statement: 'There is no cure for PCOS, but it can be effectively managed.',
    explanation: 'PCOS is a lifelong condition, but its symptoms can be managed through medications, lifestyle changes, and regular medical care. Early diagnosis and treatment help prevent long-term complications.'
  },
  {
    id: 11,
    type: 'myth',
    statement: 'Birth control pills cure PCOS.',
    explanation: 'Oral contraceptives can help regulate periods and reduce androgen levels, but they do not cure PCOS. Symptoms often return after stopping the pill. They are a management tool, not a cure.'
  },
  {
    id: 12,
    type: 'fact',
    statement: 'PCOS has a genetic component and can run in families.',
    explanation: 'Research indicates that PCOS tends to run in families. If your mother or sister has PCOS, you may have a higher risk of developing it. Both genetic and environmental factors play a role.'
  }
];

const FactsAndMythsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? factsAndMyths
    : factsAndMyths?.filter((item) => item?.type === activeFilter);

  return (
    <>
      <Helmet>
        <title>Facts and Myths on PCOS - PCOS Care</title>
        <meta name="description" content="Separate fact from fiction about Polycystic Ovary Syndrome (PCOS). Learn the truth behind common myths and discover evidence-based facts about PCOS." />
      </Helmet>
      <Sidebar isOpen={isSidebarOpen} />
      <HamburgerButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <BackButton isSidebarOpen={isSidebarOpen} />
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 page-transition ml-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">

          {/* Hero Header */}
          <header className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-4 md:mb-6">
              <Icon name="Lightbulb" size={32} className="md:w-10 md:h-10" color="var(--color-primary)" />
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 md:mb-4 px-4">
              Facts &amp; Myths on PCOS
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Separating evidence-based facts from common misconceptions about Polycystic Ovary Syndrome.
            </p>
          </header>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 mb-10">
            {[
              { key: 'all', label: 'All', icon: 'List' },
              { key: 'fact', label: 'Facts', icon: 'CheckCircle' },
              { key: 'myth', label: 'Myths', icon: 'XCircle' }
            ]?.map((tab) => (
              <button
                key={tab?.key}
                onClick={() => setActiveFilter(tab?.key)}
                className={`
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all
                  ${activeFilter === tab?.key
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary'}
                `}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
                <span className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${activeFilter === tab?.key ? 'bg-white/20' : 'bg-muted'}
                `}>
                  {tab?.key === 'all' ? factsAndMyths?.length : factsAndMyths?.filter(i => i?.type === tab?.key)?.length}
                </span>
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-4 md:space-y-5">
            {filtered?.map((item) => (
              <div
                key={item?.id}
                className={`
                  card-base transition-default hover:shadow-coral-lg hover:-translate-y-0.5
                  border-l-4
                  ${item?.type === 'fact' ? 'border-l-green-500' : 'border-l-red-400'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5
                    ${item?.type === 'fact' ? 'bg-green-100' : 'bg-red-100'}
                  `}>
                    <Icon
                      name={item?.type === 'fact' ? 'CheckCircle' : 'XCircle'}
                      size={22}
                      color={item?.type === 'fact' ? '#16a34a' : '#ef4444'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide
                        ${item?.type === 'fact' ?'bg-green-100 text-green-700' :'bg-red-100 text-red-600'}
                      `}>
                        {item?.type === 'fact' ? '✓ Fact' : '✗ Myth'}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-2 leading-snug">
                      {item?.statement}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item?.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-12 card-base bg-primary/5 border border-primary/20 text-center">
            <Icon name="Info" size={24} color="var(--color-primary)" className="mx-auto mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              The information provided here is for educational purposes only and does not constitute medical advice.
              Always consult a qualified healthcare professional for diagnosis and treatment of PCOS.
            </p>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default FactsAndMythsPage;
