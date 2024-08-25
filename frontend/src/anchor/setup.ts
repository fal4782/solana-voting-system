import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { VotingContract } from "./idl.types"; // Replace 'VotingContract' with the correct name from your IDL
import { IDL } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const programId = new PublicKey("AFeMMkA1C8ptiyAvP7tktUzbjXJrteksDYS2wEg81u6");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Initialize the program interface with the IDL, program ID, and connection.
export const program = new Program<VotingContract>(IDL, programId, {
  connection,
});

// Replace 'poll' with 'voting_data' as it's the correct seed for your voting contract
export const [votingDataPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("voting_data")],
  program.programId
);

// This is just a TypeScript type for the VotingData structure based on the IDL
// We need this so TypeScript doesn't yell at us
export type VotingData = IdlAccounts<VotingContract>["votingData"]; // Replace 'poll' with 'votingData'
