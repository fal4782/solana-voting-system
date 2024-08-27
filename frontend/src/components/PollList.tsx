import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { program, votingDataPDA, VotingData } from "../anchor/setup";

const PollList = () => {
  const { connection } = useConnection();
  const [polls, setPolls] = useState<VotingData | null>(null);

  useEffect(() => {
    // async function fetchPollData() {
    //   const data = await program.account.votingData.fetch(votingDataPDA);
    //   setPolls(data);
    // }

    program.account.votingData
      .fetch(votingDataPDA)
      .then((data) => {
        console.log("Fetched data:", data);
        setPolls(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // fetchPollData();

    const subscriptionId = connection.onAccountChange(
      votingDataPDA,
      (accountInfo) => {
        setPolls(program.coder.accounts.decode("votingData", accountInfo.data));
      }
    );

    return () => {
      // Unsubscribe from account change
      connection.removeAccountChangeListener(subscriptionId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  return (
    <div>
      <h2>Poll List</h2>
      {polls ? (
        <div>
          <p>Poll PDA: {votingDataPDA.toBase58()}</p>
          <p>Votes: {polls.voteCounts.join(", ")}</p>
        </div>
      ) : (
        <p>Loading polls...</p>
      )}
    </div>
  );
};

export default PollList;
