// pages/CreatePollPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useVotingContractInteractions } from "../hooks/useVotingContractInteractions";
import PollForm from "../components/PollForm";
import Header from "../components/Header";

const CreatePollPage: React.FC = () => {
  const { createPoll } = useVotingContractInteractions();
  const navigate = useNavigate();

  const handleCreatePoll = async (
    title: string,
    options: string[],
    expirationInSeconds: number
  ) => {
    try {
      await createPoll(title, options, expirationInSeconds);
      navigate("/");
    } catch (error) {
      console.error("Error creating poll:", error);
      // The error will be displayed by the PollForm component
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Create a New Poll</h1>
        <PollForm onSubmit={handleCreatePoll} />
      </main>
    </div>
  );
};

export default CreatePollPage;
