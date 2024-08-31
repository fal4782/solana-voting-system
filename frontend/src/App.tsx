// App.tsx (updated)
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import WalletContextProvider from "./context/WalletProvider";
import { ProgramProvider } from "./context/ProgramContext";
import HomePage from "./pages/HomePage";
import CreatePollPage from "./pages/CreatePollPage";
import PollDetailPage from "./pages/PollDetailPage";
import WalletConnection from "./pages/WalletConnection";
import { useWallet } from "@solana/wallet-adapter-react";

const ProtectedRoutes = () => {
  const { connected } = useWallet();
  return connected ? <Outlet /> : <Navigate to="/connect-wallet" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <WalletContextProvider>
        <ProgramProvider>
          <Routes>
            <Route path="/connect-wallet" element={<WalletConnection />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-poll" element={<CreatePollPage />} />
              <Route path="/poll/:pollTitle" element={<PollDetailPage />} />
            </Route>
          </Routes>
        </ProgramProvider>
      </WalletContextProvider>
    </Router>
  );
};

export default App;
