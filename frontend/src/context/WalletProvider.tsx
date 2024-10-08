// context/WalletProvider.tsx
import { useMemo, FC, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContextProvider: FC<WalletProviderProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  //   const alchemyRpcUrl =
  //     useMemo(() => process.env.REACT_APP_RPC_ENDPOINT;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Add wallets you want to support (e.g., Phantom, Solflare)
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
