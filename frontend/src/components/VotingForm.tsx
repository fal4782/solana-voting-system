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
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Choose an Option
        </h2>
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100"
          >
            <input
              type="radio"
              id={`option-${index}`}
              name="poll-option"
              value={index}
              checked={selectedOption === index}
              onChange={() => setSelectedOption(index)}
              className="mr-3 accent-blue-500 cursor-pointer"
            />
            <label
              htmlFor={`option-${index}`}
              className="text-gray-800 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          disabled={selectedOption === null}
        >
          Vote
        </button>
      </form>
    </div>
  );
};

export default VotingForm;
