import { useProgram } from "../context/ProgramContext";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  // Transaction
} from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export const useVotingContractInteractions = () => {
  const {
    program,
    // connection,
    findPollDataPDA,
  } = useProgram();
  const wallet = useWallet();

  const createPoll = async (
    pollTitle: string,
    options: string[],
    expirationInSeconds: number
  ) => {
    if (!wallet.publicKey) throw new Error("Wallet not connected");

    const pollDataPDA = findPollDataPDA(pollTitle);
    const expiration = new BN(
      Math.floor(Date.now() / 1000) + expirationInSeconds
    );

    try {
      const tx = await program.methods
        .createPoll(pollTitle, options, expiration)
        .accounts({
          pollData: pollDataPDA,
          user: wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      console.log("Poll created successfully. Transaction signature:", tx);
      return tx;
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  };

  const vote = async (pollTitle: string, candidateIndex: number) => {
    if (!wallet.publicKey) throw new Error("Wallet not connected");

    const pollDataPDA = findPollDataPDA(pollTitle);

    try {
      const tx = await program.methods
        .vote(pollTitle, candidateIndex)
        .accounts({
          pollData: pollDataPDA,
          user: wallet.publicKey,
        })
        .rpc();

      console.log("Vote cast successfully. Transaction signature:", tx);
      return tx;
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  };

  const endPoll = async (pollTitle: string) => {
    if (!wallet.publicKey) throw new Error("Wallet not connected");

    const pollDataPDA = findPollDataPDA(pollTitle);

    try {
      const tx = await program.methods
        .endPoll(pollTitle)
        .accounts({
          pollData: pollDataPDA,
          user: wallet.publicKey,
        })
        .rpc();

      console.log("Poll ended successfully. Transaction signature:", tx);
      return tx;
    } catch (error) {
      console.error("Error ending poll:", error);
      throw error;
    }
  };

  const getResults = async (pollTitle: string) => {
    const pollDataPDA = findPollDataPDA(pollTitle);

    try {
      const pollData = await program.account.pollData.fetch(pollDataPDA);
      return {
        title: pollData.pollTitle,
        options: pollData.options,
        voteCounts: pollData.voteCounts.map((count) => count.toNumber()),
        isActive: pollData.isActive,
        expiration: pollData.expiration.toNumber(),
        createdAt: pollData.createdAt.toNumber(),
      };
    } catch (error) {
      console.error("Error fetching poll results:", error);
      throw error;
    }
  };

  const listAllPolls = async () => {
    try {
      const allPollAccounts = await program.account.pollData.all();
      return allPollAccounts.map((account) => ({
        title: account.account.pollTitle,
        publicKey: account.publicKey.toString(),
      }));
    } catch (error) {
      console.error("Error listing all polls:", error);
      throw error;
    }
  };

  const getPollDetails = async (pollTitle: string) => {
    const pollDataPDA = findPollDataPDA(pollTitle);

    try {
      const pollData = await program.account.pollData.fetch(pollDataPDA);
      return {
        title: pollData.pollTitle,
        creator: pollData.pollCreator.toString(),
        options: pollData.options,
        voteCounts: pollData.voteCounts.map((count) => count.toNumber()),
        isActive: pollData.isActive,
        expiration: pollData.expiration.toNumber(),
        createdAt: pollData.createdAt.toNumber(),
      };
    } catch (error) {
      console.error("Error fetching poll details:", error);
      throw error;
    }
  };

  return {
    createPoll,
    vote,
    endPoll,
    getResults,
    listAllPolls,
    getPollDetails,
  };
};
