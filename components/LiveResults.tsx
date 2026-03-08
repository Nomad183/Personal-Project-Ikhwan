
import React from 'react';
import { Candidate, Voter } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface LiveResultsProps {
  candidates: Candidate[];
  voters: Voter[];
}

const LiveResults: React.FC<LiveResultsProps> = ({ candidates, voters }) => {
  const totalVoters = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

  const chartData = candidates.map(c => ({
    name: `Paslon ${c.number}`,
    fullName: c.name,
    votes: c.votes,
    percentage: votedCount > 0 ? ((c.votes / votedCount) * 100).toFixed(1) : 0
  }));

  const COLORS = ['#1A5319', '#FFD700', '#000000', '#4CAF50'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-black text-uho-green flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
            </span>
            LIVE COUNTING
          </h2>
          <p className="text-gray-500 font-medium">Hasil Perhitungan Suara KMT UHO Konawe</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-6 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suara Masuk</p>
            <p className="text-2xl font-black text-uho-green">{votedCount}</p>
          </div>
          <div className="text-center px-6 py-2 bg-uho-green text-white rounded-xl shadow-lg shadow-uho-green/20">
            <p className="text-[10px] font-bold text-uho-gold uppercase tracking-widest">Partisipasi</p>
            <p className="text-2xl font-black">{participationRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-50 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#666', fontSize: 14, fontWeight: 'bold'}}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#f8f8f8'}}
                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="votes" radius={[10, 10, 0, 0]} barSize={80}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList dataKey="votes" position="top" style={{ fill: '#1A5319', fontWeight: 'bold', fontSize: 20 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          {chartData.sort((a, b) => Number(b.votes) - Number(a.votes)).map((data, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${idx === 0 ? 'bg-uho-gold' : 'bg-gray-200'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">{data.name}</p>
                  <h3 className="text-lg font-bold text-uho-green">{data.fullName}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-uho-green">{data.percentage}%</p>
                  <p className="text-xs text-gray-400">{data.votes} Suara</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-uho-green transition-all duration-1000 ease-out"
                  style={{ width: `${data.percentage}%` }}
                ></div>
              </div>
              {idx === 0 && votedCount > 0 && (
                <div className="mt-4 flex items-center gap-2 text-uho-green font-bold text-xs bg-yellow-400/10 w-fit px-3 py-1 rounded-full border border-uho-gold/20">
                  <i className="fas fa-crown text-uho-gold"></i> UNGGUL SEMENTARA
                </div>
              )}
            </div>
          ))}
          
          <div className="bg-uho-green/5 p-6 rounded-2xl border border-dashed border-uho-green/20">
            <h4 className="text-sm font-bold text-uho-green mb-2 flex items-center gap-2">
              <i className="fas fa-info-circle"></i> Catatan Panitia
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hasil yang ditampilkan adalah perhitungan suara masuk secara otomatis dari sistem E-Bilik. Keputusan final tetap merujuk pada berita acara rapat pleno KPM KMT UHO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveResults;
