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

  // NOTE: For quick testing we call Overpass directly from the frontend.
  // This is temporary — for production move this to a backend proxy to avoid CORS/rate-limit/UA issues.
  const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

  // Fetch clinics using a simple Overpass query (temporary direct frontend test)
  const fetchClinics = async (lat, lng, radius = 10000) => {
    setLoading(true);
    setError(null);
    try {
      // Simple Overpass QL: only nodes with amenity=clinic within radius
      const ql = `[out:json][timeout:25];(node(around:${radius},${lat},${lng})[amenity=clinic];node(around:${radius},${lat},${lng})[amenity=doctors];node(around:${radius},${lat},${lng})[healthcare=clinic];);out tags center;`;

      const body = new URLSearchParams();
      body.append('data', ql);

      const resp = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          // Note: browsers prevent setting a custom User-Agent. This call is for quick testing only.
        },
        body: body.toString()
      });

      if (!resp.ok) {
        throw new Error(`Overpass request failed: ${resp.status} ${resp.statusText}`);
      }

      const json = await resp.json();
      const elements = json?.elements || [];

      const mapped = elements.map((el) => {
        const tags = el.tags || {};
        const latVal = el.lat ?? el.center?.lat ?? null;
        const lonVal = el.lon ?? el.center?.lon ?? null;
        const addressParts = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean);
        const address = addressParts.length ? addressParts.join(', ') : (tags['addr:full'] || tags['address'] || null);

        return {
          place_id: `${el.type}/${el.id}`,
          name: tags.name || tags.operator || '(no name)',
          address,
          phone: tags.phone || tags['contact:phone'] || null,
          website: tags.website || tags['contact:website'] || null,
          opening_hours: tags.opening_hours || null,
          tags,
          location: latVal && lonVal ? { lat: latVal, lng: lonVal } : null
        };
      });

      setClinics(mapped);
    } catch (err) {
      console.error('Error fetching clinics:', err);
      setError('Failed to fetch clinic data. Try a smaller radius or try again.');
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  // Geocode address using Nominatim (direct quick test). For production use backend proxy.
  const geocodeAddress = async (address) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      const resp = await fetch(url, {
        headers: {
          // Nominatim requires identifying User-Agent in heavy usage; browsers will send their UA automatically.
          'Accept-Language': 'en'
        }
      });
      const data = await resp.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        await fetchClinics(parseFloat(lat), parseFloat(lon));
      } else {
        setError('Address not found. Please try a different search.');
      }
    } catch (err) {
      console.error('Error geocoding address:', err);
      setError('Unable to geocode address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Try to get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
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
      navigator.geolocation.getCurrentPosition(
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
        (clinic?.address || '').toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        (clinic?.tags?.healthcare || '').toLowerCase()?.includes(searchQuery?.toLowerCase())
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
