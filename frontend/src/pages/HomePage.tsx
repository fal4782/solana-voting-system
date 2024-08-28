import WalletConnectButton from "../components/WalletConnectionButton";
import PollList from "../components/PollList";

function HomePage() {
  return (
    <div>
      <h1>Solana Voting App</h1>
      {/* Render the wallet connection button here */}
      <WalletConnectButton />
      <PollList />
    </div>
  );
}

export default HomePage;
