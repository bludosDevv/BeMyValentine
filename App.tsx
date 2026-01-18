import React, { useState } from 'react';
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

export default App;