import React, { useState } from "react";
import { useProgram } from "../hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";

const CreatePollForm: React.FC = () => {
  const { program, findPollDataPDA } = useProgram(); // Use the custom hook to get the program
  const {publicKey} = useWallet()

  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [expiration, setExpiration] = useState<string>(""); // New state for expiration
  const [creating, setCreating] = useState(false);

  const handlePollTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPollTitle(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiration(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (creating) return; // Prevent multiple submissions

    setCreating(true);

    try {
      const expirationTimestamp = new Date(expiration).getTime() / 1000; // Convert to Unix timestamp

      // Initialize the poll with expiration timestamp
      const tx = await program.methods
        .createPoll(pollTitle, options, expirationTimestamp)
        .accounts({
          pollData: findPollDataPDA(pollTitle),
          user: publicKey?.toBase58(),
          systemProgram: program.programId,
        })
        
        .rpc();
      console.log("Transaction successful", tx);
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-poll-form">
      <h2>Create a New Poll</h2>
      <div>
        <label htmlFor="pollTitle">Poll Title:</label>
        <input
          type="text"
          id="pollTitle"
          value={pollTitle}
          onChange={handlePollTitleChange}
          required
        />
      </div>
      <div>
        <label>Options:</label>
        {options.map((option, index) => (
          <div key={index} className="option">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            <button type="button" onClick={() => removeOption(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption}>
          Add Option
        </button>
      </div>
      <div>
        <label htmlFor="expiration">Expiration Date/Time:</label>
        <input
          type="datetime-local"
          id="expiration"
          value={expiration}
          onChange={handleExpirationChange}
          required
        />
      </div>
      <button type="submit" disabled={creating}>
        {creating ? "Creating Poll..." : "Create Poll"}
      </button>
    </form>
  );
};

export default CreatePollForm;
