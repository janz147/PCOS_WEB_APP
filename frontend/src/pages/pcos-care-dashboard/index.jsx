import React, { useEffect, useState } from 'react';
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

const INITIAL_NEWS_ARTICLES = [
  {
    id: 1,
    title: 'New PCOS Treatment Guidelines Released for 2026',
    excerpt:
      'International medical organizations have published updated guidelines for PCOS diagnosis and treatment, incorporating latest research findings and patient-centered care approaches that emphasize individualized treatment plans.',
    date: '2026-01-15',
    imageUrl:
      'https://img.rocket.new/generatedImages/rocket_gen_img_156e44d41-1765786683225.png',
    imageAlt:
      'Female doctor in white coat reviewing medical guidelines and research papers at modern clinic desk with laptop and stethoscope',
    articleUrl: '/news/treatment-guidelines-2026',
    category: 'Medical Updates',
    readTime: '6 min read',
  },
  {
    id: 2,
    title: 'Lifestyle Interventions Show Promising Results in PCOS Management',
    excerpt:
      'Recent studies demonstrate significant improvements in PCOS symptoms through targeted lifestyle modifications including diet, exercise, and stress management techniques, with participants showing improved hormone levels and menstrual regularity.',
    date: '2026-01-12',
    imageUrl:
      'https://img.rocket.new/generatedImages/rocket_gen_img_1a127a1a8-1766483711381.png',
    imageAlt:
      'Young woman in athletic wear doing yoga stretches on exercise mat in bright modern home gym with plants and natural lighting',
    articleUrl: '/news/lifestyle-interventions',
    category: 'Research',
    readTime: '5 min read',
  },
  {
    id: 3,
    title: 'Understanding PCOS and Mental Health Connection',
    excerpt:
      'Experts discuss the important relationship between PCOS and mental health, offering strategies for managing anxiety and depression associated with the condition through integrated care approaches and support systems.',
    date: '2026-01-10',
    imageUrl:
      'https://img.rocket.new/generatedImages/rocket_gen_img_1020f041f-1767232351970.png',
    imageAlt:
      'Compassionate female therapist having supportive counseling session with young woman patient in calm modern therapy office with soft lighting',
    articleUrl: '/news/mental-health-connection',
    category: 'Wellness',
    readTime: '7 min read',
  },
];

// Proxied to https://news.google.com by Vite (dev/preview) and nginx (production)
const NEWS_FEED_URL =
  '/gnews/rss/search?q=polycystic+ovary+syndrome+OR+PCOS&hl=en-PH&gl=PH&ceid=PH:en';

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// Image pools. Swap any URL for your own (e.g. '/news/diet.jpg' in /public/news).
const NEWS_IMAGES = {
  diagnosis: [
    unsplash('photo-1576091160550-2173dba999ef'),
    unsplash('photo-1559757148-5c350d0d3c56'),
  ],
  lifestyle: [
    unsplash('photo-1490645935967-10de6ba17061'),
    unsplash('photo-1571019613454-1cb2f99b2d8b'),
  ],
  mental: [
    'https://img.rocket.new/generatedImages/rocket_gen_img_1020f041f-1767232351970.png',
  ],
  research: [
    unsplash('photo-1532938911079-1b06ac7ceec7'),
    unsplash('photo-1505751172876-fa1923c5c528'),
  ],
  general: [
    'https://img.rocket.new/generatedImages/rocket_gen_img_156e44d41-1765786683225.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1a127a1a8-1766483711381.png',
  ],
};

const NEWS_IMAGE_RULES = [
  { key: 'mental', test: /mental|anxiety|depress|stress|mood|therap/i },
  { key: 'lifestyle', test: /diet|nutrition|food|exercise|workout|lifestyle|weight|sleep|yoga/i },
  { key: 'diagnosis', test: /diagnos|symptom|test|ultrasound|screening|hormone/i },
  { key: 'research', test: /study|research|trial|scientist|nature|journal|guideline/i },
];

// Picks a themed image for the article, avoiding repeats within one batch
const pickNewsImage = (title, used) => {
  const matched = NEWS_IMAGE_RULES.find((r) => r.test.test(title));
  const ordered = [
    ...(matched ? NEWS_IMAGES[matched.key] : []),
    ...Object.values(NEWS_IMAGES).flat(),
  ];
  const next = ordered.find((url) => !used.has(url)) || ordered[used.size % ordered.length];
  used.add(next);
  return next;
};

const PCOSCareDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newsArticles, setNewsArticles] = useState(INITIAL_NEWS_ARTICLES);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleQuizStart = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Starting PCOS assessment quiz...');
  };

  useEffect(() => {
    let cancelled = false;

    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        setNewsError('');

        const response = await fetch(NEWS_FEED_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const xml = await response.text();

        // If the proxy is missing, the SPA fallback returns index.html with a 200
        if (!xml.trimStart().startsWith('<?xml') && !xml.includes('<rss')) {
          throw new Error('Proxy not configured: received HTML instead of RSS');
        }

        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        const items = Array.from(doc.querySelectorAll('item')).slice(0, 6);

        const usedImages = new Set();

        const liveArticles = items.map((item, index) => {
          const rawTitle = item.querySelector('title')?.textContent || '';
          const source = item.querySelector('source')?.textContent || 'News';
          const pubDate = item.querySelector('pubDate')?.textContent;
          const title = rawTitle.replace(/ - [^-]+$/, ''); // drop trailing " - Source"

          let date = '';
          if (pubDate) {
            const parsed = new Date(pubDate);
            if (!Number.isNaN(parsed.getTime())) {
              date = parsed.toISOString().slice(0, 10);
            }
          }

          return {
            id: `live-${index}`,
            title,
            excerpt: `Latest from ${source}. Click to read the full story.`,
            date,
            imageUrl: pickNewsImage(title, usedImages),
            imageAlt: title,
            articleUrl: item.querySelector('link')?.textContent || '#',
            category: source,
            readTime: 'Read more',
          };
        });

        if (!cancelled) {
          setNewsArticles(
            liveArticles.length ? liveArticles : INITIAL_NEWS_ARTICLES
          );
        }
      } catch (err) {
        console.error('News fetch error:', err);
        if (!cancelled) {
          setNewsError('Failed to load live news.');
        }
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    };

    fetchNews();

    return () => {
      cancelled = true;
    };
  }, []);

  const resourceCards = [
    {
      id: 1,
      icon: 'BookOpen',
      title: 'Educational Resources',
      description:
        'Access comprehensive guides and articles about PCOS management, symptoms, and treatment options',
      buttonText: 'Explore Resources',
      href: 'https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos',
      external: true,
      isHighlighted: false,
    },
    {
      id: 2,
      icon: 'Lightbulb',
      title: 'Facts & Myths on PCOS',
      description:
        'Separate fact from fiction — explore evidence-based facts and debunk common myths about PCOS',
      buttonText: 'Explore Facts & Myths',
      route: '/facts-and-myths',
      external: false,
      isHighlighted: true,
    },
    {
      id: 3,
      icon: 'MapPin',
      title: 'Find Specialists',
      description:
        'Locate experienced PCOS specialists and healthcare providers in your area',
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
      question: 'What is PCOS?',
      answer:
        "Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting women of reproductive age. It's characterized by irregular periods, excess androgen levels, and polycystic ovaries. PCOS affects approximately 1 in 10 women and can impact fertility, metabolism, and overall health.",
    },
    {
      id: 2,
      question: 'What are the common symptoms of PCOS?',
      answer:
        'Common symptoms include irregular or absent menstrual periods, excess hair growth (hirsutism) on face and body, acne and oily skin, weight gain or difficulty losing weight, thinning hair on the scalp, darkening of skin in body creases, and difficulty getting pregnant. Symptoms vary from person to person in severity and combination.',
    },
    {
      id: 3,
      question: 'How is PCOS diagnosed?',
      answer:
        'Diagnosis typically involves a comprehensive evaluation including physical examination, detailed medical history, blood tests to measure hormone levels (androgens, insulin, cholesterol), and pelvic ultrasound imaging to check for cysts on ovaries. Your healthcare provider will use the Rotterdam criteria, which requires at least two of three features: irregular ovulation, excess androgens, and polycystic ovaries.',
    },
    {
      id: 4,
      question: 'Can PCOS be cured?',
      answer:
        'While there is no cure for PCOS, it can be effectively managed through lifestyle modifications, medications, and ongoing medical care. Many women successfully manage their symptoms through weight management, regular exercise, balanced nutrition, stress reduction, and appropriate medical treatment. Early diagnosis and treatment can help prevent long-term complications.',
    },
    {
      id: 5,
      question: 'What lifestyle changes help manage PCOS?',
      answer:
        'Key lifestyle modifications include maintaining a healthy weight through balanced nutrition and regular physical activity, following a low-glycemic diet rich in whole foods, managing stress through meditation or yoga, getting adequate sleep (7-9 hours nightly), limiting processed foods and added sugars, and staying hydrated. Even a 5-10% weight loss can significantly improve symptoms.',
    },
    {
      id: 6,
      question: 'Does PCOS affect fertility?',
      answer:
        'PCOS is one of the leading causes of female infertility due to irregular ovulation or anovulation. However, many women with PCOS can conceive with appropriate treatment including lifestyle modifications, fertility medications like clomiphene or letrozole, or assisted reproductive technologies. Working with a reproductive endocrinologist can help optimize fertility outcomes.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>OvaMetrics Dashboard</title>
        <meta
          name="description"
          content="Access comprehensive PCOS support through educational resources, interactive quizzes, local clinic finder, and latest research updates. Manage your PCOS with confidence."
        />
      </Helmet>

      <Sidebar isOpen={isSidebarOpen} />
      <HamburgerButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

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
                  onSearch={handleSearch}
                />
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

            {newsLoading && (
              <div className="text-center text-muted-foreground mb-4">
                Loading latest news...
              </div>
            )}

            {newsError && (
              <div className="text-center text-muted-foreground mb-4">
                {newsError}
              </div>
            )}

            <NewsGrid articles={newsArticles} />
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default PCOSCareDashboard;
