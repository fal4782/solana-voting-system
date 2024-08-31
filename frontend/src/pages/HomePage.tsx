/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/HomePage.tsx

interface Poll {
  title: string;
  publicKey: string;
  isActive: boolean;
  expiration: any;
  createdAt: any;
}

import React, { useEffect, useState } from "react";
import { useVotingContractInteractions } from "../hooks/useVotingContractInteractions";
import PollList from "../components/PollList";
import Header from "../components/Header";

const HomePage: React.FC = () => {
  const { listAllPolls } = useVotingContractInteractions();
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const allPolls = await listAllPolls();
        setPolls(allPolls.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, [listAllPolls]);

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-20 p-4">
        <h1 className="text-3xl font-bold mb-4">All Polls</h1>
        <PollList polls={polls} />
      </main>
    </div>
  );
};

export default HomePage;
