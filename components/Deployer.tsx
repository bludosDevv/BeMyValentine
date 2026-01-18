import React, { useState } from 'react';
import { Upload, Github, Loader2, Check } from 'lucide-react';

// Simplified Deployer for the uploaded version to avoid recursion
const DEPLOYER_CODE_FOR_UPLOAD = `import React from 'react';
export const Deployer = () => null;`;

const APP_FILES: Record<string, string> = {
  'package.json': `{
  "name": "be-my-valentine",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}`,
  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "*.ts", "*.tsx"]
}`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Will you be my Valentine?</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .runaway-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
        100% { transform: translateY(0px); }
      }
      .floating {
        animation: float 4s ease-in-out infinite;
      }
      .delay-100 { animation-delay: 1s; }
      .delay-200 { animation-delay: 2s; }
      
      /* Prevent scrolling when button runs away */
      body {
        overscroll-behavior: none;
      }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-700 antialiased overflow-hidden selection:bg-blue-100">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`,
  'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  'App.tsx': `import React, { useState } from 'react';
import { AppState } from './types';
import Proposal from './components/Proposal';
import Success from './components/Success';
import { Deployer } from './components/Deployer';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.ASKING);

  const handleAccept = () => {
    setAppState(AppState.ACCEPTED);
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100">
      {appState === AppState.ASKING ? (
        <Proposal onAccept={handleAccept} />
      ) : (
        <Success />
      )}
      <Deployer />
    </main>
  );
}

export default App;`,
  'types.ts': `export enum AppState {
  ASKING = 'ASKING',
  ACCEPTED = 'ACCEPTED'
}

export interface Position {
  x: number;
  y: number;
}`,
  'constants.ts': `export const BEGGING_MESSAGES = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely certain?",
  "This could be a mistake!",
  "Have a heart!",
  "Don't be so cold!",
  "Change of heart?",
  "Wouldn't you reconsider?",
  "Is that your final answer?",
  "You're breaking my heart ;(",
  "Plsss? :(",
  "Pretty please?",
  "I'll be sad...",
  "I'll be very sad...",
  "I'll be very very sad...",
  "I'll be very very very sad...",
  "Ok fine, I will stop asking...",
  "Just kidding, please say yes!",
  "I'll give you chocolate!",
  "I'll give you flowers!",
  "Pleaseeeeeeeeee"
];

export const SUCCESS_MESSAGES = [
  "Yay! I knew you would say yes!",
  "You've made me the happiest person!",
  "Best Valentine ever!",
  "I love you! 💙",
  "Let's make some memories!"
];

export const LOVE_POEMS = [
  "The sky is blue,\\nThe clouds are white,\\nYou make my world\\nShine so bright! 💙",
  "Like the ocean deep,\\nAnd the sky above,\\nYou are the one\\nI truly love! 🌊",
  "Roses are red,\\nViolets are blue,\\nI'm so happy\\nI chose you! ✨",
  "Sugar is sweet,\\nAnd so are you,\\nI'm the luckiest\\nTo have you! ☁️",
  "My heart is yours,\\nForever and true,\\nHappy Valentine's Day,\\nI love you! 💎"
];`,
  'services/geminiService.ts': `export {};`,
  'components/Proposal.tsx': `import React, { useState, useRef } from 'react';
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
      top: \`\${randomTop}px\`,
      left: \`\${randomLeft}px\`,
    });

    setBeggingIndex((prev) => (prev + 1) % BEGGING_MESSAGES.length);
    setYesScale((prev) => Math.min(prev + 0.1, 4)); 
  };

  const handleNoInteraction = (e: React.SyntheticEvent) => {
    if (e.type === 'touchstart') {
      // prevent default if needed
    }
    moveNoButton();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <div className="absolute top-10 left-10 text-blue-100 animate-pulse delay-100"><Cloud size={60} fill="currentColor" /></div>
      <div className="absolute top-1/3 right-10 text-sky-50 floating delay-200"><Cloud size={100} fill="currentColor" /></div>
      
      <div className="mb-10 relative z-10">
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
        <button
          onClick={onAccept}
          style={{ transform: \`scale(\${yesScale})\` }}
          className="backdrop-blur-md bg-sky-400/20 hover:bg-sky-400/30 border border-sky-200/50 text-sky-600 font-bold py-3 px-10 rounded-full shadow-lg transition-transform duration-200 text-xl whitespace-nowrap active:scale-95"
        >
          Yes, I will! 💙
        </button>

        <button
          ref={btnRef}
          className={\`runaway-btn backdrop-blur-md bg-slate-200/40 hover:bg-slate-200/60 border border-slate-300/50 text-slate-500 font-bold py-3 px-8 rounded-full shadow-md text-xl whitespace-nowrap \${
            noBtnPosition.position === 'fixed' ? 'fixed' : 'relative'
          }\`}
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

export default Proposal;`,
  'components/Success.tsx': `import React, { useState } from 'react';
import { SUCCESS_MESSAGES, LOVE_POEMS } from '../constants';
import { Heart, Sparkles, Stars, Cloud } from 'lucide-react';

const Success: React.FC = () => {
  const [randomMessage] = useState(() => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
  const [randomPoem] = useState(() => LOVE_POEMS[Math.floor(Math.random() * LOVE_POEMS.length)]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center overflow-hidden relative">
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

export default Success;`,
  'components/Deployer.tsx': DEPLOYER_CODE_FOR_UPLOAD
};

