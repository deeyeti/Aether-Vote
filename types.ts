export interface VoteData {
  voterId: string;
  candidateId: string;
  timestamp: number;
}

export interface Block {
  index: number;
  timestamp: string;
  data: VoteData | "GENESIS";
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Candidate {
  id: string;
  name: string;
  description: string;
  votes: number;
}

export interface ElectionState {
  candidates: Candidate[];
  chain: Block[];
  hasVoted: boolean;
}

export enum Page {
  ONBOARDING = 'ONBOARDING',
  VOTING = 'VOTING',
  ADMIN = 'ADMIN',
}