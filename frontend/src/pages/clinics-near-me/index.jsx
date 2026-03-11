import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import Sidebar from '../../components/ui/Sidebar';
import HamburgerButton from '../../components/ui/HamburgerButton';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';
import SearchBar from '../../components/ui/SearchBar';
import DoctorCard from './components/DoctorCard';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ClinicsNearMe = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  const API_BASE_URL = 'http://localhost:3001';

  // Fetch clinics from backend
  const fetchClinics = async (lat, lng, radius = 2000) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/nearby-clinics?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      const result = await response?.json();

      if (result?.ok) {
        setClinics(result?.data || []);
      } else {
        setError(result?.error || 'Failed to fetch clinics');
      }
    } catch (err) {
      console.error('Error fetching clinics:', err);
      setError('Unable to connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Geocode address using backend
  const geocodeAddress = async (address) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/geocode?q=${encodeURIComponent(address)}`
      );
      const result = await response?.json();

      if (result?.ok && result?.data) {
        setUserLocation({ lat: result?.data?.lat, lng: result?.data?.lng });
        await fetchClinics(result?.data?.lat, result?.data?.lng);
      } else {
        setError(result?.error || 'Address not found. Please try a different search.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error geocoding address:', err);
      setError('Unable to geocode address. Please try again.');
      setLoading(false);
    }
  };

  // Try to get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;x
          setUserLocation({ lat: latitude, lng: longitude });
          fetchClinics(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation denied:', err?.message);
          setLocationDenied(true);
          setError('Location permission denied — enter address to search.');
        }
      );
    } else {
      setLocationDenied(true);
      setError('Geolocation is not supported by your browser. Please enter an address.');
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddressSearch = () => {
    if (addressInput?.trim()) {
      geocodeAddress(addressInput?.trim());
    }
  };

  const handleRetryLocation = () => {
    setLocationDenied(false);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchClinics(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation denied:', err?.message);
          setLocationDenied(true);
          setError('Location permission denied — enter address to search.');
        }
      );
    }
  };

  // Filter clinics by search query
  const filteredClinics = searchQuery
    ? clinics?.filter((clinic) =>
        clinic?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        clinic?.address?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        clinic?.tags?.healthcare?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
    : clinics;

  return (
    <>
      <Helmet>
        <title>Clinics Near Me | PCOS Care</title>
        <meta name="description" content="Find experienced PCOS specialists and healthcare providers near you. Browse clinic profiles and locations using OpenStreetMap data." />
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
              Find healthcare providers and clinics in your area using OpenStreetMap data.
            </p>
          </div>

          {/* Location Denied - Address Input */}
          {locationDenied && (
            <div className="mb-8 p-6 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-start gap-3 mb-4">
                <Icon name="MapPin" size={24} className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    Enter Your Location
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Location permission denied. Please enter your address to find nearby clinics.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e?.target?.value)}
                  onKeyPress={(e) => e?.key === 'Enter' && handleAddressSearch()}
                  placeholder="Enter your address (e.g., Quezon City, Manila)"
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleAddressSearch} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button variant="outline" onClick={handleRetryLocation}>
                  <Icon name="MapPin" size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8 md:mb-12">
            <SearchBar
              placeholder="Search by clinic name, address, or specialty..."
              onSearch={handleSearch}
              className="max-w-2xl"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading nearby clinics...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="card-base bg-red-50 border-red-200 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={24} className="text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                  {error?.includes('server') && (
                    <p className="text-red-600 text-sm mt-1">
                      Make sure to run the backend server: <code className="bg-red-100 px-2 py-0.5 rounded">npm run server</code>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          {!loading && clinics?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredClinics?.length} {filteredClinics?.length === 1 ? 'clinic' : 'clinics'}
                {searchQuery && ` for "${searchQuery}"`}
                {userLocation && ` near your location`}
              </p>
            </div>
          )}

          {/* Clinics Grid */}
          {!loading && (
            <div className="space-y-6">
              {filteredClinics?.length > 0 ? (
                filteredClinics?.map((clinic) => (
                  <DoctorCard key={clinic?.place_id} clinic={clinic} />
                ))
              ) : (
                !error && (
                  <div className="card-base text-center py-12">
                    <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {searchQuery
                        ? 'No clinics found matching your search criteria.' :'No clinics found in your area.'}
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Try adjusting your search terms or searching a different location.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default ClinicsNearMe;