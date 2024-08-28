import React, { createContext, useContext, ReactNode } from "react";
import { Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { VotingContract, IDL } from "../anchor/idl";
import { findPollDataPDA } from "../anchor/setup";

// Define context type
interface ProgramContextType {
  program: Program<VotingContract>;
  connection: Connection;
  findPollDataPDA: (pollTitle: string) => PublicKey;
}

// Create context
export const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

// Create provider component
export const ProgramProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const programId = new PublicKey(
    "9zqibQV12PiGUAqQae8tmmyJvkjKEs6awPXKVhjJmSCc"
  );
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const program = new Program<VotingContract>(IDL, programId, {
    connection,
  });

  return (
    <ProgramContext.Provider value={{ program, connection, findPollDataPDA }}>
      {children}
    </ProgramContext.Provider>
  );
};

// Custom hook to use the ProgramContext
export const useProgram = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
};

