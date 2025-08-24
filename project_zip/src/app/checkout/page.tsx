'use client';

import { useState, useEffect } from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Loader2, ArrowLeft } from 'lucide-react';
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

export default function CheckoutPage() {
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError(err instanceof Error ? err.message : 'Failed to fetch hunt');
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
          <p className="text-gray-400 text-lg">Loading hunt information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-6">Error</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Background */}
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('/images/victoria-harbour-sunset.jpg')`,
            filter: 'brightness(0.3) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        
        {/* Navigation */}
        <div className="relative z-10 container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Join the Victoria BC
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Scavenger Hunt
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Complete your registration in just a few simple steps and begin your adventure
              </p>
            </motion.div>
            
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                  <CheckoutForm hunt={hunt} />
                </div>
              </div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                {
                  title: "Secure Payment",
                  description: "Your payment information is encrypted and secure"
                },
                {
                  title: "Instant Access",
                  description: "Get immediate access to the scavenger hunt upon registration"
                },
                {
                  title: "24/7 Support",
                  description: "Our team is here to help you throughout your adventure"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full"></div>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}