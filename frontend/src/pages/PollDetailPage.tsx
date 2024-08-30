import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVotingContractInteractions } from "../hooks/useVotingContractInteractions";
import VotingForm from "../components/VotingForm";
import PollResults from "../components/PollResults";
import Header from "../components/Header";

const PollDetailPage: React.FC = () => {
  const { pollTitle } = useParams<{ pollTitle: string }>();
  const { getPollDetails, vote, endPoll } = useVotingContractInteractions();
  const [pollDetails, setPollDetails] = useState<any>(null);

  useEffect(() => {
    const fetchPollDetails = async () => {
      if (pollTitle) {
        try {
          const details = await getPollDetails(pollTitle);
          setPollDetails(details);
        } catch (error) {
          console.error("Error fetching poll details:", error);
        }
      }
    };

    fetchPollDetails();
  }, [pollTitle, getPollDetails]);

  const handleVote = async (candidateIndex: number) => {
    if (pollTitle) {
      try {
        await vote(pollTitle, candidateIndex);
        // Refresh poll details after voting
        const updatedDetails = await getPollDetails(pollTitle);
        setPollDetails(updatedDetails);
      } catch (error) {
        console.error("Error voting:", error);
      }
    }
  };

  const handleEndPoll = async () => {
    if (pollTitle) {
      try {
        await endPoll(pollTitle);
        // Refresh poll details after ending the poll
        const updatedDetails = await getPollDetails(pollTitle);
        setPollDetails(updatedDetails);
      } catch (error) {
        console.error("Error ending poll:", error);
      }
    }
  };

  if (!pollDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">{pollDetails.title}</h1>
        <p>Created by: {pollDetails.creator}</p>
        <p>
          Expiration: {new Date(pollDetails.expiration * 1000).toLocaleString()}
        </p>
        {pollDetails.isActive ? (
          <>
            <VotingForm options={pollDetails.options} onVote={handleVote} />
            <button
              onClick={handleEndPoll}
              className="mt-4 bg-red-500 text-white p-2 rounded"
            >
              End Poll
            </button>
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
