import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Lock, ChevronRight, Box, Users, Activity } from 'lucide-react';
import { Background } from './components/Background';
import { Button } from './components/Button';
import { blockchain, BlockchainService } from './services/blockchain';
import { Page, Candidate, Block } from './types';

// --- Sub-components defined here for single-file XML simplicity, normally separated ---

const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-9xl font-black tracking-tighter text-black mb-4">
          AETHER
        </h1>
        <div className="overflow-hidden h-12 mb-12">
           <motion.p 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
            className="text-2xl font-light tracking-widest text-zinc-500"
          >
            SECURE. IMMUTABLE. FUTURE.
          </motion.p>
        </div>
       
        <Button onClick={onComplete} className="text-xl px-12 py-6">
          Enter System
        </Button>
      </motion.div>
    </motion.div>
  );
};

const VotingCard: React.FC<{ 
  candidate: Candidate; 
  onVote: (id: string) => void; 
  disabled: boolean 
}> = ({ candidate, onVote, disabled }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/50 backdrop-blur-md border border-zinc-200 p-8 cursor-pointer transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100"
      onClick={() => !disabled && onVote(candidate.id)}
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-4 h-4 rounded-full bg-sky-400 animate-pulse" />
      </div>
      
      <h3 className="text-4xl font-bold mb-2 tracking-tight">{candidate.name}</h3>
      <p className="text-zinc-600 mb-8 font-light leading-relaxed">{candidate.description}</p>
      
      <div className="flex justify-between items-end">
        <span className="text-6xl font-black text-zinc-200 group-hover:text-sky-200 transition-colors">
          {candidate.id.padStart(2, '0')}
        </span>
        <Button 
          variant="secondary" 
          disabled={disabled}
          className="text-sm px-6 py-2"
        >
          {disabled ? "Voted" : "Cast Vote"}
        </Button>
      </div>
    </motion.div>
  );
};

