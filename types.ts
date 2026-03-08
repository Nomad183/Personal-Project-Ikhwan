
export interface Candidate {
  id: string;
  number: number;
  name: string;
  vision: string;
  mission: string;
  imageUrl: string;
  votes: number;
}

export interface Voter {
  id: string;
  nim: string;
  hasVoted: boolean;
  votedFor?: string;
}

export type ViewState = 'LOBBY' | 'VOTING' | 'ADMIN' | 'RESULTS';

export interface VotingState {
  candidates: Candidate[];
  voters: Voter[];
  isVotingOpen: boolean;
}
