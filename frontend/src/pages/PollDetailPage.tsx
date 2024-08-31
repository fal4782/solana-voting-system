/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVotingContractInteractions } from "../hooks/useVotingContractInteractions";
import { useWallet } from "@solana/wallet-adapter-react";
import VotingForm from "../components/VotingForm";
import PollResults from "../components/PollResults";
import Header from "../components/Header";
import Alert from "../components/Alert";

const PollDetailPage: React.FC = () => {
  const { pollTitle } = useParams<{ pollTitle: string }>();
  const { getPollDetails, vote, endPoll } = useVotingContractInteractions();
  const [pollDetails, setPollDetails] = useState<any>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { publicKey } = useWallet();

  useEffect(() => {
    const fetchPollDetails = async () => {
      if (pollTitle) {
        try {
          const details = await getPollDetails(pollTitle);
          setPollDetails(details);
        } catch (error: any) {
          console.error("Error fetching poll details:", error);
          setAlert({
            message: `Error fetching poll details: ${error.message}`,
            type: "error",
          });
        }
      }
    };

    fetchPollDetails();
  }, [pollTitle, getPollDetails]);

  const handleVote = async (candidateIndex: number) => {
    if (pollTitle) {
      try {
        await vote(pollTitle, candidateIndex);
        const updatedDetails = await getPollDetails(pollTitle);
        setPollDetails(updatedDetails);
        setAlert({ message: "Successfully voted", type: "success" });
      } catch (error: any) {
        console.error("Error voting:", error);
        setAlert({ message: `Error voting: ${error.message}`, type: "error" });
      }
    }
  };

  const handleEndPoll = async () => {
    if (pollTitle) {
      try {
        await endPoll(pollTitle);
        const updatedDetails = await getPollDetails(pollTitle);
        setPollDetails(updatedDetails);
        setAlert({ message: "Poll ended successfully", type: "success" });
      } catch (error: any) {
        console.error("Error ending poll:", error);
        setAlert({
          message: `Error ending poll: ${error.message}`,
          type: "error",
        });
      }
    }
  };

  if (!pollDetails) {
    return <div className="absolute top-1/2 right-1/2">Loading...</div>;
  }

  const isCreator = publicKey && pollDetails.creator === publicKey.toString();

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8 px-4">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <h1 className="text-3xl font-bold mb-4">{pollDetails.title}</h1>
        <p className="mb-2">Created by: {pollDetails.creator}</p>
        <p className="mb-4">
          Expiration: {new Date(pollDetails.expiration * 1000).toLocaleString()}
        </p>
        {pollDetails.isActive ? (
          <>
            <VotingForm options={pollDetails.options} onVote={handleVote} />
            {isCreator && (
              <button
                onClick={handleEndPoll}
                className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                End Poll
              </button>
            )}
          </>
        ) : (
          <PollResults
            options={pollDetails.options}
            voteCounts={pollDetails.voteCounts}
          />
        )}
      </main>
    </div>
  );
};

export default PollDetailPage;
