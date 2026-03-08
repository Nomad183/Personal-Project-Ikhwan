
import React from 'react';

export const LOGO_URL = "https://raw.githubusercontent.com/username/repo/main/logo.png"; // Placeholder for the provided image
export const APP_TITLE = "Keluarga Mahasiswa Teknik UHO Konawe";
export const APP_SUBTITLE = "Sistem Pemilihan Elektronik (E-Voting)";

export const INITIAL_CANDIDATES = [
  {
    id: 'c1',
    number: 1,
    name: 'Andi Pratama',
    vision: 'Mewujudkan KMT UHO yang integratif dan inovatif di era digital.',
    mission: 'Peningkatan kompetensi teknis mahasiswa, mempererat solidaritas antar angkatan, dan optimalisasi sarana riset.',
    imageUrl: 'https://picsum.photos/seed/candidate1/400/500',
    votes: 0
  },
  {
    id: 'c2',
    number: 2,
    name: 'Siti Rahmawati',
    vision: 'KMT UHO sebagai wadah kolaborasi teknik yang progresif dan berdaya saing global.',
    mission: 'Mengembangkan kemitraan industri, program inkubasi startup teknik, dan transparansi organisasi.',
    imageUrl: 'https://picsum.photos/seed/candidate2/400/500',
    votes: 0
  }
];

export const INITIAL_VOTERS = [
  { id: 'v1', nim: 'E1A120001', hasVoted: false },
  { id: 'v2', nim: 'E1A120002', hasVoted: false },
  { id: 'v3', nim: 'E1A120003', hasVoted: false },
];
