// anchor/setup.ts
import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { VotingContract, IDL } from "./idl";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { Buffer } from "buffer";

const programId = new PublicKey("9zqibQV12PiGUAqQae8tmmyJvkjKEs6awPXKVhjJmSCc");
// const alchemyRpcUrl =
//   "https://solana-devnet.g.alchemy.com/v2/Mqr_YROBSQUn9PnKk5oP8jUKsGk7mT0r";
// const connection = new Connection(alchemyRpcUrl, "confirmed");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Initialize the program interface with the IDL, program ID, and connection.
export const program = new Program<VotingContract>(IDL, programId, {
  connection,
});

// Utility function to find PDA for a given poll title
export const findPollDataPDA = (pollTitle: string): PublicKey => {
  const [pollDataPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from(pollTitle)], // Seed for PDA is the poll title converted to bytes
    program.programId
  );
  return pollDataPDA;
};

// This is the TypeScript type for the PollData structure based on the IDL.
export type PollData = IdlAccounts<VotingContract>["pollData"];

// Example usage:
// const pda = findPollDataPDA("my_poll_title");
