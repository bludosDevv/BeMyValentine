import React, { useState } from 'react';
import { SUCCESS_MESSAGES, LOVE_POEMS } from '../constants';
import { Heart, Sparkles, Stars, Cloud } from 'lucide-react';

const Success: React.FC = () => {
  const [randomMessage] = useState(() => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
  const [randomPoem] = useState(() => LOVE_POEMS[Math.floor(Math.random() * LOVE_POEMS.length)]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center overflow-hidden relative">
      {/* Background decorations - Blue/White Theme */}
      <div className="absolute top-10 left-10 text-sky-100 animate-pulse"><Cloud size={80} fill="currentColor" /></div>
      <div className="absolute bottom-20 right-10 text-blue-100 animate-bounce delay-100"><Heart size={60} fill="currentColor" /></div>
      <div className="absolute top-1/3 right-5 text-cyan-50"><Stars size={80} /></div>

      <div className="animate-bounce mb-8 relative z-10">
        <Heart className="w-32 h-32 text-sky-400 fill-sky-400 drop-shadow-xl" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-6 drop-shadow-sm z-10 tracking-tight font-serif">
        Yay!!! 💙
      </h1>
      
      <p className="text-xl md:text-3xl text-slate-600 font-medium mb-10 max-w-lg z-10">
        {randomMessage}
      </p>

      {/* Static Poem Section - Glassmorphic Card */}
      <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-lg w-full border border-white/60 transform hover:scale-[1.02] transition-transform z-10">
        <div className="flex items-center justify-center gap-3 mb-4 text-sky-400">
           <Sparkles size={20} />
           <span className="font-semibold text-xs uppercase tracking-[0.2em] text-slate-400">A Poem for You</span>
           <Sparkles size={20} />
        </div>
        
        <p className="text-lg md:text-xl text-slate-700 italic font-serif leading-relaxed whitespace-pre-wrap">
          {randomPoem}
        </p>
      </div>

      <div className="mt-12 flex gap-6 z-10 opacity-90">
        <div className="relative transform rotate-[-6deg] hover:rotate-0 transition-all duration-300">
          <img 
            src="https://images.unsplash.com/photo-1595123550441-d377e017de2d?q=80&w=400&auto=format&fit=crop" 
            alt="Blue flowers" 
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white/80 shadow-lg"
          />
        </div>
         <div className="relative transform rotate-[6deg] hover:rotate-0 transition-all duration-300 translate-y-4">
          <img 
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400&auto=format&fit=crop" 
            alt="Blue sky aesthetic" 
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white/80 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Success;