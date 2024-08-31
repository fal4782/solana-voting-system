/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PollForm.tsx
import React, { useState } from "react";
import Alert from "./Alert";

interface PollFormProps {
  onSubmit: (
    title: string,
    options: string[],
    expirationInSeconds: number
  ) => Promise<void>;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expirationDays, setExpirationDays] = useState<number>(); // Default to 1 day
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expirationInSeconds = expirationDays! * 86400; // Convert days to seconds
    try {
      await onSubmit(title, options.filter(Boolean), expirationInSeconds);
      setAlert({ message: "Poll successfully created", type: "success" });
    } catch (error: any) {
      setAlert({
        message: `Error creating poll: ${error.message}`,
        type: "error",
      });
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Poll Title"
          className="w-full p-2 border rounded"
          required
        />
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${index + 1}`}
              className="flex-grow p-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveOption(index)}
              className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
              disabled={options.length <= 2}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Option
        </button>
        <input
          type="number"
          min="1"
          value={expirationDays}
          onChange={(e) => setExpirationDays(Number(e.target.value))}
          placeholder="Expiration (in days)"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default PollForm;
