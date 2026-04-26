import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import Icon from '../../components/AppIcon';
import DashboardCard from '../../components/ui/DashboardCard';
import Image from '../../components/AppImage';
import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';
import RatingSurveyModal from '../../components/ui/RatingSurveyModal';

import DarleneImg from './img/Darlene Gaia Loma.jpg';
import KatherineImg from './img/Katherine Anne Jacob.jpg';
import LyraImg from './img/Lyra Margarette Go.jpg';
import MarimelImg from './img/Marimel Narvaez.jpg';
import XelenajImg from './img/Xelenaj Bethaida Gonzales.jpg';
import ZhinnyImg from './img/Zhinny Ren Lao.jpg';

const AboutPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRatingSurvey, setShowRatingSurvey] = useState(false);
  const navigate = useNavigate();

  const keyFeatures = [
    {
      id: 1,
      icon: 'MessageSquare',
      title: 'PCOS AI Quiz',
      description:
        'Take a guided quiz to understand your PCOS symptoms and try our AI-driven image and data-based detection tools.',
      buttonText: 'Take Assessment',
      route: '/pcos-care-dashboard',
      isHighlighted: false,
    },
    {
      id: 2,
      icon: 'Activity',
      title: 'Facts and Myths on PCOS',
      description:
        'Learn the facts about PCOS, clear up common myths, and better understand symptoms, causes, and care options.',
      buttonText: 'View Facts & Myths',
      route: '/facts-and-myths',
      isHighlighted: false,
    },
    {
      id: 3,
      icon: 'Newspaper',
      title: 'Latest PCOS Health Information',
      description:
        'Stay updated with the latest research findings, treatment guidelines, and evidence-based health information.',
      buttonText: 'Read Articles',
      route: '/pcos-care-dashboard',
      isHighlighted: false,
    },
    {
      id: 4,
      icon: 'MapPin',
      title: 'OB/GYN & Health Centers',
      description:
        'Find experienced PCOS specialists, OB/GYN clinics, and healthcare providers near you.',
      buttonText: 'Find Centers',
      route: '/clinics-near-me',
      isHighlighted: false,
    },
  ];

  const researchers = [
    {
      id: 1,
      name: 'Darlene Gaia Loma',
      role: 'Co-Researcher',
      department: 'College of Nursing',
      imageUrl: DarleneImg,
      imageAlt: 'Nursing Student, Co-researcher',
    },
    {
      id: 2,
      name: 'Katherine Anne Jacob',
      role: 'Co-Researcher',
      department: 'College of Nursing',
      imageUrl: KatherineImg,
      imageAlt: 'Nursing Student, Co-researcher',
    },
    {
      id: 3,
      name: 'Xelenaj Bethaida Gonzales',
      role: 'Co-Researcher',
      department: 'College of Nursing',
      imageUrl: XelenajImg,
      imageAlt: 'Nursing Student, Co-researcher',
    },
    {
      id: 4,
      name: 'Lyra Margarette Go',
      role: 'Co-Researcher',
      department: 'College of Nursing',
      imageUrl: LyraImg,
      imageAlt: 'Nursing Student, Co-researcher',
    },
    {
      id: 5,
      name: 'Zhinny Ren Lao',
      role: 'Co-Researcher',
      department: 'College of Nursing',
      imageUrl: ZhinnyImg,
      imageAlt: 'Nursing Student, Co-researcher',
    },
  ];

  const researchAdviser = {
    id: 6,
    name: 'Marimel Narvaez, RN, MAN',
    role: 'Research Adviser',
    department: 'College of Nursing',
    imageUrl: MarimelImg,
    imageAlt: 'Research adviser for the Research Study',
  };

  return (
    <>
      <Helmet>
        <title>About CystSense App - Our Story & Team</title>
        <meta
          name="description"
          content="Learn about CystSense App's mission to empower women with PCOS through comprehensive health management, education, and support. Meet our dedicated team of healthcare professionals."
        />
      </Helmet>

      <Sidebar isOpen={isSidebarOpen} />
      <HamburgerButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <BackButton isSidebarOpen={isSidebarOpen} />
      <RatingSurveyModal
        isOpen={showRatingSurvey}
        onClose={() => setShowRatingSurvey(false)}
      />

      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 page-transition ml-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
          <header className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-4 md:mb-6">
              <Icon
                name="Heart"
                size={32}
                className="md:w-10 md:h-10"
                color="var(--color-primary)"
              />
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 md:mb-4 px-4">
              About CystSense App
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Understanding PCOS, Empowering Your Health Journey
            </p>
          </header>

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
              {keyFeatures?.map((feature) => (
                <div
                  key={feature?.id}
                  className="group transition-all duration-300 hover:-translate-y-1 "
                >
                  <DashboardCard
                    icon={feature?.icon}
                    title={feature?.title}
                    description={feature?.description}
                    buttonText={feature?.buttonText}
                    route={feature?.route}
                    isHighlighted={feature?.isHighlighted}
                    onClick={() => navigate(feature?.route)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 md:mb-20">
            <div className="card-base max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon
                      name="BookHeart"
                      size={32}
                      className="md:w-10 md:h-10"
                      color="var(--color-primary)"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-4">
                    Our Story
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We are a group of student nurses who believe that no woman should have to feel like a stranger to her own body.
                    </p>
                    <p>
                      This app is our heartbeat. It was born from countless hours of research and a deep desire to make sure no woman ever feels unseen in her health journey again. We created this space to hold your hand as you navigate the depth of PCOS, turning your "I don't know" into "I understand."
                    </p>
                    <p>
                      We are realistic enough to know that technology can never replace the presence of a nurse or the wisdom of a doctor. But we are idealistic enough to believe that knowledge is the best cure for fear. We want to take the complicated science from our textbooks and turn it into a clear, honest path for you to follow.
                    </p>
                    <p>
                      We haven't met you yet, but we are already in your corner. We hope this tool gives you the language to speak up for your health and the courage to seek the care you deserve.
                    </p>
                    <div className="flex justify-end pt-6">
                      <div className="text-right space-y-2">
                        <p className="font-medium text-foreground">
                          With heart and purpose,
                        </p>
                        <p className="font-semibold text-foreground">
                          The Researchers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16 md:mb-20" id="researchers">
            <div className="text-center mb-12 md:mb-14 px-4">
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                About the Study
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                This application is developed as part of an academic research initiative aimed at promoting early PCOS risk awareness through machine learning and nursing-oriented health guidance.
              </p>
            </div>

            <div className="card-base max-w-7xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon name="FlaskConical" size={26} color="var(--color-primary)" />
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
                  <h3 className="font-heading font-semibold text-lg text-foreground">
                    Study Overview
                  </h3>
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
                      { icon: 'MapPin', label: 'Study Area', value: 'Legazpi City, Philippines' },
                    ].map((item) => (
                      <div key={item?.label} className="bg-primary/5 rounded-xl p-4 text-center">
                        <Icon name={item?.icon} size={20} color="var(--color-primary)" className="mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">{item?.label}</p>
                        <p className="text-sm font-semibold text-foreground">{item?.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-10 px-4 mt-10">
              <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2">
                Meet the Researchers
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                The team behind the development of the CystSense application and research study.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-10 px-4 lg:px-0">
              {researchers?.map((member) => (
                <div
                  key={member?.id}
                  className="group w-full sm:w-[320px] lg:w-[340px] text-center p-6 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-transparent transition-transform duration-300 ease-out group-hover:scale-110">
                    <Image
                      src={member?.imageUrl}
                      alt={member?.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                    {member?.name}
                  </h3>
                  <p className="text-base text-primary font-medium mb-1">
                    {member?.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member?.department}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center px-4 lg:px-0">
              <div className="group w-full sm:w-[340px] lg:w-[360px] text-center p-6 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-2">
                <div className="relative w-55 h-55 mx-auto mb-6 rounded-full overflow-hidden bg-transparent transition-transform duration-300 ease-out group-hover:scale-110">
                  <Image
                    src={researchAdviser?.imageUrl}
                    alt={researchAdviser?.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                  {researchAdviser?.name}
                </h3>
                <p className="text-base text-primary font-medium mb-1">
                  {researchAdviser?.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {researchAdviser?.department}
                </p>
              </div>
            </div>
          </section>

          <section className="">
            <div className="card-base bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-center  mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Star" size={28} color="var(--color-primary)" />
              </div>
              <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-3">
                Rate Your Experience
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Help us improve the CystSense application by sharing your feedback. Your ratings and comments are valuable to our research.
              </p>
              <button
                onClick={() => setShowRatingSurvey(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                <Icon name="Star" size={18} />
                Take the Rating Survey
              </button>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default AboutPage;