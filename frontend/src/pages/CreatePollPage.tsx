import React from "react";
import CreatePollForm from "../components/CreatePollForm"; // Adjust the import path as needed

const CreatePollPage: React.FC = () => {
  return (
    <div>
      <h1>Create a New Poll</h1>
      <CreatePollForm />
    </div>
  );
};

export default CreatePollPage;
