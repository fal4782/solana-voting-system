import { PublicKey } from "@solana/web3.js";

export interface PollData {
  pollCreator: PublicKey;
  pollTitle: string;
  options: string[];
  voteCounts: number[];
  expiration: number;
  isActive: boolean;
  createdAt: number;
}
