import React from "react";

interface PollResultsProps {
  options: string[];
  voteCounts: number[];
}

const PollResults: React.FC<PollResultsProps> = ({ options, voteCounts }) => {
  const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Poll Results</h2>
      {options.map((option, index) => {
        const percentage = totalVotes ? (voteCounts[index] / totalVotes) * 100 : 0;

        return (
          <div key={index} className="flex items-center space-x-4 p-2 border rounded-md bg-gray-50">
            <div className="flex-1">
              <p className="text-gray-800">{option}</p>
            </div>
            <div className="flex-1">
              <div className="w-full flex justify-center items-center bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 flex justify-center items-center text-xs font-semibold text-white text-center leading-none"
                  style={{ width: `${percentage}%`, height: '1.5rem' }}
                >
                  {voteCounts[index]} ({percentage.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <p className="text-lg font-semibold text-gray-900">Total Votes: {totalVotes}</p>
    </div>
  );
};

export default PollResults;
