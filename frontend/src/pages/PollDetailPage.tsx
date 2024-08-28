import React, { useState, useEffect } from "react";
import { useProgram } from "../hooks/useProgram"; // Custom hook to interact with the smart contract
import EndPollButton from "../components/EndPollButton";
import PollResult from "../components/PollResults";

interface PollDetailsProps {
  pollId: string;
}

const PollDetails: React.FC<PollDetailsProps> = ({ pollId }) => {
  const { program, connection, findPollDataPDA } = useProgram();
  const [isEnding, setIsEnding] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [results, setResults] = useState<{ option: string; votes: number }[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [poll, setPoll] = useState<any>(null); 

  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const pollPDA = await findPollDataPDA(pollId);
        const pollData = await program.account.pollData.fetch(pollPDA);

        setPoll(pollData);

        // Check if the current user is the creator
        const creator = pollData.pollCreator.toBase58();
        const currentUserPublicKey = (
          await connection.getAccountInfo(program.provider.wallet.publicKey)
        )?.owner.toBase58();
        setIsCreator(creator === currentUserPublicKey);

        // Fetch results
        const resultsData = await program.methods
          .getResults(pollId)
          .accounts({
            pollData: pollPDA,
          })
          .rpc();

        setResults(resultsData);
      } catch (error) {
        console.error("Failed to fetch poll details", error);
      }
    };

    fetchPollDetails();
  }, [pollId, program, connection, findPollDataPDA]);

  const handleEndPoll = async () => {
    if (!isCreator) return;
    setIsEnding(true);
    try {
      const pollPDA = await findPollDataPDA(pollId);
      await program.methods
        .endPoll(pollId)
        .accounts({
          pollData: pollPDA,
          
        })
        .rpc();
      console.log("Poll ended successfully");
      // Optionally, refetch poll details to update the UI
    } catch (error) {
      console.error("Failed to end poll", error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div>
      <h1>Poll Details</h1>
      {/* Render poll details */}
      {poll && (
        <>
          <div>
            <h2>{poll.title}</h2>
            <p>Created by: {poll.creator.toBase58()}</p>
            <p>
              Expiration:{" "}
              {new Date(poll.expiration.toNumber() * 1000).toLocaleString()}
            </p>
          </div>
          <EndPollButton
            onEndPoll={handleEndPoll}
            isEnding={isEnding}
            isCreator={isCreator}
          />
          <PollResult results={results} />
        </>
      )}
    </div>
  );
};

export default PollDetails;
