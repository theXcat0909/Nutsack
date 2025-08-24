'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, User, Mail, Lock, DollarSign, Users, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckoutFormProps {
  hunt?: {
    id: string;
    title: string;
    description: string;
    entryFee: number;
    prizePool: number;
    prizeClaimed: boolean;
    maxParticipants: number;
    participantsCount: number;
  };
}

export default function CheckoutForm({ hunt }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      setStep(2);
      setSuccess('Registration successful! Please complete your payment.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hunt || !user) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: hunt.entryFee,
          huntId: hunt.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setSuccess('Payment successful! You are now registered for the scavenger hunt.');
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hunt) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6">
          <p className="text-center text-gray-400">No active hunt available</p>
        </CardContent>
      </Card>
    );
  }

  if (hunt.prizeClaimed) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Hunt Completed!</h3>
          <p className="text-gray-400 mb-6">
            The $1000 prize has already been claimed. Stay tuned for the next scavenger hunt!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
          >
            Return to Home
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {/* Hunt Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-2xl opacity-20"></div>
          <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">{hunt.title}</h2>
            <p className="text-gray-300 mb-6">{hunt.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold text-white">${hunt.entryFee}</p>
                <p className="text-sm text-gray-400">Entry Fee</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="font-semibold text-white">${hunt.prizePool}</p>
                <p className="text-sm text-gray-400">Prize Pool</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="font-semibold text-white">{hunt.participantsCount}/{hunt.maxParticipants}</p>
                <p className="text-sm text-gray-400">Participants</p>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="font-semibold text-white">Unlimited</p>
                <p className="text-sm text-gray-400">Time</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= stepNumber
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-20 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step > stepNumber ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-emerald-500/10 border-emerald-500/20">
          <AlertDescription className="text-emerald-200">{success}</AlertDescription>
        </Alert>
      )}

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-2xl">
                <User className="w-6 h-6 mr-3 text-emerald-400" />
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-400">
                Sign up to join the Victoria BC Scavenger Hunt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    required
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-400"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    required
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-400"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password: e.target.value })
                    }
                    required
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-400"
                    placeholder="Create a secure password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-2xl">
                <CreditCard className="w-6 h-6 mr-3 text-cyan-400" />
                Payment Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Secure payment processing for your scavenger hunt entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <Label htmlFor="cardName" className="text-white">Name on Card</Label>
                  <Input
                    id="cardName"
                    type="text"
                    value={paymentForm.cardName}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, cardName: e.target.value })
                    }
                    required
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-400"
                    placeholder="Enter name on card"
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, cardNumber: e.target.value })
                    }
                    required
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-white">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={paymentForm.expiryDate}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, expiryDate: e.target.value })
                      }
                      required
                      className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-white">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={paymentForm.cvv}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, cvv: e.target.value })
                      }
                      required
                      className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-400"
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300">Entry Fee:</span>
                    <span className="text-white font-semibold">${hunt.entryFee}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300">Processing Fee:</span>
                    <span className="text-white font-semibold">$0.00</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-emerald-400 font-bold text-lg">${hunt.entryFee}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay $${hunt.entryFee}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="pt-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Registration Complete!</h3>
              <p className="text-gray-300 mb-8 text-lg">
                You are now registered for the Victoria BC Scavenger Hunt. Get ready for an amazing adventure!
              </p>
              <div className="space-y-4 text-left max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Registration ID:</span>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    {user?.id?.slice(0, 8)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Hunt:</span>
                  <span className="text-white font-medium">{hunt.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="text-emerald-400 font-medium">${hunt.entryFee}</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => window.location.href = '/account'}
                  className="block w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Go to Your Account
                </button>
                <button
                  onClick={() => window.location.href = '/leaderboard'}
                  className="block w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-lg border border-white/10 transition-all duration-300"
                >
                  View Leaderboard
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}