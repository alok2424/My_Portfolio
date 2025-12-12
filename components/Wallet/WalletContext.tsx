"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import Web3 from 'web3';
import ABI from './ABI.json';

interface WalletContextType {
  web3: any;
  contract: any;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  web3: null,
  contract: null,
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [web3, setWeb3] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      setIsConnecting(true);
      const web3Instance = new Web3(window.ethereum);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const contractInstance = new web3Instance.eth.Contract(
        ABI as any,
        "0x8E15156424e1BB232F8D891Cab7110AdF16BE5e1"
      );

      setWeb3(web3Instance);
      setContract(contractInstance);
      setIsConnected(true);
      
    } catch (error) {
      console.error("Connection error:", error);
      alert("MetaMask connection failed. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <WalletContext.Provider value={{
      web3,
      contract,
      isConnected,
      isConnecting,
      connectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
}