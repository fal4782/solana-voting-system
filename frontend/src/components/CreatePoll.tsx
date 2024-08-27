import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program, votingDataPDA } from "../anchor/setup";
import { SystemProgram } from "@solana/web3.js"; // Import SystemProgram

const CreatePoll = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [numOptions, setNumOptions] = useState<number>(2);

  const handleCreatePoll = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      // Check if the account exists
      const accountInfo = await connection.getAccountInfo(votingDataPDA);
      if (!accountInfo) {
        console.error(
          "VotingData account not found. Make sure it is initialized."
        );
      } else {
        console.log("VotingData account found.");
      }

      // Continue with the transaction
      const transaction = await program.methods
        .initialize(numOptions)
        .accounts({
          votingData: votingDataPDA,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      const transactionSignature = await sendTransaction(
        transaction,
        connection
      );
      console.log(`Transaction successful: ${transactionSignature}`);
      alert("Poll created successfully!");
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  };

  return (
    <div>
      <h2>Create Poll</h2>
      <input
        type="number"
        value={numOptions}
        onChange={(e) => setNumOptions(Number(e.target.value))}
        min={2}
        max={1000}
      />
      <button onClick={handleCreatePoll}>Create Poll</button>
    </div>
  );
};

export default CreatePoll;
