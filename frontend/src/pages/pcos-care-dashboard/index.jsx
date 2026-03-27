import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../../components/ui/SearchBar';
import QuizLauncher from '../../components/ui/QuizLauncher';
import Button from '../../components/ui/Button';
import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import Footer from '../../components/ui/Footer';
import WelcomeHeader from './components/WelcomeHeader';
import ConfidenceSection from './components/ConfidenceSection';
import ResourceGrid from './components/ResourceGrid';
import FAQSection from './components/FAQSection';
import NewsGrid from './components/NewsGrid';

const PCOSCareDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleQuizStart = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Starting PCOS assessment quiz...');
  };

  const resourceCards = [
    {
      id: 1,
      icon: 'BookOpen',
      title: 'Educational Resources',
      description: 'Access comprehensive guides and articles about PCOS management, symptoms, and treatment options',
      buttonText: 'Explore Resources',
      href: 'https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos',
      external: true,
      isHighlighted: false,
    },
    {
      id: 2,
      icon: 'Lightbulb',
      title: 'Facts & Myths on PCOS',
      description: 'Separate fact from fiction — explore evidence-based facts and debunk common myths about PCOS',
      buttonText: 'Explore Facts & Myths',
      route: '/facts-and-myths',
      external: false,
      isHighlighted: true,
    },
    {
      id: 3,
      icon: 'MapPin',
      title: 'Find Specialists',
      description: 'Locate experienced PCOS specialists and healthcare providers in your area',
      buttonText: 'Find Clinics',
      route: '/clinics-near-me',
      external: false,
      isHighlighted: false,
    },
    {
      id: 4,
      icon: 'FileText',
      title: 'Research & Studies',
      description: 'Stay informed with the latest PCOS research findings and clinical studies',
      buttonText: 'View Research',
      href: 'https://www.nichd.nih.gov/health/topics/pcos',
      external: true,
      isHighlighted: false,
    },
  ];


  const faqData = [
    {
      id: 1,
      question: "What is PCOS?",
      answer: "Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting women of reproductive age. It's characterized by irregular periods, excess androgen levels, and polycystic ovaries. PCOS affects approximately 1 in 10 women and can impact fertility, metabolism, and overall health."
    },
    {
      id: 2,
      question: "What are the common symptoms of PCOS?",
      answer: "Common symptoms include irregular or absent menstrual periods, excess hair growth (hirsutism) on face and body, acne and oily skin, weight gain or difficulty losing weight, thinning hair on the scalp, darkening of skin in body creases, and difficulty getting pregnant. Symptoms vary from person to person in severity and combination."
    },
    {
      id: 3,
      question: "How is PCOS diagnosed?",
      answer: "Diagnosis typically involves a comprehensive evaluation including physical examination, detailed medical history, blood tests to measure hormone levels (androgens, insulin, cholesterol), and pelvic ultrasound imaging to check for cysts on ovaries. Your healthcare provider will use the Rotterdam criteria, which requires at least two of three features: irregular ovulation, excess androgens, and polycystic ovaries."
    },
    {
      id: 4,
      question: "Can PCOS be cured?",
      answer: "While there is no cure for PCOS, it can be effectively managed through lifestyle modifications, medications, and ongoing medical care. Many women successfully manage their symptoms through weight management, regular exercise, balanced nutrition, stress reduction, and appropriate medical treatment. Early diagnosis and treatment can help prevent long-term complications."
    },
    {
      id: 5,
      question: "What lifestyle changes help manage PCOS?",
      answer: "Key lifestyle modifications include maintaining a healthy weight through balanced nutrition and regular physical activity, following a low-glycemic diet rich in whole foods, managing stress through meditation or yoga, getting adequate sleep (7-9 hours nightly), limiting processed foods and added sugars, and staying hydrated. Even a 5-10% weight loss can significantly improve symptoms."
    },
    {
      id: 6,
      question: "Does PCOS affect fertility?",
      answer: "PCOS is one of the leading causes of female infertility due to irregular ovulation or anovulation. However, many women with PCOS can conceive with appropriate treatment including lifestyle modifications, fertility medications like clomiphene or letrozole, or assisted reproductive technologies. Working with a reproductive endocrinologist can help optimize fertility outcomes."
    }];


  const newsArticles = [
    {
      id: 1,
      title: "New PCOS Treatment Guidelines Released for 2026",
      excerpt: "International medical organizations have published updated guidelines for PCOS diagnosis and treatment, incorporating latest research findings and patient-centered care approaches that emphasize individualized treatment plans.",
      date: "2026-01-15",
      imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_156e44d41-1765786683225.png",
      imageAlt: "Female doctor in white coat reviewing medical guidelines and research papers at modern clinic desk with laptop and stethoscope",
      articleUrl: "/news/treatment-guidelines-2026",
      category: "Medical Updates",
      readTime: "6 min read"
    },
    {
      id: 2,
      title: "Lifestyle Interventions Show Promising Results in PCOS Management",
      excerpt: "Recent studies demonstrate significant improvements in PCOS symptoms through targeted lifestyle modifications including diet, exercise, and stress management techniques, with participants showing improved hormone levels and menstrual regularity.",
      date: "2026-01-12",
      imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1a127a1a8-1766483711381.png",
      imageAlt: "Young woman in athletic wear doing yoga stretches on exercise mat in bright modern home gym with plants and natural lighting",
      articleUrl: "/news/lifestyle-interventions",
      category: "Research",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "Understanding PCOS and Mental Health Connection",
      excerpt: "Experts discuss the important relationship between PCOS and mental health, offering strategies for managing anxiety and depression associated with the condition through integrated care approaches and support systems.",
      date: "2026-01-10",
      imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1020f041f-1767232351970.png",
      imageAlt: "Compassionate female therapist having supportive counseling session with young woman patient in calm modern therapy office with soft lighting",
      articleUrl: "/news/mental-health-connection",
      category: "Wellness",
      readTime: "7 min read"
    }];


  return (
    <>
      <Helmet>
        <title>PCOS Care Dashboard - Comprehensive PCOS Support & Resources</title>
        <meta name="description" content="Access comprehensive PCOS support through educational resources, interactive quizzes, local clinic finder, and latest research updates. Manage your PCOS with confidence." />
      </Helmet>

      <Sidebar isOpen={isSidebarOpen} />
      <HamburgerButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* About Us Button - scrolls with page */}
      <div className="relative">
        <Button
          variant="outline"
          iconName="Info"
          iconPosition="left"
          onClick={() => navigate('/about')}
          className="absolute top-4 right-4 z-50"
        >
          About Us
        </Button>
      </div>

      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 page-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
          <WelcomeHeader />

          <section className="mb-16 md:mb-20">
            <QuizLauncher onStart={handleQuizStart} />
          </section>

          <ConfidenceSection />

          <section className="mb-16 md:mb-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="px-4 lg:px-0">
                <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Find answers to common questions about PCOS
                </p>
              </div>
              <div className="w-full lg:w-96 px-4 lg:px-0">
                <SearchBar
                  placeholder="Search FAQs..."
                  onSearch={handleSearch} />

              </div>
            </div>

            <div className="card-base">
              <FAQSection faqs={faqData} searchQuery={searchQuery} />
            </div>
          </section>

          <section className="mb-16 md:mb-20">
            <div className="text-center mb-8 md:mb-10 px-4">
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                Resources & Support
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Explore our comprehensive tools and information
              </p>
            </div>

            <ResourceGrid resources={resourceCards} />
          </section>

          <section>
            <div className="text-center mb-8 md:mb-10 px-4">
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                Latest News & Updates
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Stay informed with the latest PCOS research and health news
              </p>
            </div>

            <NewsGrid articles={newsArticles} />
          </section>
        </div>

        <Footer />
      </main>
    </>);

};

export default PCOSCareDashboard;