export const Deployer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleDeploy = async () => {
    const token = prompt("Enter your GitHub Personal Access Token (with 'repo' scope):");
    if (!token) return;

    setLoading(true);
    setStatus('idle');
    setMessage('Connecting to GitHub...');

    try {
      const REPO_NAME = 'BeMyValentine';
      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      };

      // 1. Create Repository (or get existing)
      let repoData;
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: REPO_NAME,
          description: "My Valentine Website",
          private: false,
          auto_init: false
        })
      });

      if (createRes.status === 422) {
        // Repo likely exists, fetch user to get owner name then construct URL
        const userRes = await fetch('https://api.github.com/user', { headers });
        const userData = await userRes.json();
        repoData = { owner: { login: userData.login }, name: REPO_NAME };
        setMessage('Repository exists. Updating files...');
      } else if (!createRes.ok) {
        throw new Error('Failed to create repository');
      } else {
        repoData = await createRes.json();
        setMessage('Repository created. Uploading files...');
      }

      // 2. Upload Files
      const owner = repoData.owner.login;
      
      for (const [path, content] of Object.entries(APP_FILES)) {
        setMessage(`Uploading ${path}...`);
        
        // Check if file exists to get SHA
        const checkRes = await fetch(`https://api.github.com/repos/${owner}/${REPO_NAME}/contents/${path}`, {
          headers
        });
        
        let sha: string | undefined;
        if (checkRes.ok) {
          const data = await checkRes.json();
          sha = data.sha;
        }

        // Encode content to Base64 (handle UTF-8)
        const contentEncoded = btoa(unescape(encodeURIComponent(content)));
        
        const putRes = await fetch(`https://api.github.com/repos/${owner}/${REPO_NAME}/contents/${path}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: `Update ${path}`,
            content: contentEncoded,
            sha: sha
          })
        });

        if (!putRes.ok) {
          console.error(`Failed to upload ${path}`);
        }
      }

      setStatus('success');
      setMessage(`Success! https://github.com/${owner}/${REPO_NAME}`);
      
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Deployment failed. Check token permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={handleDeploy}
        className="bg-white/50 hover:bg-white/90 text-slate-400 hover:text-blue-500 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm border border-transparent hover:border-blue-100"
        title="Deploy to GitHub"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : status === 'success' ? <Check className="w-4 h-4 text-green-500" /> : <Github className="w-4 h-4" />}
      </button>
      {message && (
        <div className="absolute bottom-10 right-0 bg-white/90 backdrop-blur-md p-2 rounded-lg text-xs w-48 shadow-lg border border-slate-100 text-slate-600 mb-2">
          {message}
        </div>
      )}
    </div>
  );
};