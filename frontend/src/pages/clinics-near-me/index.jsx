import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';
import SearchBar from '../../components/ui/SearchBar';
import DoctorCard from './components/DoctorCard';

const ClinicsNearMe = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Searching for clinics in:', query);
  };

  const doctorsData = [
  {
    id: 1,
    name: 'Dr. Shandi Mar Basiri',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd585f5f-1763299864864.png",
    specialization: 'MD, FPCH FPCOG FACOG - Internal Medicine/Adolescent Medicine',
    experience: '18 yrs experience',
    consultationTypes: ['Online Consultation', 'In-Person Consultation'],
    clinicName: 'ACE Medical Center Legazpi',
    clinicAddress: 'Legazpi City, Albay',
    schedule: 'Today, 07:00 AM - 12:00 PM',
    fee: '₱980.00'
  },
  {
    id: 2,
    name: 'Dr. Lawrence Lao',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_1e4ea4e2c-1768585492265.png",
    specialization: 'MD - Orthopedics, Sports Medicine, Knee, Shoulder reconstruction, Sports Injuries',
    experience: '15 yrs experience',
    consultationTypes: ['Online Consultation', 'In-Person Consultation'],
    clinicName: 'Online Clinic',
    clinicAddress: 'Online Consultation',
    schedule: 'Today, 08:03 PM - 10:30 PM',
    fee: 'Free'
  },
  {
    id: 3,
    name: 'Dr. Stephanie Tan',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_16b783830-1763294102791.png",
    specialization: 'MD - Primary Care, Occupational & Industrial Medicine',
    experience: '12 yrs experience',
    consultationTypes: ['Online Consultation', 'In-Person Consultation'],
    clinicName: 'Online Clinic',
    clinicAddress: 'Online Consultation',
    schedule: 'Today, 12:30 PM - 15:30 PM',
    fee: '₱750.60'
  },
  {
    id: 4,
    name: 'Dr. Maria Santos',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_1ebb0b2eb-1769615844177.png",
    specialization: 'MD, FPOGS - Obstetrics & Gynecology, PCOS Specialist',
    experience: '20 yrs experience',
    consultationTypes: ['Online Consultation', 'In-Person Consultation'],
    clinicName: 'Women\'s Health Center Manila',
    clinicAddress: 'Makati City, Metro Manila',
    schedule: 'Tomorrow, 09:00 AM - 05:00 PM',
    fee: '₱1,200.00'
  },
  {
    id: 5,
    name: 'Dr. James Rodriguez',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9d1885e-1766073495970.png",
    specialization: 'MD - Endocrinology, Diabetes & Hormonal Disorders',
    experience: '16 yrs experience',
    consultationTypes: ['Online Consultation', 'In-Person Consultation'],
    clinicName: 'Endocrine Care Clinic',
    clinicAddress: 'Quezon City, Metro Manila',
    schedule: 'Today, 02:00 PM - 08:00 PM',
    fee: '₱1,100.00'
  },
  {
    id: 6,
    name: 'Dr. Anna Reyes',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_153d9f203-1767417763187.png",
    specialization: 'MD, DPBP - Reproductive Endocrinology & Infertility',
    experience: '14 yrs experience',
    consultationTypes: ['Online Consultation', 'In-Person Consultation'],
    clinicName: 'Fertility & Wellness Center',
    clinicAddress: 'Pasig City, Metro Manila',
    schedule: 'Tomorrow, 10:00 AM - 04:00 PM',
    fee: '₱1,500.00'
  }];


  const filteredDoctors = searchQuery ?
  doctorsData?.filter((doctor) =>
  doctor?.clinicAddress?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
  doctor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
  doctor?.specialization?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  ) :
  doctorsData;

  return (
    <>
      <Helmet>
        <title>Clinics Near Me | PCOS Care</title>
        <meta name="description" content="Find experienced PCOS specialists and healthcare providers near you. Browse doctor profiles, specializations, and clinic locations." />
      </Helmet>

      <Sidebar isOpen={isSidebarOpen} />
      <HamburgerButton isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <BackButton isSidebarOpen={isSidebarOpen} />

      <main className="min-h-screen bg-background smooth-scroll ml-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Clinics Near Me
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
              Find experienced healthcare providers and PCOS specialists in your area. Browse through our network of qualified doctors and clinics.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 md:mb-12">
            <SearchBar
              placeholder="Search by location, doctor name, or specialization..."
              onSearch={handleSearch}
              className="max-w-2xl" />

          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDoctors?.length} {filteredDoctors?.length === 1 ? 'doctor' : 'doctors'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Doctor Cards Grid */}
          <div className="space-y-6">
            {filteredDoctors?.length > 0 ?
            filteredDoctors?.map((doctor) =>
            <DoctorCard key={doctor?.id} doctor={doctor} />
            ) :

            <div className="card-base text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No doctors found matching your search criteria.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Try adjusting your search terms or browse all available doctors.
                </p>
              </div>
            }
          </div>
        </div>

        <Footer />
      </main>
    </>);

};

export default ClinicsNearMe;