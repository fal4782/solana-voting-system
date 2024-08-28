import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WalletContextProvider from "./context/WalletProvider";
import { ProgramProvider } from "./context/ProgramContext";
import HomePage from "./pages/HomePage";
import CreatePollPage from "./pages/CreatePollPage";
// import PollDetailPage from "./pages/PollDetailPage";

const App = () => {
  return (
    <Router>
      <WalletContextProvider>
        <ProgramProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-poll" element={<CreatePollPage />} />
            {/* <Route path="/poll/:pollTitle" element={<PollDetailPage />} /> */}
          </Routes>
        </ProgramProvider>
      </WalletContextProvider>
    </Router>
  );
};

export default App;
