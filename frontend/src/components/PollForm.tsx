import React, { useState } from "react";

interface PollFormProps {
  onSubmit: (
    title: string,
    options: string[],
    expirationInSeconds: number
  ) => void;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiration, setExpiration] = useState(86400); // 1 day in seconds

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, options.filter(Boolean), expiration);
  };

  return (
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
        className="bg-blue-500 text-white p-2 rounded"
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
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Create Poll
      </button>
    </form>
  );
};

export default PollForm;
