// components/VotingForm.tsx
import React, { useState } from "react";

interface VotingFormProps {
  options: string[];
  onVote: (candidateIndex: number) => void;
}

const VotingForm: React.FC<VotingFormProps> = ({ options, onVote }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption !== null) {
      onVote(selectedOption);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="radio"
            id={`option-${index}`}
            name="poll-option"
            value={index}
            checked={selectedOption === index}
            onChange={() => setSelectedOption(index)}
            className="mr-2"
          />
          <label htmlFor={`option-${index}`}>{option}</label>
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
        disabled={selectedOption === null}
      >
        Vote
      </button>
    </form>
  );
};

export default VotingForm;
