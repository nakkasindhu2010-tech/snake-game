import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'Cyber Synth AI',
    duration: '3:45',
    cover: 'https://picsum.photos/seed/synth/400/400',
  },
  {
    id: '2',
    title: 'Digital Pulse',
    artist: 'Neural Beats',
    duration: '4:12',
    cover: 'https://picsum.photos/seed/pulse/400/400',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Vapor Core',
    duration: '2:58',
    cover: 'https://picsum.photos/seed/grid/400/400',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="glass rounded-3xl p-6 w-full max-w-[350px] flex flex-col gap-6 relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-pink/20 blur-[80px] rounded-full group-hover:bg-neon-pink/30 transition-colors duration-700"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-cyan/20 blur-[80px] rounded-full group-hover:bg-neon-cyan/30 transition-colors duration-700"></div>

      <div className="relative">
        <div className="aspect-square rounded-2xl overflow-hidden neon-border-cyan mb-4 group-hover:scale-[1.02] transition-transform duration-500">
          <motion.img
            key={currentTrack.id}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5">
                    <Disc className="text-white/40" size={32} />
                  </div>
              </motion.div>
          )}
        </div>

        <div className="space-y-1">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={currentTrack.artist}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-sm font-medium"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
              style={{ width: `${progress}%` }}
              animate={{ width: isPlaying ? '100%' : `${progress}%` }}
              transition={{ duration: isPlaying ? 200 : 0.5, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/40 tracking-widest uppercase">
            <span>1:24</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrev}
            className="p-3 text-white/60 hover:text-neon-cyan transition-colors"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-neon-cyan hover:shadow-neon-cyan transition-all duration-300"
          >
            {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
          </motion.button>

          <button 
            onClick={handleNext}
            className="p-3 text-white/60 hover:text-neon-pink transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-white/40 pt-2 border-t border-white/5">
          <Volume2 size={16} />
          <div className="h-1 flex-1 bg-white/10 rounded-full">
            <div className="h-full w-2/3 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse"></div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/60">Audio Engine Online</span>
        </div>
      </div>
    </div>
  );
}
