// components/PollResults.tsx
import React from "react";

interface PollResultsProps {
  options: string[];
  voteCounts: number[];
}

const PollResults: React.FC<PollResultsProps> = ({ options, voteCounts }) => {
  const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Poll Results</h2>
      {options.map((option, index) => (
        <div key={index} className="bg-white p-4 rounded shadow">
          <p>{option}</p>
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
              style={{
                width: `${
                  totalVotes ? (voteCounts[index] / totalVotes) * 100 : 0
                }%`,
              }}
            >
              {voteCounts[index]} votes (
              {totalVotes
                ? ((voteCounts[index] / totalVotes) * 100).toFixed(2)
                : 0}
              %)
            </div>
          </div>
        </div>
      ))}
      <p className="font-bold">Total Votes: {totalVotes}</p>
    </div>
  );
};

export default PollResults;
