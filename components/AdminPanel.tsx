
import React, { useState } from 'react';
import { Candidate, Voter } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminPanelProps {
  candidates: Candidate[];
  voters: Voter[];
  onAddVoter: (nim: string) => void;
  onResetVotes: () => void;
  onToggleVoting: () => void;
  isVotingOpen: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  candidates, 
  voters, 
  onAddVoter, 
  onResetVotes, 
  onToggleVoting, 
  isVotingOpen 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [newNim, setNewNim] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Kata sandi salah. Silahkan hubungi sistem administrator.');
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNim.trim()) {
      onAddVoter(newNim.trim());
      setNewNim('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-uho-green text-uho-gold rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg rotate-3">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl font-bold text-uho-green">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-2">Area terbatas. Masukkan kredensial untuk melanjutkan.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password Administrator</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-uho-green outline-none transition-all"
            />
          </div>
          {loginError && (
            <p className="text-red-500 text-xs font-medium animate-pulse">{loginError}</p>
          )}
          <button 
            type="submit"
            className="w-full bg-uho-green text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md"
          >
            Buka Panel Kontrol
          </button>
        </form>
      </div>
    );
  }

  const totalVoters = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

  const chartData = candidates.map(c => ({
    name: `Paslon ${c.number}`,
    votes: c.votes
  }));

  const COLORS = ['#1A5319', '#FFD700', '#000000', '#4CAF50'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <i className="fas fa-chart-line text-uho-green"></i> Hasil Real-Time
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-600 font-medium">Total DPT</p>
            <p className="text-3xl font-bold text-uho-green">{totalVoters}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Sudah Memilih</p>
            <p className="text-3xl font-bold text-blue-800">{votedCount}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-600 font-medium">Partisipasi</p>
            <p className="text-3xl font-bold text-yellow-800">{participationRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-user-plus text-uho-green"></i> Tambah Daftar Pemilih (NIM)
          </h2>
          <form onSubmit={handleAdd} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newNim}
              onChange={(e) => setNewNim(e.target.value)}
              placeholder="Masukkan NIM (Contoh: E1A120xxx)"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-uho-green outline-none"
            />
            <button 
              type="submit"
              className="bg-uho-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Tambah
            </button>
          </form>

          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="pb-2 font-medium">NIM</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {voters.map((voter) => (
                  <tr key={voter.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-mono">{voter.nim}</td>
                    <td className="py-3">
                      {voter.hasVoted ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Sudah Memilih</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Belum Memilih</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-cogs text-uho-green"></i> Kontrol Sistem
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Status Pemilihan</p>
                <p className="text-sm text-gray-500">{isVotingOpen ? 'Voting sedang berlangsung' : 'Voting sedang ditutup'}</p>
              </div>
              <button 
                onClick={onToggleVoting}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${isVotingOpen ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
              >
                {isVotingOpen ? 'Tutup Voting' : 'Buka Voting'}
              </button>
            </div>
            
            <button 
              onClick={() => {
                if(confirm("Apakah Anda yakin ingin mereset semua data suara? Tindakan ini tidak dapat dibatalkan.")) {
                  onResetVotes();
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              <i className="fas fa-trash-alt"></i> Reset Database Suara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
