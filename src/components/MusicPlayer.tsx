/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';
import { Track } from '../types';

interface MusicPlayerProps {
  onTrackChange?: (track: Track) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onTrackChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    onTrackChange?.(currentTrack);
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          backgroundColor: currentTrack.color,
          opacity: isPlaying ? 0.15 : 0.05 
        }}
        className="absolute inset-0 transition-colors duration-1000 blur-3xl -z-10"
      />
      
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6">
        {/* Album Art */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-lg shadow-2xl border border-white/20"
            />
          </AnimatePresence>
          {isPlaying && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-1 rounded-lg blur-md -z-10"
              style={{ backgroundColor: currentTrack.color }}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className="text-xl font-bold truncate text-white uppercase tracking-wider font-sans">
                {currentTrack.title}
              </h3>
              <p className="text-white/60 text-sm font-mono uppercase">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-4 flex items-center gap-3">
            <Music size={14} className="text-white/40" />
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
              AI Generated Stream // 44.1kHz
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 mb-4">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full"
            style={{ backgroundColor: currentTrack.color }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="p-2 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-white/10"
          >
            {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} className="ml-1" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-white/30">
          <Volume2 size={16} />
          <div className="w-16 h-1 bg-white/10 rounded-full">
            <div className="w-2/3 h-full bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Decorative Lines */}
      <div className="absolute top-0 right-0 p-2 opacity-20">
         <div className="text-[8px] font-mono rotate-90 origin-right">PULSE_AUDIO_v4.2</div>
      </div>
    </div>
  );
};
