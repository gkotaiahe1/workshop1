/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Track } from './types';
import { Activity, Zap, Shield, Cpu } from 'lucide-react';

export default function App() {
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ 
          background: activeTrack 
            ? `radial-gradient(circle at 50% 50%, ${activeTrack.color}15 0%, transparent 70%)`
            : 'radial-gradient(circle at 50% 50%, #ffffff05 0%, transparent 70%)'
        }}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Retro Scanline Effect */}
      <div className="scanline" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Branding & Status */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-8 order-2 lg:order-1"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
              Neon<span className="text-neon-cyan italic">Pulse</span>
            </h1>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-neon-cyan" />
              <div className="w-4 h-1 bg-white/20" />
              <div className="w-4 h-1 bg-white/20" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/40">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Cpu size={16} />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest">System Load: 24%</div>
            </div>
            <div className="flex items-center gap-3 text-white/40">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Shield size={16} />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest">Protocol: Verified</div>
            </div>
            <div className="flex items-center gap-3 text-white/40">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Zap size={16} className="text-neon-lime" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-neon-lime">Power: Optimal</div>
            </div>
            <div className="flex items-center gap-3 text-white/40">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Activity size={16} />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest">Latency: 12ms</div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
             <div className="text-[10px] font-mono text-white/20 mb-4 uppercase">User Interface Context</div>
             <p className="text-white/40 text-xs leading-relaxed uppercase font-mono">
               Combined recreational interface. Navigation strictly through keyboard or physical interaction.
             </p>
          </div>
        </motion.div>

        {/* Center Section: Snake Game */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 w-full"
        >
          <SnakeGame />
          
          <div className="mt-8 flex gap-8 items-center justify-center text-white/20">
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1 justify-center grow">
                <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-[10px]">W</div>
              </div>
              <div className="flex gap-1 justify-center">
                <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-[10px]">A</div>
                <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-[10px]">S</div>
                <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-[10px]">D</div>
              </div>
              <span className="text-[8px] uppercase tracking-widest mt-2">Navigation</span>
            </div>
            <div className="w-px h-12 bg-white/5" />
            <div className="text-center">
              <div className="text-lg font-black text-white/40 italic uppercase tracking-tighter">Enter</div>
              <span className="text-[8px] uppercase tracking-widest mt-2 block">Confirm</span>
            </div>
          </div>
        </motion.div>

        {/* Right Section: Music Player */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 space-y-6 order-3 w-full"
        >
          <div className="flex items-center justify-between mb-4">
             <div className="text-[10px] font-black uppercase text-white tracking-widest">Audio Hub</div>
             <div className="flex gap-1">
                <div className="w-1 h-3 bg-neon-cyan animate-pulse" />
                <div className="w-1 h-3 bg-neon-cyan/40 animate-pulse delay-75" />
                <div className="w-1 h-3 bg-neon-cyan/back animate-pulse delay-150" />
             </div>
          </div>
          
          <MusicPlayer onTrackChange={(track) => setActiveTrack(track)} />

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <div className="text-[10px] font-mono text-white/40 mb-3 uppercase tracking-widest">Visualizer Logic</div>
             <div className="flex items-end gap-1 h-12">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      height: activeTrack ? [
                        Math.random() * 100 + '%', 
                        Math.random() * 100 + '%', 
                        Math.random() * 100 + '%'
                      ] : '10%' 
                    }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                    className="flex-1 rounded-t-sm"
                    style={{ backgroundColor: activeTrack?.color || '#ffffff10' }}
                  />
                ))}
             </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Legal/System Text */}
      <footer className="mt-12 text-[8px] font-mono text-white/20 tracking-[0.4em] uppercase flex flex-wrap justify-center gap-x-8 gap-y-2 relative z-10 text-center">
         <span>Build: ARCX-99-ALPHA</span>
         <span>Security Level: Tier 1</span>
         <span>Neural Link: Active</span>
         <span>© 2026 Ghost Engine Systems</span>
      </footer>
    </div>
  );
}
