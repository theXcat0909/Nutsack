'use client';

import { useState, useEffect } from 'react';
import RealTimeLeaderboard from '@/components/leaderboard/RealTimeLeaderboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trophy, Users, Clock, ArrowLeft, Sparkles, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Hunt {
  id: string;
  title: string;
  description: string;
  entryFee: number;
  prizePool: number;
  prizeClaimed: boolean;
  maxParticipants: number;
  participantsCount: number;
}

export default function LeaderboardPage() {
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHunt = async () => {
      try {
        const response = await fetch('/api/hunts/active');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch hunt');
        }

        setHunt(data.hunt);
      } catch (err) {
        console.error('Error fetching hunt:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHunt();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (!hunt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-md border-white/10">
          <CardContent className="pt-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">
              No Active Hunt
            </h3>
            <p className="text-gray-400 mb-8">
              There are no active scavenger hunts at the moment.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('/images/victoria-aerial.jpg')`,
            filter: 'brightness(0.2) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Live Leaderboard</h1>
                <p className="text-gray-400">Victoria BC Scavenger Hunt</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <RealTimeLeaderboard huntId={hunt.id} />
          </div>

          {/* Hunt Info Sidebar */}
          <div className="space-y-6">
            {/* Hunt Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-xl">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
                    Hunt Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg text-white mb-3">{hunt.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{hunt.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Prize Pool</span>
                      <span className="font-semibold text-yellow-400">${hunt.prizePool}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Entry Fee</span>
                      <span className="font-semibold text-emerald-400">${hunt.entryFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Participants</span>
                      <span className="font-semibold text-blue-400">{hunt.participantsCount}/{hunt.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Status</span>
                      <span className="font-semibold">
                        {hunt.prizeClaimed ? (
                          <span className="text-red-400">Prize Claimed</span>
                        ) : (
                          <span className="text-green-400">Active</span>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* How to Participate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-xl">
                    <Target className="w-5 h-5 mr-2 text-cyan-400" />
                    How to Participate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    {[
                      { step: 1, text: `Register for the hunt for just $${hunt.entryFee}` },
                      { step: 2, text: "Visit locations and solve clues to earn points" },
                      { step: 3, text: "Track your progress on the live leaderboard" },
                      { step: 4, text: "Complete all challenges to win the $1000 prize!" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                          {item.step}
                        </div>
                        <p className="text-gray-300">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white" 
                    onClick={() => window.location.href = '/checkout'}
                  >
                    Join the Hunt
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Real-time Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-xl">
                    <Zap className="w-5 h-5 mr-2 text-purple-400" />
                    Live Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {[
                      { icon: "📊", text: "Real-time score updates" },
                      { icon: "📍", text: "Live progress tracking" },
                      { icon: "🏆", text: "Instant leaderboard rankings" },
                      { icon: "🎉", text: "Completion celebrations" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-lg">{feature.icon}</span>
                        <span className="text-gray-300">{feature.text}</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-auto"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prize Alert */}
            {hunt.prizeClaimed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white font-semibold">Hunt Completed!</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  The $1000 prize has been claimed. Stay tuned for the next scavenger hunt adventure!
                </p>
              </motion.div>
            )}

            {/* Current Prize */}
            {!hunt.prizeClaimed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white font-semibold">Prize Available</h3>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400 mb-2">${hunt.prizePool}</p>
                  <p className="text-gray-300 text-sm">
                    Be the first to complete all challenges and claim the grand prize!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}