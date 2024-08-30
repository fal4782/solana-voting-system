// components/PollResults.tsx
import React from "react";

interface PollResultsProps {
  options: string[];
  voteCounts: number[];
}

const PollResults: React.FC<PollResultsProps> = ({ options, voteCounts }) => {
  const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Poll Results</h2>
      {options.map((option, index) => (
        <div key={index} className="bg-white p-4 rounded shadow">
          <p>{option}</p>
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
              style={{ width: `${(voteCounts[index] / totalVotes) * 100}%` }}
            >
              {voteCounts[index]} votes (
              {((voteCounts[index] / totalVotes) * 100).toFixed(2)}%)
            </div>
          </div>
        </div>
      ))}
      <p className="font-bold">Total Votes: {totalVotes}</p>
    </div>
  );
};

export default PollResults;
