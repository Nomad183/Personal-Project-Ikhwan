
import React, { useState, useEffect } from 'react';
import { ViewState, Candidate, Voter } from './types';
import { INITIAL_CANDIDATES, INITIAL_VOTERS, APP_TITLE, APP_SUBTITLE } from './constants';
import AdminPanel from './components/AdminPanel';
import VoterPortal from './components/VoterPortal';
import LiveResults from './components/LiveResults';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOBBY');
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [voters, setVoters] = useState<Voter[]>(INITIAL_VOTERS);
  const [isVotingOpen, setIsVotingOpen] = useState(true);

  // Sync state with local storage for demo persistence
  useEffect(() => {
    const savedVoters = localStorage.getItem('uho_voters');
    const savedCandidates = localStorage.getItem('uho_candidates');
    const savedStatus = localStorage.getItem('uho_voting_status');
    
    if (savedVoters) setVoters(JSON.parse(savedVoters));
    if (savedCandidates) setCandidates(JSON.parse(savedCandidates));
    if (savedStatus) setIsVotingOpen(JSON.parse(savedStatus));
  }, []);

  const saveState = (newVoters: Voter[], newCandidates: Candidate[]) => {
    setVoters(newVoters);
    setCandidates(newCandidates);
    localStorage.setItem('uho_voters', JSON.stringify(newVoters));
    localStorage.setItem('uho_candidates', JSON.stringify(newCandidates));
  };

  const handleVote = (voterId: string, candidateId: string) => {
    const newVoters = voters.map(v => v.id === voterId ? { ...v, hasVoted: true, votedFor: candidateId } : v);
    const newCandidates = candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c);
    saveState(newVoters, newCandidates);
  };

  const addVoter = (nim: string) => {
    const exists = voters.some(v => v.nim.toUpperCase() === nim.toUpperCase());
    if (exists) {
      alert("NIM sudah terdaftar!");
      return;
    }
    const newVoters = [...voters, { id: `v-${Date.now()}`, nim: nim.toUpperCase(), hasVoted: false }];
    setVoters(newVoters);
    localStorage.setItem('uho_voters', JSON.stringify(newVoters));
  };

  const resetVotes = () => {
    const resetVoters = voters.map(v => ({ ...v, hasVoted: false, votedFor: undefined }));
    const resetCandidates = candidates.map(c => ({ ...c, votes: 0 }));
    saveState(resetVoters, resetCandidates);
  };

  const toggleVoting = () => {
    const newState = !isVotingOpen;
    setIsVotingOpen(newState);
    localStorage.setItem('uho_voting_status', JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-uho-green text-white py-6 px-4 shadow-lg border-b-4 border-uho-gold sticky top-0 z-40">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('LOBBY')}>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 border-2 border-uho-gold">
               <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="48" fill="#1A5319" />
                  <path d="M50 15 L85 35 L85 65 L50 85 L15 65 L15 35 Z" fill="none" stroke="#FFD700" strokeWidth="2" />
                  <text x="50" y="55" fontSize="35" textAnchor="middle" fill="#FFD700" fontWeight="bold">⚙️</text>
               </svg>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-lg md:text-xl font-black uppercase leading-tight tracking-tight">{APP_TITLE}</h1>
              <p className="text-xs md:text-sm text-uho-gold font-bold opacity-90">{APP_SUBTITLE}</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-1 md:gap-2">
            <button 
              onClick={() => setView('LOBBY')}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'LOBBY' ? 'bg-uho-gold text-uho-green' : 'hover:bg-white/10'}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => setView('RESULTS')}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${view === 'RESULTS' ? 'bg-uho-gold text-uho-green' : 'hover:bg-white/10'}`}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live Count
            </button>
            <button 
              onClick={() => setView('VOTING')}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'VOTING' ? 'bg-uho-gold text-uho-green' : 'hover:bg-white/10'}`}
            >
              E-Bilik
            </button>
            <button 
              onClick={() => setView('ADMIN')}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'ADMIN' ? 'bg-uho-gold text-uho-green' : 'hover:bg-white/10'}`}
            >
              Panel Admin
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {view === 'LOBBY' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
            <section className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-uho-green leading-tight">Masa Depan Teknik Dimulai dari <span className="text-uho-gold drop-shadow-sm">Satu Suara Anda.</span></h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Gunakan hak pilih Anda dengan bijak dan bertanggung jawab untuk kepemimpinan KMT UHO Konawe yang lebih baik, berintegritas, dan inovatif.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setView('VOTING')}
                  className="bg-uho-green text-white px-10 py-4 rounded-full font-bold text-xl hover:shadow-2xl hover:bg-opacity-90 transition-all flex items-center gap-3"
                >
                  <i className="fas fa-vote-yea"></i> MULAI MEMILIH
                </button>
                <button 
                  onClick={() => setView('RESULTS')}
                  className="bg-white text-uho-green border-2 border-uho-green px-8 py-4 rounded-full font-bold text-lg hover:bg-uho-green hover:text-white transition-all flex items-center gap-2"
                >
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  PANTAU LIVE COUNT
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-uho-green/10 rounded-xl flex items-center justify-center text-uho-green shrink-0">
                  <i className="fas fa-lock text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-uho-green">Privasi Terjamin</h4>
                  <p className="text-sm text-gray-500 mt-1">Pilihan Anda dienkripsi dan tidak akan pernah diketahui oleh siapapun.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-uho-green/10 rounded-xl flex items-center justify-center text-uho-green shrink-0">
                  <i className="fas fa-bolt text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-uho-green">Hasil Real-Time</h4>
                  <p className="text-sm text-gray-500 mt-1">Sistem menghitung suara secara otomatis dan transparan dalam waktu nyata.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-uho-green/10 rounded-xl flex items-center justify-center text-uho-green shrink-0">
                  <i className="fas fa-mobile-alt text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-uho-green">Akses Mudah</h4>
                  <p className="text-sm text-gray-500 mt-1">Berikan suara Anda kapan saja dan di mana saja melalui perangkat seluler.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'VOTING' && (
          <VoterPortal 
            candidates={candidates} 
            voters={voters} 
            onVote={handleVote} 
            isVotingOpen={isVotingOpen} 
          />
        )}

        {view === 'RESULTS' && (
          <LiveResults 
            candidates={candidates} 
            voters={voters} 
          />
        )}

        {view === 'ADMIN' && (
          <AdminPanel 
            candidates={candidates} 
            voters={voters} 
            onAddVoter={addVoter} 
            onResetVotes={resetVotes} 
            onToggleVoting={toggleVoting} 
            isVotingOpen={isVotingOpen} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-80 border-b border-white/10 pb-8 mb-8">
            <div className="text-center md:text-left">
               <h3 className="text-xl font-bold text-uho-gold">Komisi Pemilihan Mahasiswa</h3>
               <p className="text-sm text-gray-400 mt-1">Keluarga Mahasiswa Teknik (KMT) - UHO Konawe</p>
            </div>
            <div className="flex gap-6 text-2xl">
              <a href="#" className="hover:text-uho-gold transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-uho-gold transition-colors"><i className="fab fa-youtube"></i></a>
              <a href="#" className="hover:text-uho-gold transition-colors"><i className="fas fa-globe"></i></a>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
            &copy; 2024 E-Voting System. Dibuat khusus untuk KMT Universitas Halu Oleo Konawe.
          </p>
        </div>
      </footer>

      {/* Floating Action Button for Help (Using Gemini) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          title="Bantuan AI"
          className="w-14 h-14 bg-uho-gold text-uho-green rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all border-4 border-uho-green"
        >
          <i className="fas fa-robot"></i>
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
