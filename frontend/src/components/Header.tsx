// components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <nav>
        <Link to="/" className="mr-4">
          Home
        </Link>
        <Link to="/create-poll" className="mr-4">
          Create Poll
        </Link>
      </nav>
      <WalletMultiButton />
    </header>
  );
};

export default Header;
