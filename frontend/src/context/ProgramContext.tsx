import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey, Commitment } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { VotingContract, IDL } from "../anchor/idl";
import { findPollDataPDA } from "../anchor/setup";

// Define context type
interface ProgramContextType {
  program: Program<VotingContract> | null;
  connection: Connection;
  findPollDataPDA: (pollTitle: string) => PublicKey;
}

// Create context
export const ProgramContext = createContext<ProgramContextType | undefined>(
  undefined
);

// Create provider component
export const ProgramProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed" as Commitment,
      });
      return new Program<VotingContract>(
        IDL,
        new PublicKey("9zqibQV12PiGUAqQae8tmmyJvkjKEs6awPXKVhjJmSCc"),
        provider
      );
    }
    return null;
  }, [connection, wallet]);

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
