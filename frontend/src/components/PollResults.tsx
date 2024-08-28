import React from "react";

interface PollResultProps {
  results: { option: string; votes: number }[];
}

const PollResult: React.FC<PollResultProps> = ({ results }) => {
  return (
    <div>
      <h2>Poll Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.option}: {result.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollResult;
