// components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 shadow-lg">
      {/* Logo Section as Home Link */}
      <Link
        to="/"
        className="text-xl font-bold text-white flex items-center hover:text-blue-400 transition duration-200"
      >
        Solana Voting App
      </Link>

      {/* Create Poll and Wallet Button Section */}
      <div className="flex items-center space-x-6">
        <Link
          to="/create-poll"
          className="border border-slate-200 text-white px-4 py-2 rounded hover:bg-white hover:text-black transition duration-300"
        >
           Create Poll
        </Link>
        <WalletMultiButton  />
      </div>
    </header>
  );
};

export default Header;
