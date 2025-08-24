'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, ExternalLink, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  image?: string;
  clues?: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: number;
    points: number;
  }>;
}

interface InteractiveMapProps {
  locations: Location[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  onLocationSelect?: (location: Location) => void;
}

export default function InteractiveMap({ 
  locations, 
  centerLat = 48.4284, 
  centerLng = -123.3656, 
  zoom = 12,
  onLocationSelect 
}: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation access denied or unavailable');
        }
      );
    }
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect?.(location);
  };

  const generateMapUrl = () => {
    const bounds = locations.length > 0 
      ? `${Math.min(...locations.map(l => l.latitude))},${Math.min(...locations.map(l => l.longitude))},${Math.max(...locations.map(l => l.latitude))},${Math.max(...locations.map(l => l.longitude))}`
      : `${centerLat - 0.1},${centerLng - 0.1},${centerLat + 0.1},${centerLng + 0.1}`;
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${centerLat},${centerLng}`;
  };

  const getLocationColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Victoria BC Hunt Locations</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${centerLat},${centerLng}`, '_blank')}
              className="flex items-center space-x-1"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Interactive map showing all scavenger hunt locations. Click on locations for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Embedded Map */}
            <div className="w-full h-96 rounded-lg overflow-hidden border">
              <iframe
                src={generateMapUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Victoria BC Scavenger Hunt Map"
              />
            </div>

            {/* Location Markers Overlay */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
              <h4 className="font-semibold mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Locations ({locations.length})
              </h4>
              <div className="space-y-2">
                {locations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedLocation?.id === location.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">{location.name}</h5>
                        <p className="text-xs text-gray-600 mt-1">{location.address}</p>
                        {location.clues && location.clues.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            {location.clues.map((clue, clueIndex) => (
                              <div
                                key={clue.id}
                                className={`w-3 h-3 rounded-full ${getLocationColor(clue.difficulty)}`}
                                title={`Difficulty ${clue.difficulty} - ${clue.points} points`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {location.clues?.length || 0} clues
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`, '_blank');
                          }}
                          className="p-1 h-auto"
                        >
                          <Navigation className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* User Location Indicator */}
            {userLocation && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Your Location</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedLocation.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank')}
                  className="flex items-center space-x-1"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </Button>
              </CardTitle>
              <CardDescription>{selectedLocation.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{selectedLocation.description}</p>
              
              {selectedLocation.clues && selectedLocation.clues.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Available Challenges
                  </h5>
                  <div className="space-y-3">
                    {selectedLocation.clues.map((clue, index) => (
                      <div key={clue.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-medium">{clue.title}</h6>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {clue.points} pts
                            </Badge>
                            <div className={`w-3 h-3 rounded-full ${getLocationColor(clue.difficulty)}`} />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{clue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Location Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <MapPin className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{locations.length}</p>
              <p className="text-sm text-gray-600">Total Locations</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-2xl font-bold">
                {locations.filter(l => l.clues?.some(c => c.difficulty === 1)).length}
              </p>
              <p className="text-sm text-gray-600">Easy</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-2"></div>
              <p className="text-2xl font-bold">
                {locations.filter(l => l.clues?.some(c => c.difficulty === 2)).length}
              </p>
              <p className="text-sm text-gray-600">Medium</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className="text-2xl font-bold">
                {locations.filter(l => l.clues?.some(c => c.difficulty === 3)).length}
              </p>
              <p className="text-sm text-gray-600">Hard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}