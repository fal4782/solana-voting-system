/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [expirationDays, setExpirationDays] = useState<number>(); // Default to empty so we can see the placeholder
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
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md bg-white">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Poll Title"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          autoFocus
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
              className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveOption(index)}
              className={`text-red-500 p-2 rounded-md border border-red-500 hover:bg-red-100 ${
                options.length <= 2 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={options.length <= 2}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Add Option
        </button>
        <input
          type="number"
          min="1"
          value={expirationDays}
          onChange={(e) => setExpirationDays(Number(e.target.value))}
          placeholder="Expiration (days)"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default PollForm;
