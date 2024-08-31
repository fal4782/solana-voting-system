import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VotingContract } from "../target/types/voting_contract";
import { assert } from "chai";
import { Keypair } from "@solana/web3.js"; 

describe("voting_contract", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.VotingContract as Program<VotingContract>;

  let pollTitle = "Test Poll from local wallet";
  let options = ["Option A", "Option B", "Option C"];
  let expiration = new anchor.BN(Date.now() / 1000 + 1800); // 30 min from now
  let pollDataPda: anchor.web3.PublicKey;
  let pollBump: number;
  let creatorWallet;
  let voterWallet: Keypair;

  // Before running tests, derive the PDA for the poll
  before(async () => {
    [pollDataPda, pollBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(pollTitle)],
      program.programId
    );

    creatorWallet = (program.provider as anchor.AnchorProvider).wallet;

    // Generate a separate wallet for voting
    voterWallet = Keypair.generate();

    // Airdrop SOL to voterWallet
    const airdropSignature = await program.provider.connection.requestAirdrop(
      voterWallet.publicKey,
      1e9 // 1 SOL
    );
    await program.provider.connection.confirmTransaction(airdropSignature);
  });

    it("Creates a poll!", async () => {
        const tx = await program.methods
        .createPoll(pollTitle, options, expiration)
        .accounts({
            pollData: pollDataPda,
            user: creatorWallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creatorWallet.payer]) // Ensure to sign with the creator's wallet
        .rpc();

        console.log("Create Poll Transaction Signature:", tx);

        const pollData = await program.account.pollData.fetch(pollDataPda);
        assert.equal(pollData.pollTitle, pollTitle);
        assert.deepEqual(pollData.options, options);
        assert.equal(pollData.isActive, true);
    });

//   it("Casts a vote!", async () => {
//     const candidateIndex = 1; // Voting for "Option 2"

//     // Ensure the voter is not the poll creator
//     const pollData = await program.account.pollData.fetch(pollDataPda);
//     assert.notEqual(
//       pollData.pollCreator.toString(),
//       voterWallet.publicKey.toString(),
//       "User should not be the poll creator"
//     );

//     // Cast the vote
//     const tx = await program.methods
//       .vote(pollTitle, candidateIndex)
//       .accounts({
//         pollData: pollDataPda,
//         user: voterWallet.publicKey,
//       })
//       .signers([voterWallet])
//       .rpc();

//     console.log("Vote Transaction Signature:", tx);

//     // Fetch and validate poll data after voting
//     const updatedPollData = await program.account.pollData.fetch(pollDataPda);
//     assert.equal(
//       updatedPollData.voteCounts[candidateIndex].toNumber(),
//       1,
//       "Vote count should be 1"
//     );
//   });

  it("Fails when user tries to vote on their own poll", async () => {
    const user = (program.provider as anchor.AnchorProvider).wallet;

    try {
      await program.methods
        .vote(pollTitle, 0) // Vote for "Option 1"
        .accounts({
          pollData: pollDataPda,
          user: user.publicKey,
        })
        .rpc();
      assert.fail("User should not be able to vote on their own poll");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "CannotVoteOnOwnPoll");
    }
  });

  it("Fails when voting with an invalid candidate index", async () => {
    try {
      await program.methods
        .vote(pollTitle, options.length) // Out of bounds index
        .accounts({
          pollData: pollDataPda,
          user: voterWallet.publicKey,
        })
        .signers([voterWallet])
        .rpc();
      assert.fail("Should not be able to vote with an invalid candidate index");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "InvalidCandidate");
    }
  });

  it("Fails to retrieve results before poll ends", async () => {
    try {
      await program.methods
        .getResults(pollTitle)
        .accounts({
          pollData: pollDataPda,
        })
        .rpc();
      assert.fail("Should not be able to retrieve results before poll ends");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "PollNotEnded");
    }
  });

  it("Fails when non-creator attempts to end the poll", async () => {
    const otherUser = Keypair.generate();

    // Airdrop SOL to the new user to cover transaction fees
    const airdropSignature = await program.provider.connection.requestAirdrop(
      otherUser.publicKey,
      1e9 // 1 SOL
    );
    await program.provider.connection.confirmTransaction(airdropSignature);

    try {
      await program.methods
        .endPoll(pollTitle)
        .accounts({
          pollData: pollDataPda,
          user: otherUser.publicKey,
        })
        .signers([otherUser])
        .rpc();
      assert.fail("Non-creator should not be able to end the poll");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "NotPollCreator");
    }
  });

