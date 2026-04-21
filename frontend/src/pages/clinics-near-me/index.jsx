import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';

const CLINICS = [
  {
    id: 1,
    name: "Bicol Medical Center – OB-GYN Department",
    address: "Rizal Street, Naga City, Camarines Sur, Bicol Region",
    phone: "(054) 473-2121",
    hours: "Monday – Sunday, 24 hours (Emergency); OPD: Mon–Fri 8:00 AM – 5:00 PM",
    services: "OB-GYN consultations, prenatal care, PCOS management, gynecologic surgery, family planning",
    website: "https://www.bicolmedicalcenter.gov.ph",
    social: null,
    area: "Naga City"
  },
  {
    id: 2,
    name: "Legazpi City Medical Center",
    address: "Rawis, Legazpi City, Albay, Bicol Region",
    phone: "(052) 480-7777",
    hours: "Monday – Sunday, 24 hours",
    services: "General medicine, OB-GYN, prenatal care, women's health consultations",
    website: "https://www.legazpicitymedicalcenter.gov.ph",
    social: null,
    area: "Legazpi City"
  },
  {
    id: 3,
    name: "Albay Doctors Hospital",
    address: "Peñaranda Street, Legazpi City, Albay",
    phone: "(052) 480-5555",
    hours: "Monday – Sunday, 24 hours",
    services: "OB-GYN, prenatal and postnatal care, gynecologic consultations, laboratory services",
    website: "https://www.albaydoctorshospital.com",
    social: null,
    area: "Legazpi City"
  },
  {
    id: 4,
    name: "Aquinas University of Legazpi – Medical Clinic",
    address: "Rawis, Legazpi City, Albay",
    phone: "(052) 480-0872",
    hours: "Monday – Friday, 8:00 AM – 5:00 PM",
    services: "General health consultations, referrals to OB-GYN specialists",
    website: "https://www.aquinas-university.edu",
    social: null,
    area: "Legazpi City"
  },
  {
    id: 5,
    name: "Daraga Community Health Center",
    address: "Poblacion, Daraga, Albay",
    phone: null,
    hours: "Monday – Friday, 8:00 AM – 5:00 PM",
    services: "Primary health care, maternal and child health, family planning, prenatal consultations",
    website: "https://www.daraga.gov.ph/health-services",
    social: null,
    area: "Daraga"
  },
  {
    id: 6,
    name: "Daraga Rural Health Unit (RHU)",
    address: "Daraga Municipal Hall Compound, Daraga, Albay",
    phone: "(052) 483-0011",
    hours: "Monday – Friday, 8:00 AM – 5:00 PM",
    services: "Maternal health, prenatal check-ups, family planning, immunization, women's health programs",
    website: "https://www.daraga.gov.ph/rhu",
    social: null,
    area: "Daraga"
  },
  {
    id: 7,
    name: "Holy Infant Jesus Medical Center",
    address: "Landco Business Park, Legazpi City, Albay",
    phone: "(052) 742-5555",
    hours: "Monday – Sunday, 24 hours",
    services: "OB-GYN, prenatal care, ultrasound, gynecologic surgery, PCOS consultations",
    website: "https://www.hijmc.com.ph",
    social: null,
    area: "Legazpi City"
  },
  {
    id: 8,
    name: "Legazpi City Health Office",
    address: "City Hall Compound, Legazpi City, Albay",
    phone: "(052) 480-7100",
    hours: "Monday – Friday, 8:00 AM – 5:00 PM",
    services: "Public health services, maternal and child health, family planning, prenatal care",
    website: "https://www.legazpi.gov.ph/health",
    social: null,
    area: "Legazpi City"
  },
  {
    id: 9,
    name: "St. Clare Medical Center",
    address: "Quezon Avenue, Legazpi City, Albay",
    phone: "(052) 480-6888",
    hours: "Monday – Sunday, 24 hours",
    services: "OB-GYN consultations, prenatal and postnatal care, gynecologic procedures, laboratory and imaging",
    website: "https://www.stclaremedicalcenter.com.ph",
    social: null,
    area: "Legazpi City"
  },
  {
    id: 10,
    name: "Bicol Regional Training and Teaching Hospital (BRTTH)",
    address: "Concepcion Pequeña, Naga City, Camarines Sur",
    phone: "(054) 811-3788",
    hours: "Monday – Sunday, 24 hours",
    services: "OB-GYN, reproductive health, PCOS management, prenatal care, gynecologic surgery",
    website: "https://www.brtth.doh.gov.ph",
    social: null,
    area: "Naga City"
  }
];

const AREAS = ["All", "Legazpi City", "Daraga", "Naga City"];

const ClinicsNearMe = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');

  const filteredClinics = CLINICS?.filter((clinic) => {
    const matchesArea = selectedArea === 'All' || clinic?.area === selectedArea;
    const q = searchQuery?.toLowerCase();
    const matchesSearch =
      !q ||
      clinic?.name?.toLowerCase()?.includes(q) ||
      clinic?.address?.toLowerCase()?.includes(q) ||
      (clinic?.services && clinic?.services?.toLowerCase()?.includes(q));
    return matchesArea && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Clinics | CystSense</title>
        <meta
          name="description"
          content="Find OB-GYN clinics and healthcare providers in the Daraga and Legazpi area for PCOS consultations and women's health services."
        />
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
          <div className="mb-8 md:mb-10">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">
              Clinics &amp; OB-GYNs
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
              Healthcare providers in the Daraga and Legazpi area offering OB-GYN consultations,
              prenatal care, and women's health services.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Search by name, address, or service…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {AREAS?.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedArea === area
                      ? 'bg-primary text-white' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredClinics?.length} {filteredClinics?.length === 1 ? 'clinic' : 'clinics'}
            {selectedArea !== 'All' && ` in ${selectedArea}`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>

          {/* Clinic Cards */}
          {filteredClinics?.length > 0 ? (
            <div className="space-y-5">
              {filteredClinics?.map((clinic) => (
                <div
                  key={clinic?.id}
                  className="card-base hover:shadow-coral-lg transition-default"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon name="Building2" size={32} className="text-primary" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground leading-snug">
                          {clinic?.name}
                        </h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {clinic?.area}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2">
                        <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{clinic?.address}</p>
                      </div>

                      {/* Phone */}
                      {clinic?.phone && (
                        <div className="flex items-center gap-2">
                          <Icon name="Phone" size={16} className="text-muted-foreground flex-shrink-0" />
                          <a
                            href={`tel:${clinic?.phone}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {clinic?.phone}
                          </a>
                        </div>
                      )}

                      {/* Hours */}
                      {clinic?.hours && (
                        <div className="flex items-start gap-2">
                          <Icon name="Clock" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground">{clinic?.hours}</p>
                        </div>
                      )}

                      {/* Services */}
                      {clinic?.services && (
                        <div className="flex items-start gap-2">
                          <Icon name="Stethoscope" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{clinic?.services}</p>
                        </div>
                      )}

                      {/* Website / Social */}
                      {(clinic?.website || clinic?.social) && (
                        <div className="flex items-center gap-2">
                          <Icon name="Globe" size={16} className="text-muted-foreground flex-shrink-0" />
                          {clinic?.website && (
                            <a
                              href={clinic?.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Visit Website
                            </a>
                          )}
                          {clinic?.social && !clinic?.website && (
                            <a
                              href={clinic?.social}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Facebook Page
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-base text-center py-14">
              <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">No clinics found.</p>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your search or selecting a different area.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-10 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Clinic information is provided for reference only. Hours and contact details may
                change. Please call ahead to confirm availability before visiting.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default ClinicsNearMe;