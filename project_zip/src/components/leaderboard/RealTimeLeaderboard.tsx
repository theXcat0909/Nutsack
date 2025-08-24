'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  progress: number;
  rank: number;
}

interface RealTimeLeaderboardProps {
  huntId: string;
  currentUserId?: string;
}

export default function RealTimeLeaderboard({ huntId, currentUserId }: RealTimeLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState<{name: string, prizeClaimed: boolean} | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to leaderboard server');
      
      // Join hunt room
      newSocket.emit('join-hunt', huntId);
      
      // Request initial leaderboard
      newSocket.emit('request-leaderboard', huntId);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from leaderboard server');
    });

    // Listen for leaderboard updates
    newSocket.on('leaderboard-update', (data: { huntId: string; leaderboard: LeaderboardEntry[] }) => {
      if (data.huntId === huntId) {
        setLeaderboard(data.leaderboard);
      }
    });

    // Listen for progress updates
    newSocket.on('progress-update', (data: { userId: string; progress: number; score: number }) => {
      // Update local leaderboard state
      setLeaderboard(prev => {
        const updated = prev.map(entry => 
          entry.userId === data.userId 
            ? { ...entry, progress: data.progress, score: data.score }
            : entry
        );
        
        // Re-sort by score and progress
        return updated
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.progress - a.progress;
          })
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
      });
    });

    // Listen for hunt completion
    newSocket.on('hunt-completed', (data: { userId: string; userName: string; prizeClaimed: boolean }) => {
      console.log(`Hunt completed by ${data.userName}!`);
      if (data.prizeClaimed) {
        console.log('$1000 prize claimed!');
        setWinnerInfo({ name: data.userName, prizeClaimed: true });
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    });

    // Listen for hunt ending (prize claimed)
    newSocket.on('hunt-ended', (data: { huntId: string; winnerName: string }) => {
      console.log(`Hunt ended! Winner: ${data.winnerName}`);
      setWinnerInfo({ name: data.winnerName, prizeClaimed: true });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [huntId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-7 h-7 text-gray-300" />;
      case 3:
        return <Award className="w-7 h-7 text-amber-600" />;
      default:
        return <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold text-gray-300">
          {rank}
        </div>;
    }
  };

  const getRankBorder = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10';
      case 2:
        return 'border-gray-300/30 bg-gradient-to-r from-gray-400/10 to-gray-500/10';
      case 3:
        return 'border-amber-600/30 bg-gradient-to-r from-amber-500/10 to-amber-600/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  const getScoreColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-300';
      case 3:
        return 'text-amber-400';
      default:
        return 'text-emerald-400';
    }
  };

  const currentUserEntry = leaderboard.find(entry => entry.userId === currentUserId);

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && winnerInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-8 border border-yellow-400/30 max-w-md mx-4 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {winnerInfo.prizeClaimed ? 'Prize Claimed!' : 'Hunt Completed!'}
            </h2>
            <p className="text-xl text-gray-200 mb-2">
              {winnerInfo.name} has completed the scavenger hunt!
            </p>
            {winnerInfo.prizeClaimed && (
              <p className="text-2xl font-bold text-yellow-400 mb-6">
                $1000 Prize Won! 🎉
              </p>
            )}
            <p className="text-gray-400">
              The Victoria BC Scavenger Hunt has ended.
            </p>
          </motion.div>
        </div>
      )}

      <Card className="w-full bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span>Live Leaderboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time rankings for the Victoria BC Scavenger Hunt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current User's Position */}
          {currentUserEntry && currentUserEntry.rank > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {currentUserEntry.rank}
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-300">Your Position</p>
                    <p className="text-sm text-emerald-400/80">{currentUserEntry.userName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-300 text-lg">{currentUserEntry.score} pts</p>
                  <p className="text-sm text-emerald-400/80">{currentUserEntry.progress}%</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Top 3 Leaders */}
          <div className="space-y-4 mb-8">
            {leaderboard.slice(0, 3).map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${getRankBorder(entry.rank)} ${
                  entry.userId === currentUserId ? 'ring-2 ring-emerald-500/50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <p className={`font-bold text-lg ${
                        entry.userId === currentUserId ? 'text-emerald-300' : 'text-white'
                      }`}>
                        {entry.userName}
                        {entry.userId === currentUserId && (
                          <Badge variant="secondary" className="ml-3 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                            You
                          </Badge>
                        )}
                        {entry.rank === 1 && (
                          <Star className="inline-block w-4 h-4 text-yellow-400 ml-2" />
                        )}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                              entry.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                              entry.rank === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                              'bg-gradient-to-r from-emerald-400 to-cyan-400'
                            }`}
                            style={{ width: `${entry.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{entry.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-2xl ${getScoreColor(entry.rank)}`}>
                      {entry.score}
                    </p>
                    <p className="text-xs text-gray-400">points</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rest of Leaderboard */}
          {leaderboard.length > 3 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-300 mb-4 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-400" />
                Other Participants
              </h4>
              {leaderboard.slice(3).map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (index + 3) * 0.1 }}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                    entry.userId === currentUserId
                      ? 'border-emerald-500/30 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold text-gray-300">
                        {entry.rank}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          entry.userId === currentUserId ? 'text-emerald-300' : 'text-white'
                        }`}>
                          {entry.userName}
                          {entry.userId === currentUserId && (
                            <Badge variant="secondary" className="ml-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                              You
                            </Badge>
                          )}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-16 bg-white/10 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-400 to-cyan-400"
                              style={{ width: `${entry.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{entry.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{entry.score}</p>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <p className="text-gray-400 text-lg">No participants yet. Be the first to join!</p>
            </div>
          )}

          {/* Stats Summary */}
          {leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-2xl font-bold text-emerald-400">{leaderboard.length}</p>
                  <p className="text-sm text-gray-400">Total Players</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-2xl font-bold text-blue-400">
                    {Math.round(leaderboard.reduce((sum, entry) => sum + entry.progress, 0) / leaderboard.length)}%
                  </p>
                  <p className="text-sm text-gray-400">Avg Progress</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-2xl font-bold text-purple-400">
                    {Math.max(...leaderboard.map(entry => entry.score))}
                  </p>
                  <p className="text-sm text-gray-400">High Score</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </>
  );
}