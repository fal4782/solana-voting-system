import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { program, votingDataPDA, VotingData } from "../anchor/setup";

const PollDetail = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [pollData, setPollData] = useState<VotingData | null>(null);
  const [candidateIndex, setCandidateIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchPollData() {
      const data = await program.account.votingData.fetch(votingDataPDA);
      setPollData(data);
    }

    fetchPollData();

    const subscriptionId = connection.onAccountChange(
      votingDataPDA,
      (accountInfo) => {
        setPollData(
          program.coder.accounts.decode("votingData", accountInfo.data)
        );
      }
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection]);

  const handleVote = async () => {
    if (!publicKey || !signTransaction) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      await program.methods
        .vote(candidateIndex)
        .accounts({
          votingData: votingDataPDA,
          //   user: publicKey,
        })
        .rpc();

      alert("Vote cast successfully!");
    } catch (error) {
      console.error("Failed to cast vote:", error);
    }
  };

  return (
    <div>
      <h2>Poll Detail</h2>
      {pollData && (
        <>
          <p>Votes: {pollData.voteCounts.join(", ")}</p>
          <select
            value={candidateIndex}
            onChange={(e) => setCandidateIndex(Number(e.target.value))}
          >
            {pollData.voteCounts.map((_, index) => (
              <option key={index} value={index}>
                Candidate {index + 1}
              </option>
            ))}
          </select>
          <button onClick={handleVote}>Vote</button>
        </>
      )}
    </div>
  );
};

export default PollDetail;
