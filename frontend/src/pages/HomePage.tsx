// pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { useVotingContractInteractions } from "../hooks/useVotingContractInteractions";
import PollList from "../components/PollList";
import Header from "../components/Header";

const HomePage: React.FC = () => {
  const { listAllPolls } = useVotingContractInteractions();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const allPolls = await listAllPolls();
        setPolls(allPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, [listAllPolls]);

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Active Polls</h1>
        <PollList polls={polls} />
      </main>
    </div>
  );
};

export default HomePage;
