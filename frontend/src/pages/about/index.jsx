import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import DashboardCard from '../../components/ui/DashboardCard';
import Image from '../../components/AppImage';
import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';


const AboutPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    route: '/pcos-care-dashboard',
    isHighlighted: true
  }];


  const teamMembers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Medical Director',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_155748a5d-1763296653785.png",
    imageAlt: 'Dr. Sarah Johnson, Medical Director, smiling female doctor with stethoscope in white coat'
  },
  {
    id: 2,
    name: 'Emily Chen',
    role: 'Health Coach',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_168d7a1ff-1763299022409.png",
    imageAlt: 'Emily Chen, Health Coach, friendly woman with warm smile in professional attire'
  },
  {
    id: 3,
    name: 'Dr. Maria Rodriguez',
    role: 'Endocrinologist',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_155748a5d-1763296653785.png",
    imageAlt: 'Dr. Maria Rodriguez, Endocrinologist, professional female doctor in medical coat'
  },
  {
    id: 4,
    name: 'Lisa Thompson',
    role: 'Nutritionist',
    imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1ba95ba5e-1763300102901.png",
    imageAlt: 'Lisa Thompson, Nutritionist, smiling woman with professional demeanor'
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
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <BackButton isSidebarOpen={isSidebarOpen} />

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

          {/* Meet the Team Section */}
          <section>
            <div className="text-center mb-8 md:mb-10 px-4">
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                Meet the Team
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Dedicated healthcare professionals committed to your well-being
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 lg:px-0">
              {teamMembers?.map((member) =>
              <div
                key={member?.id}
                className="card-base transition-default hover:shadow-coral-lg hover:-translate-y-1 text-center">

                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10">
                    <Image
                    src={member?.imageUrl}
                    alt={member?.imageAlt}
                    className="w-full h-full object-cover" />

                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                    {member?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {member?.role}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default AboutPage;