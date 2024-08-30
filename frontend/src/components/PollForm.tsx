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
  const [expiration, setExpiration] = useState(86400);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(title, options.filter(Boolean), expiration);
      setAlert({ message: "Poll successfully created", type: "success" });
    } catch (error: any) {
      setAlert({
        message: `Error creating poll: ${error.message}`,
        type: "error",
      });
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
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${index + 1}`}
            className="w-full p-2 border rounded"
            required
          />
        ))}
        <button
          type="button"
          onClick={() => setOptions([...options, ""])}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Option
        </button>
        <input
          type="number"
          value={expiration}
          onChange={(e) => setExpiration(Number(e.target.value))}
          placeholder="Expiration (in seconds)"
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
