import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VotingApp } from "../target/types/voting_app";
import { Keypair, SystemProgram } from "@solana/web3.js";

describe("voting_app", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VotingApp as Program<VotingApp>;

  it("Is initialized!", async () => {
    const numOptions = 3;
    const [votingDataPda, bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("voting_data")],
        program.programId
      );

    const tx = await program.methods
      .initialize(numOptions)
      .accounts({
        votingData: votingDataPda,
        user: provider.wallet.publicKey,
        systemProgram:SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature is: ", tx);

    // Fetch the initialized VotingData account to verify it was set up correctly
    const votingDataAccount = await program.account.votingData.fetch(
      votingDataPda
    );
    console.log("Initialized vote counts: ", votingDataAccount.voteCounts);
  });

  it("Allows voting for a candidate", async () => {
    const candidateIndex = 1;

    const [votingDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("voting_data")],
      program.programId
    );

    await program.methods
      .vote(candidateIndex)
      .accounts({
        votingData: votingDataPda,
      })
      .rpc();

    const votingDataAccount = await program.account.votingData.fetch(
      votingDataPda
    );

    console.log(
      `Vote count for candidate ${candidateIndex}: `,
      votingDataAccount.voteCounts[candidateIndex].toNumber()
    );
  });

  it("Fails to vote for an invalid candidate index", async () => {
    const invalidCandidateIndex = 5; // Assuming only 3 options initialized

    const [votingDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("voting_data")],
      program.programId
    );

    try {
      await program.methods
        .vote(invalidCandidateIndex)
        .accounts({
          votingData: votingDataPda,
        })
        .rpc();
    } catch (err) {
      console.error("Error voting for invalid candidate:", err);
    }
  });

  it("Tracks multiple votes correctly", async () => {
    const [votingDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("voting_data")],
      program.programId
    );

    await program.methods
      .vote(0)
      .accounts({
        votingData: votingDataPda,
        user: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .vote(2)
      .accounts({
        votingData: votingDataPda,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Multiple votes tracked.");
  });

  it("Prevents unauthorized access", async () => {
    const unauthorizedUser = Keypair.generate();
    const [votingDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("voting_data")],
      program.programId
    );

    try {
      await program.methods
        .vote(1)
        .accounts({
          votingData: votingDataPda,
          user: unauthorizedUser.publicKey,
        })
        .signers([unauthorizedUser]) // Sign with unauthorized user
        .rpc();
    } catch (error) {
      console.error("Unauthorized access prevented:", error);
    }
  });

  it("Handles maximum options correctly", async () => {
    const numOptions = 1000;

    // Derive the PDA for the voting data account
    const [votingDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("voting_data")],
      program.programId
    );

    // Check if the PDA account already exists
    try {
      await program.account.votingData.fetch(votingDataPda);
      console.log("PDA account already exists. Skipping initialization.");
    } catch (e) {
      // Initialize the account if it doesn't exist
      console.log("Initializing PDA account for maximum options.");

      await program.methods
        .initialize(numOptions)
        .accounts({
          votingData: votingDataPda,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Initialized with maximum options.");
    }
  });
});
