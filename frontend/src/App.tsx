import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

// Import your components
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import CreatePoll from "./components/CreatePoll";

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // auto detect the wallets a user's browser has available
  const wallets = useMemo(() => [], []);

  return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <BrowserRouter>
              <div className="app-container">
                <header>
                  <h1>Solana Voting App</h1>
                  <WalletMultiButton />
                </header>
                <main>
                  <Routes>
                    <Route path="/" element={<PollList />} />
                    <Route path="/poll/:id" element={<PollDetail />} />
                    <Route path="/create-poll" element={<CreatePoll />} />
                  </Routes>
                  {/* <PollList /> */}
                  {/* <PollDetail /> or <CreatePoll /> */}
                </main>
              </div>
            </BrowserRouter>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  );
}

export default App;
