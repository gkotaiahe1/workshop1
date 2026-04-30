/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Genesis',
    artist: 'AI Oracle',
    duration: 372,
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-62c0af47514a?q=80&w=1000&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#00FFFF', // Cyan
  },
  {
    id: '2',
    title: 'Neon Horizon',
    artist: 'Synth Drifter',
    duration: 415,
    coverUrl: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=1000&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#FF00FF', // Magenta
  },
  {
    id: '3',
    title: 'Pulse 2077',
    artist: 'Neural Network',
    duration: 298,
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#39FF14', // Lime
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;
