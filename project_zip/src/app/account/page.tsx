'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Trophy, MapPin, Clock, DollarSign, Activity, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface Participant {
  id: string;
  huntId: string;
  status: string;
  progress: number;
  score: number;
  completedAt?: string;
  hunt: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    entryFee: number;
    prizePool: number;
  };
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockUser: UserProfile = {
      id: 'user123',
      email: 'john.doe@example.com',
      name: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z',
    };

    const mockParticipants: Participant[] = [
      {
        id: 'part1',
        huntId: 'hunt1',
        status: 'ACTIVE',
        progress: 65,
        score: 450,
        hunt: {
          title: 'Victoria BC Scavenger Hunt 2024',
          description: 'Discover the hidden gems of Victoria',
          startDate: '2024-07-01T09:00:00Z',
          endDate: '2024-07-31T18:00:00Z',
          entryFee: 5,
          prizePool: 1000,
        },
      },
    ];

    const mockPayments: Payment[] = [
      {
        id: 'pay1',
        amount: 5,
        status: 'COMPLETED',
        createdAt: '2024-01-15T10:35:00Z',
      },
    ];

    setUser(mockUser);
    setParticipants(mockParticipants);
    setPayments(mockPayments);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Please log in to view your account</p>
            <Button onClick={() => window.location.href = '/checkout'}>
              Login / Register
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="hunts" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>My Hunts</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Hunts</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{participants.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {participants.filter(p => p.status === 'ACTIVE').length} in progress
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {participants.reduce((sum, p) => sum + p.score, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all hunts
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${payments.reduce((sum, p) => sum + p.amount, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      On hunt entries
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{participant.hunt.title}</h4>
                            <p className="text-sm text-gray-600">
                              Progress: {participant.progress}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={participant.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {participant.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            Score: {participant.score}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="hunts" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>My Scavenger Hunts</CardTitle>
                  <CardDescription>
                    Track your progress and achievements in all your hunts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {participants.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No hunts yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Join your first scavenger hunt to get started!
                      </p>
                      <Button onClick={() => window.location.href = '/checkout'}>
                        Browse Hunts
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {participants.map((participant) => (
                        <div key={participant.id} className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold">{participant.hunt.title}</h3>
                              <p className="text-gray-600">{participant.hunt.description}</p>
                            </div>
                            <Badge variant={participant.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {participant.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                              <p className="font-semibold">{participant.score}</p>
                              <p className="text-sm text-gray-600">Points</p>
                            </div>
                            <div className="text-center">
                              <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                              <p className="font-semibold">{participant.progress}%</p>
                              <p className="text-sm text-gray-600">Complete</p>
                            </div>
                            <div className="text-center">
                              <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                              <p className="font-semibold">${participant.hunt.prizePool}</p>
                              <p className="text-sm text-gray-600">Prize Pool</p>
                            </div>
                            <div className="text-center">
                              <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                              <p className="font-semibold">
                                {new Date(participant.hunt.endDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">Ends</p>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${participant.progress}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              {participant.status === 'COMPLETED' 
                                ? `Completed on ${new Date(participant.completedAt!).toLocaleDateString()}`
                                : 'Keep going to complete the hunt!'
                              }
                            </p>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View all your transactions and payment status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No payments yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Your payment history will appear here once you make a purchase.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Scavenger Hunt Entry</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${payment.amount}</p>
                            <Badge 
                              variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}
                              className="mt-1"
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={user.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span>Email notifications for hunt updates</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span>SMS notifications for time-sensitive alerts</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span>Weekly progress summaries</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Privacy</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span>Show my name on leaderboards</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span>Allow others to see my progress</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline">Save Changes</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}