import React from "react";
import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 bg-gray-900 shadow-md">
      {/* Logo Section as Home Link */}
      <Link
        to="/"
        className="text-lg md:text-xl font-semibold text-white hover:text-blue-400 transition duration-200"
      >
        Solana Voting App
      </Link>

      {/* Create Poll and Wallet Button Section */}
      <div className="flex items-center space-x-4">
        <Link
          to="/create-poll"
          className="border border-white text-white text-sm md:text-base px-3 py-1 rounded hover:bg-white hover:text-black transition duration-200"
        >
          Create Poll
        </Link>
        <WalletMultiButton />
      </div>
    </header>
  );
};

export default Header;
