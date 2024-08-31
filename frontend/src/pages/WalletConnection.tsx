import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";

const WalletConnection: React.FC = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Connect Your Wallet</h1>
      <WalletMultiButton />
      <p className="mt-4 text-sm text-gray-300">
        Don't have a wallet?{" "}
        <a
          href="https://www.backpack.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Get Backpack Wallet
        </a>
      </p>
    </div>
  );
};

export default WalletConnection;
