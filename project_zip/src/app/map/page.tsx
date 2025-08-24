'use client';

import { useState, useEffect } from 'react';
import InteractiveMap from '@/components/map/InteractiveMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, Navigation, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  image?: string;
  clues: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: number;
    points: number;
  }>;
}

interface Hunt {
  id: string;
  title: string;
  description: string;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  participantsCount: number;
}

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hunt data
        const huntResponse = await fetch('/api/hunts/active');
        const huntData = await huntResponse.json();

        if (huntResponse.ok) {
          setHunt(huntData.hunt);
        }

        // Mock locations data (in a real app, this would come from an API)
        const mockLocations: Location[] = [
          {
            id: '1',
            name: 'Inner Harbour',
            address: 'Inner Harbour, Victoria, BC',
            latitude: 48.4284,
            longitude: -123.3656,
            description: 'The heart of Victoria with stunning waterfront views and historic architecture. This iconic location features the magnificent Parliament Buildings, Fairmont Empress Hotel, and bustling seaplane activity.',
            clues: [
              {
                id: 'clue1',
                title: 'Harbour Secrets',
                description: 'Find the statue of Captain Cook and count the number of ships carved around its base.',
                difficulty: 1,
                points: 100,
              },
            ],
          },
          {
            id: '2',
            name: 'Butchart Gardens',
            address: '800 Benvenuto Ave, Brentwood Bay, BC V8M 1A8',
            latitude: 48.5655,
            longitude: -123.4735,
            description: 'World-famous gardens with breathtaking floral displays. These 55 acres of stunning gardens include the Sunken Garden, Rose Garden, Japanese Garden, and Italian Garden.',
            clues: [
              {
                id: 'clue2',
                title: 'Garden Maze',
                description: 'Navigate to the Rose Garden and find the oldest rose bush. What year was it planted?',
                difficulty: 2,
                points: 200,
              },
            ],
          },
          {
            id: '3',
            name: 'Craigdarroch Castle',
            address: '1050 Joan Crescent, Victoria, BC V8S 3L5',
            latitude: 48.4266,
            longitude: -123.3384,
            description: 'Historic Victorian-era castle with panoramic city views. This 39-room mansion was built in the 1890s and offers a glimpse into the lavish lifestyle of coal baron Robert Dunsmuir.',
            clues: [
              {
                id: 'clue3',
                title: 'Castle Tower',
                description: 'Climb to the top of the castle and count the number of steps. How many windows face the harbor?',
                difficulty: 3,
                points: 300,
              },
            ],
          },
          {
            id: '4',
            name: 'Beacon Hill Park',
            address: '200 Douglas St, Victoria, BC V8V 2P4',
            latitude: 48.4167,
            longitude: -123.3500,
            description: 'Victoria\'s largest and most beloved park, featuring beautiful gardens, walking trails, and the famous Beacon Hill Children\'s Farm.',
            clues: [
              {
                id: 'clue4',
                title: 'Giant Totem Pole',
                description: 'Find the world\'s tallest totem pole and identify the animals carved into it.',
                difficulty: 1,
                points: 150,
              },
            ],
          },
          {
            id: '5',
            name: 'Fisherman\'s Wharf',
            address: '1 Dallas Rd, Victoria, BC V8V 1A8',
            latitude: 48.4156,
            longitude: -123.3744,
            description: 'A colorful floating home community with unique shops, restaurants, and sea lion viewing opportunities.',
            clues: [
              {
                id: 'clue5',
                title: 'Floating Homes',
                description: 'Count the number of brightly colored floating homes and find the one with the dragon decoration.',
                difficulty: 2,
                points: 180,
              },
            ],
          },
        ];

        setLocations(mockLocations);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleDownloadMap = () => {
    // In a real app, this would generate a downloadable map
    const mapData = {
      title: 'Victoria BC Scavenger Hunt Map',
      locations: locations.map(loc => ({
        name: loc.name,
        address: loc.address,
        coordinates: `${loc.latitude}, ${loc.longitude}`,
      })),
      generated: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'victoria-bc-scavenger-hunt-map.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareMap = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Victoria BC Scavenger Hunt Map',
        text: 'Check out these amazing scavenger hunt locations in Victoria BC!',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Map link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Interactive Map</h1>
                <p className="text-gray-600">Victoria BC Scavenger Hunt Locations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadMap}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareMap}
                className="flex items-center space-x-1"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hunt Info Bar */}
        {hunt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{hunt.title}</h2>
                    <p className="text-gray-600">{hunt.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">${hunt.prizePool}</p>
                      <p className="text-sm text-gray-600">Prize Pool</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{locations.length}</p>
                      <p className="text-sm text-gray-600">Locations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {locations.reduce((sum, loc) => sum + (loc.clues?.length || 0), 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Clues</p>
                    </div>
                    <Button onClick={() => window.location.href = '/checkout'}>
                      Join Hunt - ${hunt.entryFee}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Interactive Map */}
        <InteractiveMap
          locations={locations}
          centerLat={48.4284}
          centerLng={-123.3656}
          zoom={11}
          onLocationSelect={handleLocationSelect}
        />

        {/* Quick Location Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location Overview
              </CardTitle>
              <CardDescription>
                Quick summary of all scavenger hunt locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedLocation?.id === location.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-sm">{location.name}</h5>
                      <Badge variant="outline" className="text-xs">
                        {location.clues?.length || 0} clues
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{location.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {location.clues?.slice(0, 3).map((clue, clueIndex) => (
                          <div
                            key={clue.id}
                            className={`w-2 h-2 rounded-full ${
                              clue.difficulty === 1 ? 'bg-green-500' :
                              clue.difficulty === 2 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            title={`Difficulty ${clue.difficulty}`}
                          />
                        ))}
                        {(location.clues?.length || 0) > 3 && (
                          <span className="text-xs text-gray-500">+{(location.clues?.length || 0) - 3}</span>
                        )}
                      </div>
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}