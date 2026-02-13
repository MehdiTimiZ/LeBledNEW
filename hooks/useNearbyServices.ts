import { useState, useCallback } from 'react';

export interface NearbyPlace {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'doctor' | 'dentist';
  lat: number;
  lon: number;
  distance: number; // km
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}

interface GeoPosition {
  lat: number;
  lon: number;
}

// Use OpenStreetMap Overpass API (free, no API key needed)
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function mapAmenityToType(amenity: string): NearbyPlace['type'] {
  switch (amenity) {
    case 'hospital': return 'hospital';
    case 'clinic': case 'doctors': return 'clinic';
    case 'pharmacy': return 'pharmacy';
    case 'dentist': return 'dentist';
    default: return 'doctor';
  }
}

export function useNearbyServices() {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<GeoPosition | null>(null);

  const getUserLocation = useCallback((): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lon: position.coords.longitude };
          setUserPosition(pos);
          resolve(pos);
        },
        (err) => {
          reject(new Error(
            err.code === 1
              ? 'Location access denied. Please enable location in your browser settings.'
              : 'Unable to determine your location. Please try again.'
          ));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  const searchNearby = useCallback(async (radiusKm: number = 10) => {
    setLoading(true);
    setError(null);
    setPlaces([]);

    try {
      const pos = await getUserLocation();

      // Overpass QL query for health-related amenities within radius
      const radiusM = radiusKm * 1000;
      const query = `
        [out:json][timeout:15];
        (
          node["amenity"="hospital"](around:${radiusM},${pos.lat},${pos.lon});
          node["amenity"="clinic"](around:${radiusM},${pos.lat},${pos.lon});
          node["amenity"="doctors"](around:${radiusM},${pos.lat},${pos.lon});
          node["amenity"="pharmacy"](around:${radiusM},${pos.lat},${pos.lon});
          node["amenity"="dentist"](around:${radiusM},${pos.lat},${pos.lon});
          way["amenity"="hospital"](around:${radiusM},${pos.lat},${pos.lon});
          way["amenity"="clinic"](around:${radiusM},${pos.lat},${pos.lon});
        );
        out center body;
      `;

      const response = await fetch(OVERPASS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) throw new Error('Failed to fetch nearby services');

      const data = await response.json();

      const results: NearbyPlace[] = (data.elements || [])
        .filter((el: any) => el.tags?.name)
        .map((el: any) => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;
          return {
            id: String(el.id),
            name: el.tags.name,
            type: mapAmenityToType(el.tags.amenity),
            lat,
            lon,
            distance: haversineDistance(pos.lat, pos.lon, lat, lon),
            address: [el.tags['addr:street'], el.tags['addr:housenumber'], el.tags['addr:city']].filter(Boolean).join(', ') || undefined,
            phone: el.tags.phone || el.tags['contact:phone'] || undefined,
            website: el.tags.website || el.tags['contact:website'] || undefined,
            openingHours: el.tags.opening_hours || undefined,
          };
        })
        .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance);

      setPlaces(results);

      if (results.length === 0) {
        setError(`No health services found within ${radiusKm}km. Try increasing the radius.`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search nearby services');
    } finally {
      setLoading(false);
    }
  }, [getUserLocation]);

  return {
    places,
    loading,
    error,
    userPosition,
    searchNearby,
  };
}
