import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import DashboardCard from '../../components/ui/DashboardCard';
import Image from '../../components/AppImage';
import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';
import RatingSurveyModal from '../../components/ui/RatingSurveyModal';

const AboutPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRatingSurvey, setShowRatingSurvey] = useState(false);

  const keyFeatures = [
  {
    id: 1,
    icon: 'MessageSquare',
    title: 'PCOS Risk Assessment & Q&A',
    description: 'Interactive assessment tools and comprehensive Q&A to help you understand your PCOS risk and get personalized insights',
    buttonText: 'Take Assessment',
    route: '/pcos-care-dashboard',
    isHighlighted: false
  },
  {
    id: 2,
    icon: 'Activity',
    title: 'Comprehensive Health Management',
    description: 'Track symptoms, manage medications, monitor lifestyle changes, and access personalized health recommendations',
    buttonText: 'Manage Health',
    route: '/pcos-care-dashboard',
    isHighlighted: false
  },
  {
    id: 3,
    icon: 'Newspaper',
    title: 'Latest PCOS Health Information',
    description: 'Stay updated with the latest research findings, treatment guidelines, and evidence-based health information',
    buttonText: 'Read Articles',
    route: '/pcos-care-dashboard',
    isHighlighted: false
  },
  {
    id: 4,
    icon: 'MapPin',
    title: 'Accessible All-day OB/GYN & Health Centers',
    description: 'Find and connect with experienced PCOS specialists, OB/GYN clinics, and healthcare providers near you',
    buttonText: 'Find Centers',
    route: '/clinics-near-me',
    isHighlighted: true
  }];

  const researchers = [
  {
    id: 1,
    name: 'Lead Researcher',
    role: 'Principal Investigator',
    department: 'College of Nursing',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_19f3beb2f-1763294859034.png",
    imageAlt: 'Lead researcher, principal investigator in nursing research, professional photo'
  },
  {
    id: 2,
    name: 'Co-Researcher',
    role: 'Research Associate',
    department: 'Health Informatics',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1096a3cbd-1763296376031.png",
    imageAlt: 'Co-researcher in health informatics, professional photo'
  },
  {
    id: 3,
    name: 'Research Adviser',
    role: 'Faculty Adviser',
    department: 'College of Nursing',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1889d2ced-1763298735501.png",
    imageAlt: 'Faculty adviser for PCOS research study, professional photo'
  },
  {
    id: 4,
    name: 'Statistical Consultant',
    role: 'Data Analyst',
    department: 'Research & Statistics',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_193f0d14b-1763299878498.png",
    imageAlt: 'Statistical consultant and data analyst for PCOS research, professional photo'
  }];

  return (
    <>
      <Helmet>
        <title>About PCOS Care App - Our Story & Team</title>
        <meta name="description" content="Learn about PCOS Care App's mission to empower women with PCOS through comprehensive health management, education, and support. Meet our dedicated team of healthcare professionals." />
      </Helmet>
      <Sidebar isOpen={isSidebarOpen} />
      <HamburgerButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <BackButton isSidebarOpen={isSidebarOpen} />
      <RatingSurveyModal
        isOpen={showRatingSurvey}
        onClose={() => setShowRatingSurvey(false)} />
      
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 page-transition ml-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
          {/* Hero Header */}
          <header className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-4 md:mb-6">
              <Icon name="Heart" size={32} className="md:w-10 md:h-10" color="var(--color-primary)" />
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 md:mb-4 px-4">
              About PCOS Care App
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Understanding PCOS, Empowering Your Health Journey
            </p>
          </header>

          {/* Key Features Section */}
          <section className="mb-16 md:mb-20">
            <div className="text-center mb-8 md:mb-10 px-4">
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                Key Features
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Comprehensive tools and resources to support your PCOS journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 lg:px-0">
              {keyFeatures?.map((feature) =>
              <DashboardCard
                key={feature?.id}
                icon={feature?.icon}
                title={feature?.title}
                description={feature?.description}
                buttonText={feature?.buttonText}
                route={feature?.route}
                isHighlighted={feature?.isHighlighted}
                onClick={() => {}} />
              )}
            </div>
          </section>

          {/* Our Story Section */}
          <section className="mb-16 md:mb-20">
            <div className="card-base max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon name="BookHeart" size={32} className="md:w-10 md:h-10" color="var(--color-primary)" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-4">
                    Our Story
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      About PCOS Care App is a student project born from a deep commitment to connecting people, simplifying complex health information, and empowering individuals to take control of their PCOS journey.
                    </p>
                    <p>
                      We understand that managing PCOS can feel overwhelming. That's why we've created a comprehensive platform that brings together expert medical guidance, evidence-based resources, and a supportive community—all in one accessible place.
                    </p>
                    <p className="font-medium text-foreground">
                      Connecting People. Simplifying health information. Making PCOS management easy to understand and accessible for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About the Study & Researchers Section */}
          <section className="mb-16 md:mb-20" id="researchers">
            <div className="text-center mb-8 md:mb-10 px-4">
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                About the Study &amp; Researchers
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                This application is developed as part of an academic research initiative aimed at promoting early PCOS risk awareness through machine learning and nursing-oriented health guidance.
              </p>
            </div>

            {/* Study Overview */}
            <div className="card-base max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon name="FlaskConical" size={26} color="var(--color-primary)" />
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
                  <h3 className="font-heading font-semibold text-lg text-foreground">Study Overview</h3>
                  <p>
                    This prototype web application was developed as a research study to explore the feasibility of using machine learning models for early PCOS risk detection among women of reproductive age.
                  </p>
                  <p>
                    The study integrates a nurse-informed approach to health education, providing users with evidence-based information, risk assessment tools, and guidance on seeking professional medical care.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    {[
                    { icon: 'Target', label: 'Study Type', value: 'Descriptive-Developmental Research' },
                    { icon: 'Users', label: 'Target Population', value: 'Women of Reproductive Age' },
                    { icon: 'MapPin', label: 'Study Area', value: 'Legazpi City, Philippines' }]?.
                    map((item) =>
                    <div key={item?.label} className="bg-primary/5 rounded-xl p-4 text-center">
                        <Icon name={item?.icon} size={20} color="var(--color-primary)" className="mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">{item?.label}</p>
                        <p className="text-sm font-semibold text-foreground">{item?.value}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Researchers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 lg:px-0">
              {researchers?.map((member) =>
              <div
                key={member?.id}
                className="card-base transition-default hover:shadow-coral-lg hover:-translate-y-1 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10">
                    <Image
                    src={member?.imageUrl}
                    alt={member?.imageAlt}
                    className="w-full h-full object-cover" />
                  
                  </div>
                  <h3 className="font-heading font-semibold text-base text-foreground mb-1">
                    {member?.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-1">
                    {member?.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member?.department}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Rating Survey CTA */}
          <section className="mb-16 md:mb-20">
            <div className="card-base bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Star" size={28} color="var(--color-primary)" />
              </div>
              <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-3">
                Rate Your Experience
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Help us improve the PCOS Care application by sharing your feedback. Your ratings and comments are valuable to our research.
              </p>
              <button
                onClick={() => setShowRatingSurvey(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                
                <Icon name="Star" size={18} />
                Take the Rating Survey
              </button>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>);

};

export default AboutPage;