//   it("Ends the poll!", async () => {
//     const user = (program.provider as anchor.AnchorProvider).wallet;

//     const tx = await program.methods
//       .endPoll(pollTitle)
//       .accounts({
//         pollData: pollDataPda,
//         user: creatorWallet.publicKey,
//       })
//       .rpc();

//     console.log("End Poll Transaction Signature:", tx);

//     const pollData = await program.account.pollData.fetch(pollDataPda);
//     assert.equal(pollData.isActive, false);
//   });

//   it("Gets poll results!", async () => {
//     const tx = await program.methods
//       .getResults(pollTitle)
//       .accounts({
//         pollData: pollDataPda,
//       })
//       .rpc();

//     console.log("Get Results Transaction Signature:", tx);

//     const pollData = await program.account.pollData.fetch(pollDataPda);
//     console.log("Poll Results:", pollData.voteCounts);

//     // Verify the vote counts
//     assert.equal(pollData.voteCounts[1].toNumber(), 1); // "Option 2" should have 1 vote
//   });

//   it("Fails when voting on an inactive poll", async () => {
//     // await program.methods
//     //   .endPoll(pollTitle)
//     //   .accounts({
//     //     pollData: pollDataPda,
//     //     user: creatorWallet.publicKey,
//     //   })
//     //   .rpc();

//     try {
//       await program.methods
//         .vote(pollTitle, 0)
//         .accounts({
//           pollData: pollDataPda,
//           user: voterWallet.publicKey,
//         })
//         .signers([voterWallet])
//         .rpc();
//       assert.fail("Should not be able to vote on an inactive poll");
//     } catch (err) {
//       if (err.error) {
//         assert.equal(err.error.errorCode.code, "PollNotActive");
//       } else {
//         assert.fail("Unexpected error structure or error was not thrown.");
//       }
//     }
//   });

//   it("Fails when voting after poll expiration", async () => {
//     // Create a unique poll for this test
//     const expiredPollTitle = "Expired Poll";
//     const newExpiration = new anchor.BN(Date.now() / 1000 - 10); // Expired 10 seconds ago

//     // Derive a new PDA for the unique poll
//     const [newPollDataPda, newPollBump] =
//       anchor.web3.PublicKey.findProgramAddressSync(
//         [Buffer.from(expiredPollTitle)],
//         program.programId
//       );

//     // Create the poll with an expiration in the past
//     await program.methods
//       .createPoll(expiredPollTitle, options, newExpiration)
//       .accounts({
//         pollData: newPollDataPda,
//         user: creatorWallet.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([creatorWallet.payer])
//       .rpc();

//     // Try to vote on the expired poll
//     try {
//       await program.methods
//         .vote(expiredPollTitle, 0)
//         .accounts({
//           pollData: newPollDataPda,
//           user: voterWallet.publicKey,
//         })
//         .signers([voterWallet])
//         .rpc();
//       assert.fail("Should not be able to vote after poll expiration");
//     } catch (err) {
//       if (err.error) {
//         assert.equal(err.error.errorCode.code, "PollNotActive");
//       } else {
//         assert.fail("Unexpected error structure or error was not thrown.");
//       }
//     }
//   });

  //   it("Fails when voting after poll expiration", async () => {
  //     expiration = new anchor.BN(Date.now() / 1000 - 10); // 10 seconds in the past

  //     // Update the poll with new expiration value
  //     await program.methods
  //       .createPoll(pollTitle, options, expiration)
  //       .accounts({
  //         pollData: pollDataPda,
  //         user: creatorWallet.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([creatorWallet.payer])
  //       .rpc();
  //     try {
  //       await program.methods
  //         .vote(pollTitle, 0)
  //         .accounts({
  //           pollData: pollDataPda,
  //           user: voterWallet.publicKey,
  //         })
  //         .signers([voterWallet])
  //         .rpc();
  //       assert.fail("Should not be able to vote after poll expiration");
  //     } catch (err) {
  //       console.log("Error is:", err);

  //       if (err.error) {
  //         assert.equal(err.error.errorCode.code, "PollNotActive");
  //       } else {
  //         assert.fail("Unexpected error structure or error was not thrown.");
  //       }
  //     }
  //   });
});
