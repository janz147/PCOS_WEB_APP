const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory cache (10 minutes TTL)
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Middleware
app?.use(cors());
app?.use(express?.json());

// User-Agent for OSM API calls (respecting usage policy)
const USER_AGENT = 'PCOSCareApp/1.0 (https://pcoscare6001.builtwithrocket.new)';

// Helper: Get from cache or execute function
const getCached = (key, ttl = CACHE_TTL) => {
  const cached = cache?.get(key);
  if (cached && Date.now() - cached?.timestamp < ttl) {
    return cached?.data;
  }
  return null;
};

const setCache = (key, data) => {
  cache?.set(key, { data, timestamp: Date.now() });
};

// Helper: Build Overpass QL query
const buildOverpassQuery = (lat, lng, radius) => {
  return `
[out:json][timeout:25];
(
  node(around:${radius},${lat},${lng})[amenity=clinic];
  node(around:${radius},${lat},${lng})[amenity=doctors];
  node(around:${radius},${lat},${lng})[healthcare=clinic];
  node(around:${radius},${lat},${lng})[healthcare=surgery];
  node(around:${radius},${lat},${lng})[name~"obgyn|gynecologist|obstetrician",i];
  way(around:${radius},${lat},${lng})[amenity=clinic];
  way(around:${radius},${lat},${lng})[amenity=doctors];
  way(around:${radius},${lat},${lng})[healthcare=clinic];
  way(around:${radius},${lat},${lng})[healthcare=surgery];
  way(around:${radius},${lat},${lng})[name~"obgyn|gynecologist|obstetrician",i];
  relation(around:${radius},${lat},${lng})[amenity=clinic];
  relation(around:${radius},${lat},${lng})[amenity=doctors];
  relation(around:${radius},${lat},${lng})[healthcare=clinic];
  relation(around:${radius},${lat},${lng})[healthcare=surgery];
  relation(around:${radius},${lat},${lng})[name~"obgyn|gynecologist|obstetrician",i];
);
out center;
`;
};

// Helper: Parse Overpass response
const parseOverpassElement = (element) => {
  const tags = element?.tags || {};
  const lat = element?.lat || element?.center?.lat;
  const lon = element?.lon || element?.center?.lon;

  // Build address from addr:* tags
  let address = '';
  if (tags?.['addr:housenumber'] || tags?.['addr:street']) {
    const parts = [
      tags?.['addr:housenumber'],
      tags?.['addr:street'],
      tags?.['addr:city'],
      tags?.['addr:postcode']
    ]?.filter(Boolean);
    address = parts?.join(', ');
  } else if (tags?.['addr:full']) {
    address = tags?.['addr:full'];
  }

  return {
    place_id: `${element?.type}/${element?.id}`,
    name: tags?.name || tags?.operator || 'Unknown Clinic',
    address: address || 'Address not available',
    phone: tags?.phone || tags?.['contact:phone'] || null,
    website: tags?.website || tags?.['contact:website'] || null,
    opening_hours: tags?.opening_hours || null,
    tags: tags,
    location: { lat, lng: lon }
  };
};

// Endpoint: GET /api/nearby-clinics
app?.get('/api/nearby-clinics', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req?.query;

    // Validate required parameters
    if (!lat || !lng) {
      return res?.status(400)?.json({
        ok: false,
        error: 'Missing required parameters: lat and lng'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseInt(radius, 10);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
      return res?.status(400)?.json({
        ok: false,
        error: 'Invalid parameters: lat, lng, and radius must be numbers'
      });
    }

    // Check cache
    const cacheKey = `${latitude}|${longitude}|${searchRadius}`;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log('Returning cached results for:', cacheKey);
      return res?.json(cached);
    }

    // Build Overpass query
    const query = buildOverpassQuery(latitude, longitude, searchRadius);

    // Call Overpass API
    console.log('Fetching from Overpass API...');
    const overpassResponse = await axios?.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': USER_AGENT
        },
        timeout: 25000
      }
    );

    // Parse response
    const elements = overpassResponse?.data?.elements || [];
    const clinics = elements?.map(parseOverpassElement);

    const response = {
      ok: true,
      data: clinics
    };

    // Cache the result
    setCache(cacheKey, response);

    res?.json(response);
  } catch (error) {
    console.error('Error fetching nearby clinics:', error?.message);
    res?.status(500)?.json({
      ok: false,
      error: error?.response?.data?.remark || error?.message || 'Failed to fetch nearby clinics'
    });
  }
});

// Endpoint: GET /api/geocode
app?.get('/api/geocode', async (req, res) => {
  try {
    const { q } = req?.query;

    if (!q) {
      return res?.status(400)?.json({
        ok: false,
        error: 'Missing required parameter: q (address query)'
      });
    }

    // Check cache
    const cacheKey = `geocode:${q}`;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log('Returning cached geocode for:', q);
      return res?.json(cached);
    }

    // Call Nominatim API
    console.log('Geocoding address:', q);
    const nominatimResponse = await axios?.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          format: 'json',
          q: q,
          limit: 1
        },
        headers: {
          'User-Agent': USER_AGENT
        },
        timeout: 10000
      }
    );

    const results = nominatimResponse?.data;
    if (!results || results?.length === 0) {
      return res?.json({
        ok: false,
        error: 'Address not found'
      });
    }

    const firstResult = results?.[0];
    const response = {
      ok: true,
      data: {
        lat: parseFloat(firstResult?.lat),
        lng: parseFloat(firstResult?.lon),
        display_name: firstResult?.display_name
      }
    };

    // Cache the result
    setCache(cacheKey, response);

    res?.json(response);
  } catch (error) {
    console.error('Error geocoding address:', error?.message);
    res?.status(500)?.json({
      ok: false,
      error: error?.message || 'Failed to geocode address'
    });
  }
});

// Health check endpoint
app?.get('/health', (req, res) => {
  res?.json({ status: 'ok', timestamp: new Date()?.toISOString() });
});

// Start server
app?.listen(PORT, () => {
  console.log(`🚀 PCOS Care Backend Server running on port ${PORT}`);
  console.log(`📍 Nearby clinics endpoint: http://localhost:${PORT}/api/nearby-clinics`);
  console.log(`🗺️  Geocode endpoint: http://localhost:${PORT}/api/geocode`);
});
