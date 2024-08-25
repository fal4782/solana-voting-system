import { useState } from "react";
import { castVote, connectWallet } from "../solanaProvider";

function Vote() {
  const [candidate, setCandidate] = useState<number | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  const handleConnectWallet = async () => {
    const publicKey = await connectWallet();
    if (publicKey) {
      setWalletConnected(true);
      console.log("Connected wallet:", publicKey);
    }
  };

  const handleVote = async () => {
    if (walletConnected && candidate !== null) {
      const result = await castVote(candidate);
      console.log(result);
    }
  };

  return (
    <div>
      {!walletConnected && (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
      {walletConnected && (
        <>
          <button onClick={() => setCandidate(1)}>Vote for Candidate 1</button>
          <button onClick={() => setCandidate(2)}>Vote for Candidate 2</button>
          <button onClick={handleVote}>Submit Vote</button>
        </>
      )}
    </div>
  );
}

export default Vote;
