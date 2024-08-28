// hooks/usePollData.ts
import { useState, useEffect } from "react";
import { useProgram } from "./useProgram";
import { PollData } from "../types/types";

export const usePollData = () => {
  const { program } = useProgram();
  const [polls, setPolls] = useState<PollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // Fetch all active polls here
        const pollAccounts = await program.account.pollData.all();

        // Convert raw data to PollData type
        const formattedPolls: PollData[] = pollAccounts.map((pollAccount) => ({
          pollCreator: pollAccount.account.pollCreator,
          pollTitle: pollAccount.account.pollTitle,
          options: pollAccount.account.options,
          voteCounts: pollAccount.account.voteCounts,
          expiration: pollAccount.account.expiration,
          isActive: pollAccount.account.isActive,
          createdAt: pollAccount.account.createdAt,
        }));

        setPolls(formattedPolls);
      } catch (err) {
        console.error("Failed to fetch polls", err);
        setError("Failed to load polls.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [program]);

  return { polls, loading, error };
};
