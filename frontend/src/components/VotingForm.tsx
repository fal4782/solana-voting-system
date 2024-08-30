/* eslint-disable @typescript-eslint/no-explicit-any */
// components/VotingForm.tsx
import React, { useState } from "react";
import Alert from "./Alert";

interface VotingFormProps {
  options: string[];
  onVote: (candidateIndex: number) => Promise<void>;
}

const VotingForm: React.FC<VotingFormProps> = ({ options, onVote }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption !== null) {
      try {
        await onVote(selectedOption);
        setAlert({ message: "Successfully voted", type: "success" });
      } catch (error: any) {
        setAlert({ message: `Error voting: ${error.message}`, type: "error" });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={selectedOption === null}
        >
          Vote
        </button>
      </form>
    </div>
  );
};

export default VotingForm;