const AdminBlock: React.FC<{ block: Block }> = ({ block }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-4 border-l-4 border-black pl-6 py-2 relative"
    >
      <div className="absolute -left-[9px] top-6 w-4 h-4 bg-white border-4 border-sky-400 rounded-full" />
      <div className="font-mono text-xs text-sky-600 mb-1">HASH: {block.hash.substring(0, 24)}...</div>
      <div className="text-2xl font-bold flex items-center gap-2">
        BLOCK #{block.index}
        {block.index === 0 && <span className="text-xs bg-black text-white px-2 py-1 rounded">GENESIS</span>}
      </div>
      <div className="text-zinc-500 text-sm mt-1">
        PREV: {block.previousHash.substring(0, 24)}...
      </div>
      <div className="mt-2 p-3 bg-zinc-50 rounded font-mono text-xs overflow-x-auto">
        {JSON.stringify(block.data, null, 2)}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.ONBOARDING);
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: '1', name: 'Atlas Prime', description: 'Focusing on digital infrastructure and high-speed global connectivity.', votes: 0 },
    { id: '2', name: 'Nova Flux', description: 'Advocating for decentralized energy grids and renewable resource allocation.', votes: 0 },
    { id: '3', name: 'Cipher Zen', description: 'Privacy-first policies implementing zero-knowledge proof governance.', votes: 0 },
  ]);
  const [chain, setChain] = useState<Block[]>(blockchain.chain);
  const [hasVoted, setHasVoted] = useState(false);
  const [isMining, setIsMining] = useState(false);

  // Initialize candidates with existing votes if simulated
  useEffect(() => {
    // In a real app, we'd parse the chain to count votes here
    const updateCounts = () => {
      const newCandidates = [...candidates];
      blockchain.chain.forEach(block => {
        if (block.data !== "GENESIS") {
           const vote = block.data;
           const cand = newCandidates.find(c => c.id === vote.candidateId);
           if (cand) cand.votes++;
        }
      });
      setCandidates(newCandidates);
      setChain([...blockchain.chain]);
    };
    updateCounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMining]); // Update when mining finishes

  const handleVote = async (candidateId: string) => {
    if (hasVoted) return;
    setIsMining(true);
    
    // Simulate mining delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const voteData = {
      voterId: Math.random().toString(36).substring(7),
      candidateId,
      timestamp: Date.now()
    };
    
    await blockchain.addBlock(voteData);
    
    setHasVoted(true);
    setIsMining(false);
  };

  const Nav = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-12 py-8 pointer-events-none">
      <div className="pointer-events-auto cursor-pointer" onClick={() => setCurrentPage(Page.VOTING)}>
        <span className="text-xl font-black tracking-tighter mr-1">AETHER</span>
        <span className="text-sky-500 text-xl">VOTE</span>
      </div>
      <div className="pointer-events-auto flex gap-8">
        <button 
          onClick={() => setCurrentPage(Page.VOTING)} 
          className={`text-sm font-bold tracking-widest hover:text-sky-500 transition-colors ${currentPage === Page.VOTING ? 'text-black border-b-2 border-black' : 'text-zinc-400'}`}
        >
          VOTING
        </button>
        <button 
          onClick={() => setCurrentPage(Page.ADMIN)} 
          className={`text-sm font-bold tracking-widest hover:text-sky-500 transition-colors ${currentPage === Page.ADMIN ? 'text-black border-b-2 border-black' : 'text-zinc-400'}`}
        >
          LEDGER
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <Background />
      
      <AnimatePresence mode="wait">
        {currentPage === Page.ONBOARDING && (
          <Onboarding onComplete={() => setCurrentPage(Page.VOTING)} />
        )}
      </AnimatePresence>

      {currentPage !== Page.ONBOARDING && (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-12 lg:px-24">
          <Nav />
          
          <AnimatePresence mode="wait">
            {currentPage === Page.VOTING && (
              <motion.main 
                key="voting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
              >
                <div className="mb-16">
                  <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
                    CAST YOUR <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">DIGITAL VOICE</span>
                  </h2>
                  <p className="text-xl text-zinc-600 max-w-2xl font-light">
                    Transactions are cryptographically secured and verified by the distributed ledger. 
                    Once cast, your vote is immutable.
                  </p>
                </div>

                {isMining ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative w-24 h-24 mb-8">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-zinc-200 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-sky-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      />
                    </div>
                    <h3 className="text-2xl font-bold tracking-widest animate-pulse">MINING BLOCK...</h3>
                    <p className="font-mono text-zinc-400 mt-2">Solving Proof of Work Challenge</p>
                  </div>
                ) : hasVoted ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-sky-50 border border-sky-100 p-12 text-center rounded-2xl"
                  >
                    <Shield className="w-24 h-24 text-sky-400 mx-auto mb-6" />
                    <h3 className="text-4xl font-bold mb-4">VOTE SECURED</h3>
                    <p className="text-zinc-600 mb-8">Your transaction has been mined and added to the blockchain ledger.</p>
                    <Button variant="secondary" onClick={() => setCurrentPage(Page.ADMIN)}>
                      Verify on Ledger
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {candidates.map((c) => (
                      <VotingCard 
                        key={c.id} 
                        candidate={c} 
                        onVote={handleVote} 
                        disabled={false}
                      />
                    ))}
                  </div>
                )}
              </motion.main>
            )}

            {currentPage === Page.ADMIN && (
              <motion.main 
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1">
                    <div className="sticky top-32">
                      <h2 className="text-4xl font-black mb-8 tracking-tighter">LIVE RESULTS</h2>
                      <div className="space-y-6">
                        {candidates.map(c => (
                          <div key={c.id} className="bg-white border border-zinc-200 p-6 shadow-sm">
                            <div className="flex justify-between items-end mb-2">
                              <span className="font-bold text-lg">{c.name}</span>
                              <span className="text-4xl font-black text-sky-500">{c.votes}</span>
                            </div>
                            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(c.votes / Math.max(1, chain.length - 1)) * 100}%` }}
                                className="h-full bg-black"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 p-6 bg-black text-white">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-sky-400" /> 
                          NETWORK STATUS
                        </h3>
                        <div className="space-y-2 text-sm font-mono text-zinc-400">
                          <div className="flex justify-between">
                            <span>NODES ACTIVE:</span>
                            <span className="text-sky-400">12</span>
                          </div>
                          <div className="flex justify-between">
                            <span>LATEST HASH:</span>
                            <span className="truncate w-24">{chain[chain.length-1].hash}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>DIFFICULTY:</span>
                            <span className="text-white">2</span>
                          </div>
                          <div className="flex justify-between">
                            <span>STATUS:</span>
                            <span className="text-green-400">SECURE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <h2 className="text-4xl font-black mb-8 tracking-tighter flex items-center gap-4">
                      <Box className="w-8 h-8" />
                      BLOCKCHAIN LEDGER
                    </h2>
                    <div className="bg-white/80 backdrop-blur-lg p-8 border border-zinc-200 rounded-xl shadow-2xl shadow-sky-50/50">
                      {chain.slice().reverse().map((block) => (
                        <AdminBlock key={block.hash} block={block} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.main>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}