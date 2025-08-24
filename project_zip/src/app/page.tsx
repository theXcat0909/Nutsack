'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Users, Trophy, Sparkles, Compass, Camera, Mountain, Waves } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Parallax effect for sections
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const sectionY = useTransform(sectionScroll, [0, 1], ["20%", "-20%"]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Parallax */}
      <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('/images/victoria-harbour-sunset.jpg')`,
              filter: 'brightness(0.7) contrast(1.1)'
            }}
          />
        </motion.div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [-30, 30, -30],
            rotate: [-5, 5, -5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl z-20"
        />
        <motion.div
          animate={{ 
            y: [30, -30, 30],
            rotate: [5, -5, 5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl z-20"
        />
        
        {/* Hero Content */}
        <motion.div 
          className="relative z-30 container mx-auto px-4 text-center"
          style={{ opacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm font-semibold bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Always Available
            </Badge>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Victoria BC
              </span>
              <br />
              <span className="text-white text-5xl md:text-7xl lg:text-8xl">
                Scavenger Hunt
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Embark on an extraordinary journey through Vancouver Island's most breathtaking locations. 
              Discover hidden secrets, solve ancient mysteries, and claim the ultimate prize.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <a href="/checkout">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:scale-105">
                Join the Hunt - $5
              </Button>
            </a>
            <a href="/leaderboard">
              <Button variant="outline" size="lg" className="px-12 py-6 text-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-500 transform hover:scale-105">
                View Live Leaderboard
              </Button>
            </a>
          </motion.div>
          
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <DollarSign className="w-10 h-10" />,
                title: "$1,000",
                subtitle: "Cash Prize",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: "1,000",
                subtitle: "Max Participants",
                color: "from-emerald-400 to-cyan-500"
              },
              {
                icon: <Compass className="w-10 h-10" />,
                title: "Unlimited",
                subtitle: "Time to Explore",
                color: "from-purple-400 to-pink-500"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:bg-white/15">
                  <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center text-white mb-6 mx-auto group-hover:rotate-12 transition-transform duration-500`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{stat.title}</h3>
                  <p className="text-gray-300 text-lg">{stat.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Prize Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[url('/images/rainforest-mystical.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Trophy className="w-4 h-4 mr-2" />
              Grand Prize
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              $1,000 Cash Prize
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Complete all challenges and claim the ultimate reward - available until someone wins!
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-3xl p-12 text-white border border-emerald-400/30">
                  <h3 className="text-3xl font-bold mb-8">What You Win</h3>
                  <ul className="space-y-6">
                    {[
                      "$1,000 cash prize",
                      "Exclusive Victoria BC merchandise",
                      "Feature on our Wall of Champions",
                      "VIP access to future events"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center"
                      >
                        <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
                        <span className="text-lg">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-2xl">
                    <Sparkles className="w-6 h-6 mr-3 text-emerald-400" />
                    Unforgettable Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    This isn't just a scavenger hunt - it's an adventure through Victoria's 
                    most iconic landmarks, hidden gems, and secret spots that even locals don't know about.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Solve puzzles, meet fellow adventurers, and create memories that will last a lifetime 
                    while exploring the beautiful capital of British Columbia.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-2xl">
                    <MapPin className="w-6 h-6 mr-3 text-cyan-400" />
                    Explore Victoria Like Never Before
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    From the historic Inner Harbour to the breathtaking Butchart Gardens, 
                    from hidden alleyways to panoramic viewpoints - discover Victoria in a whole new way.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Journey Section */}
      <section ref={sectionRef} className="relative py-32 bg-black overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: sectionY }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            <div className="bg-[url('/images/butchart-gardens-twilight.jpg')] bg-cover bg-center" />
            <div className="bg-[url('/images/west-coast-waves.jpg')] bg-cover bg-center" />
            <div className="bg-[url('/images/craigdarroch-castle.jpg')] bg-cover bg-center" />
          </div>
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black z-10" />
        
        <div className="relative z-20 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              A Visual Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore stunning locations across Vancouver Island
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Inner Harbour",
                description: "Historic waterfront with Parliament Buildings and Fairmont Empress"
              },
              {
                icon: <Mountain className="w-8 h-8" />,
                title: "Butchart Gardens",
                description: "World-famous floral displays and illuminated fountains"
              },
              {
                icon: <Waves className="w-8 h-8" />,
                title: "West Coast",
                description: "Dramatic coastline with rugged cliffs and crashing waves"
              },
              {
                icon: <Compass className="w-8 h-8" />,
                title: "Craigdarroch Castle",
                description: "Victorian-era castle with panoramic city views"
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Hidden Gems",
                description: "Secret spots known only to locals and explorers"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Mystical Forests",
                description: "Ancient rainforests with giant cedars and magical atmosphere"
              }
            ].map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/5 backdrop-blur-md border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:bg-white/10">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white mb-4">
                      {location.icon}
                    </div>
                    <CardTitle className="text-xl text-white">{location.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{location.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[url('/images/victoria-aerial.jpg')] bg-cover bg-center opacity-5" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              What Makes This Hunt Special
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the perfect blend of adventure, technology, and local culture
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Real-Time GPS Tracking",
                description: "Live location-based challenges that adapt as you explore the city",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Form teams or go solo - compete with friends and meet new people",
                gradient: "from-emerald-500 to-green-500"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Live Leaderboard",
                description: "Track your progress in real-time and see how you rank against others",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AR Enhanced Reality",
                description: "Augmented reality clues bring Victoria's history to life",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Compass className="w-8 h-8" />,
                title: "Explore at Your Pace",
                description: "Take your time discovering Victoria's secrets - no rush, just pure adventure",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Instant Rewards",
                description: "Earn points and unlock achievements as you complete each challenge",
                gradient: "from-red-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/5 backdrop-blur-md border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 group">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center text-white mb-4 group-hover:rotate-12 transition-transform duration-500`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <a href="/map">
              <Button variant="outline" size="lg" className="px-12 py-6 text-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-500 transform hover:scale-105">
                <MapPin className="w-6 h-6 mr-3" />
                Explore Hunt Locations
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="relative py-32 bg-gradient-to-br from-emerald-900 via-black to-cyan-900">
        <div className="absolute inset-0 bg-[url('/images/rainforest-mystical.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              Join Anytime
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Ready for the Adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the ultimate Victoria BC scavenger hunt experience - available until the $1000 prize is claimed!
            </p>
            
            <Card className="mb-12 bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-3xl text-white">Hunt Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">📅 Availability</h4>
                      <p className="text-gray-300">Always Open - Start Anytime</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">⏰ Duration</h4>
                      <p className="text-gray-300">Complete at Your Own Pace</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">📍 Starting Point</h4>
                      <p className="text-gray-300">Victoria Inner Harbour</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">💰 Entry Fee</h4>
                      <p className="text-gray-300">$5 CAD per person</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-2xl opacity-50"></div>
              <div className="relative bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl p-12 text-white border border-emerald-400/30">
                <h3 className="text-4xl font-bold mb-6">Only $5 to Join!</h3>
                <p className="text-xl mb-8 leading-relaxed">
                  For just $5, you get access to the ultimate Victoria BC adventure 
                  with a chance to win $1,000. The hunt continues until someone claims the grand prize!
                </p>
                <a href="/checkout">
                  <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-500 transform hover:scale-105">
                    Register Now - Join the Hunt
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-black">
        <div className="absolute inset-0 bg-[url('/images/victoria-harbour-sunset.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Your Adventure Awaits
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Don't miss your chance to be part of Victoria's most exciting scavenger hunt. 
              The clock is ticking, and the $1000 prize is waiting for its winner.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="/checkout">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:scale-105">
                  Start Your Journey - $5
                </Button>
              </a>
              <a href="/leaderboard">
                <Button variant="outline" size="lg" className="px-12 py-6 text-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-500 transform hover:scale-105">
                  Watch the Competition
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}