import React, { useState, useRef } from 'react';
import { Heart, Cloud } from 'lucide-react';
import { BEGGING_MESSAGES } from '../constants';

interface ProposalProps {
  onAccept: () => void;
}

const Proposal: React.FC<ProposalProps> = ({ onAccept }) => {
  const [noBtnPosition, setNoBtnPosition] = useState<{ top: string; left: string; position: 'static' | 'fixed' }>({
    top: 'auto',
    left: 'auto',
    position: 'static',
  });
  const [beggingIndex, setBeggingIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const btnRef = useRef<HTMLButtonElement>(null);

  const moveNoButton = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnWidth = btnRef.current ? btnRef.current.offsetWidth : 120;
    const btnHeight = btnRef.current ? btnRef.current.offsetHeight : 60;
    const padding = 20;
    
    const maxLeft = viewportWidth - btnWidth - padding;
    const maxTop = viewportHeight - btnHeight - padding;
    
    const randomLeft = Math.max(padding, Math.floor(Math.random() * maxLeft));
    const randomTop = Math.max(padding, Math.floor(Math.random() * maxTop));

    setNoBtnPosition({
      position: 'fixed',
      top: `${randomTop}px`,
      left: `${randomLeft}px`,
    });

    setBeggingIndex((prev) => (prev + 1) % BEGGING_MESSAGES.length);
    setYesScale((prev) => Math.min(prev + 0.1, 4)); 
  };

  const handleNoInteraction = (e: React.SyntheticEvent) => {
    if (e.type === 'touchstart') {
      // prevent default if needed, but usually fine
    }
    moveNoButton();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Background clouds/decorations */}
      <div className="absolute top-10 left-10 text-blue-100 animate-pulse delay-100"><Cloud size={60} fill="currentColor" /></div>
      <div className="absolute top-1/3 right-10 text-sky-50 floating delay-200"><Cloud size={100} fill="currentColor" /></div>
      
      <div className="mb-10 relative z-10">
        {/* Blue Heart */}
        <Heart 
          className="text-sky-400 w-24 h-24 md:w-32 md:h-32 drop-shadow-xl fill-sky-400 floating" 
          strokeWidth={1.5}
        />
        <div className="absolute -top-4 -right-4">
           <Heart className="text-blue-300 w-8 h-8 fill-blue-300 animate-pulse delay-100" />
        </div>
        <div className="absolute top-12 -left-8">
           <Heart className="text-cyan-200 w-6 h-6 fill-cyan-200 animate-bounce delay-200" />
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-center text-slate-600 mb-12 drop-shadow-sm leading-tight z-10 tracking-wide font-serif">
        Will you be my Valentine?
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-md justify-center relative min-h-[100px] z-20">
        {/* Yes Button - Glassmorphic Blue */}
        <button
          onClick={onAccept}
          style={{ transform: `scale(${yesScale})` }}
          className="backdrop-blur-md bg-sky-400/20 hover:bg-sky-400/30 border border-sky-200/50 text-sky-600 font-bold py-3 px-10 rounded-full shadow-lg transition-transform duration-200 text-xl whitespace-nowrap active:scale-95"
        >
          Yes, I will! 💙
        </button>

        {/* No Button - Glassmorphic Soft Red/Gray */}
        <button
          ref={btnRef}
          className={`runaway-btn backdrop-blur-md bg-slate-200/40 hover:bg-slate-200/60 border border-slate-300/50 text-slate-500 font-bold py-3 px-8 rounded-full shadow-md text-xl whitespace-nowrap ${
            noBtnPosition.position === 'fixed' ? 'fixed' : 'relative'
          }`}
          style={{
            top: noBtnPosition.top,
            left: noBtnPosition.left,
            zIndex: 50,
          }}
          onMouseEnter={handleNoInteraction}
          onTouchStart={handleNoInteraction}
          onClick={handleNoInteraction}
        >
          {BEGGING_MESSAGES[beggingIndex]}
        </button>
      </div>
      
      <p className="mt-16 text-slate-400 text-sm opacity-60 z-0 font-light tracking-widest uppercase">
        (There is only one choice)
      </p>
    </div>
  );
};

export default Proposal;