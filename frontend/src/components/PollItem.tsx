// components/PollItem.tsx
import React, { useState } from "react";
import useVote from "../hooks/useVote";
import { PollData } from "../types/types";

interface PollItemProps {
  poll: PollData;
}

const PollItem: React.FC<PollItemProps> = ({ poll }) => {
  const { vote } = useVote();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleVote = async () => {
    if (selectedOption !== null) {
      await vote(poll.pollTitle, selectedOption);
      setShowResults(true);
    }
  };

  const renderOptions = () => {
    return poll.options.map((option, index) => (
      <div key={index}>
        <input
          type="radio"
          id={`option-${index}`}
          name="poll-option"
          value={index}
          onChange={() => setSelectedOption(index)}
        />
        <label htmlFor={`option-${index}`}>{option}</label>
      </div>
    ));
  };

  const renderResults = () => {
    return (
      <div>
        <h4>Results:</h4>
        {poll.options.map((option, index) => (
          <div key={index}>
            {option}: {poll.voteCounts[index]} votes
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="poll-item">
      <h3>{poll.pollTitle}</h3>
      {poll.isActive ? (
        <>
          <div>{renderOptions()}</div>
          <button onClick={handleVote} disabled={selectedOption === null}>
            Vote
          </button>
          {showResults && renderResults()}
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default PollItem;
