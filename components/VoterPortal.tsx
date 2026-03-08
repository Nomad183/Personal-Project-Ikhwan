
import React, { useState, useEffect } from 'react';
import { Candidate, Voter } from '../types';
import { generateCandidateAnalysis } from '../services/geminiService';

interface VoterPortalProps {
  candidates: Candidate[];
  voters: Voter[];
  onVote: (voterId: string, candidateId: string) => void;
  isVotingOpen: boolean;
}

const VoterPortal: React.FC<VoterPortalProps> = ({ candidates, voters, onVote, isVotingOpen }) => {
  const [nimInput, setNimInput] = useState('');
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const voter = voters.find(v => v.nim.toUpperCase() === nimInput.trim().toUpperCase());
    
    if (!voter) {
      setError('NIM tidak ditemukan dalam daftar pemilih tetap (DPT).');
      return;
    }

    if (voter.hasVoted) {
      setError('Maaf, NIM Anda sudah digunakan untuk memberikan suara.');
      return;
    }

    if (!isVotingOpen) {
      setError('Pemilihan saat ini sedang ditutup oleh Admin.');
      return;
    }

    setError('');
    setCurrentVoter(voter);
  };

  const handleVoteSubmit = () => {
    if (currentVoter && selectedCandidate) {
      onVote(currentVoter.id, selectedCandidate);
      setCurrentVoter(null);
      setNimInput('');
      setSelectedCandidate(null);
      alert("Terima kasih! Suara Anda telah berhasil direkam secara anonim.");
    }
  };

  const loadAnalysis = async (candidate: Candidate) => {
    if (!aiAnalysis[candidate.id]) {
      const result = await generateCandidateAnalysis(candidate);
      setAiAnalysis(prev => ({ ...prev, [candidate.id]: result }));
    }
  };

  if (!currentVoter) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-uho-green rounded-full flex items-center justify-center mx-auto mb-4 text-uho-gold text-3xl">
            <i className="fas fa-id-card"></i>
          </div>
          <h2 className="text-2xl font-bold">Verifikasi Identitas</h2>
          <p className="text-gray-500 mt-2">Silahkan masukkan NIM Anda untuk memulai proses pemilihan.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nomor Induk Mahasiswa (NIM)</label>
            <input 
              type="text" 
              value={nimInput}
              onChange={(e) => setNimInput(e.target.value)}
              placeholder="Contoh: E1A120XXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-uho-green focus:border-uho-green outline-none transition-all uppercase"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-start gap-2 animate-bounce">
              <i className="fas fa-exclamation-circle mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-uho-green text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
          >
            Masuk Ke Bilik Suara
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-400">
          Sistem ini dienkripsi. Identitas Anda tidak akan dihubungkan dengan kandidat yang Anda pilih.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slideUp pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between bg-uho-green text-white p-6 rounded-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold">Halo, Rekan Teknik!</h2>
          <p className="opacity-80">NIM: {currentVoter.nim}</p>
        </div>
        <button onClick={() => setCurrentVoter(null)} className="text-sm underline hover:text-uho-gold transition-colors">Bukan saya? Keluar</button>
      </div>

      <div className="text-center bg-yellow-50 p-3 rounded-xl border border-yellow-200 text-yellow-800 text-sm font-medium">
        <i className="fas fa-mouse mr-2"></i> 
        Klik satu kali untuk memilih, kemudian <strong>Klik Dua Kali (Double Click)</strong> pada tombol pilihan untuk konfirmasi suara.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id}
            className={`relative group bg-white rounded-3xl overflow-hidden border-4 transition-all cursor-pointer ${selectedCandidate === candidate.id ? 'border-uho-green ring-4 ring-uho-green ring-opacity-20 transform scale-[1.02]' : 'border-transparent shadow-lg hover:shadow-2xl'}`}
            onClick={() => {
              setSelectedCandidate(candidate.id);
              loadAnalysis(candidate);
            }}
          >
            <div className="relative h-[300px]">
              <img src={candidate.imageUrl} alt={candidate.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute top-4 left-4 w-12 h-12 bg-uho-gold text-uho-green rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
                {candidate.number}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">{candidate.name}</h3>
                <p className="text-uho-gold font-medium">Calon Ketua KMT</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-uho-green uppercase tracking-wider text-xs mb-1">Visi</h4>
                <p className="text-gray-600 italic text-sm">"{candidate.vision}"</p>
              </div>
              <div>
                <h4 className="font-bold text-uho-green uppercase tracking-wider text-xs mb-1">Misi</h4>
                <p className="text-gray-700 text-sm line-clamp-3">{candidate.mission}</p>
              </div>

              {aiAnalysis[candidate.id] && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 mt-2 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-robot text-uho-green text-xs"></i>
                    <span className="text-[10px] font-bold text-uho-green uppercase">AI Insight</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">{aiAnalysis[candidate.id]}</p>
                </div>
              )}

              {selectedCandidate === candidate.id ? (
                <button 
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleVoteSubmit();
                  }}
                  className="w-full py-4 rounded-xl font-black text-white bg-uho-gold shadow-lg shadow-yellow-500/30 border-2 border-uho-green animate-pulse hover:animate-none flex flex-col items-center justify-center"
                >
                  <span className="text-uho-green">KANDIDAT TERPILIH</span>
                  <span className="text-[10px] text-uho-green/70">DOUBLE KLIK UNTUK KONFIRMASI</span>
                </button>
              ) : (
                <button 
                  className="w-full py-3 rounded-xl font-bold transition-all bg-gray-100 text-gray-400 group-hover:bg-uho-green/10 group-hover:text-uho-green"
                >
                  Pilih Kandidat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoterPortal;
