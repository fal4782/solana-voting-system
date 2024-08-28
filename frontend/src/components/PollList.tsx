// components/PollList.tsx
import React from "react";
import { usePollData } from "../hooks/usePollData";
import PollItem from "./PollItem";

const PollList: React.FC = () => {
  const { polls, loading, error } = usePollData();

  if (loading) return <p>Loading polls...</p>;
  if (error) return <p>Error loading polls: {error}</p>;

  return (
    <div className="poll-list">
      {polls.length > 0 ? (
        polls.map((poll) => <PollItem key={poll.pollTitle} poll={poll} />)
      ) : (
        <p>No polls available.</p>
      )}
    </div>
  );
};

export default PollList;
