"use client"
import { useState } from "react";
import ABI from "./ABI.json";
import Web3 from "web3";

type WalletState = {
  web3: Web3;
  contract: any;
};

type WalletProps = {
  saveState: (state: WalletState) => void;
};

const Wallet: React.FC<WalletProps> = ({ saveState }) => {
  const [connected, setConnected] = useState(true);
  const isAndroid = /android/i.test(navigator.userAgent);

  const init = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("Please Install Metamask");
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const contract = new web3.eth.Contract(
        ABI,
        "0xD76852B784ec1Ec11Db89dABeE7a0DAC2FDEB466"
      );

      setConnected(false);
      saveState({ web3, contract });
    } catch (error: any) {
      alert(error?.message ?? "Please Install Metamask");
    }
  };

  return (
    <>
      <div className="header">
        {isAndroid && (
          <button className="connectBTN">
            <a href="https://metamask.app.link/dapp/sriche.netlify.app/">
              Click For Mobile
            </a>
          </button>
        )}
        <button className="connectBTN" onClick={init} disabled={!connected}>
          {connected ? "Connect Metamask" : "Connected"}
        </button>
      </div>
    </>
  );
};

export default Wallet;
