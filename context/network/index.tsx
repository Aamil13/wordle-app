import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as Network from "expo-network";

type NetworkContextType = {
  isConnected: boolean;
  latency: number | null;
  isSlow: boolean;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const NetworkProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [latency, setLatency] = useState<number | null>(null);
  const [isSlow, setIsSlow] = useState<boolean>(false);

  const checkNetwork = async () => {
    const state = await Network.getNetworkStateAsync();

    if (!state.isConnected) {
      setIsConnected(false);
      setLatency(null);
      setIsSlow(false);
      return;
    }

    setIsConnected(true);

    const start = Date.now();

    try {
      await fetch("https://www.google.com", { method: "HEAD" });

      const ping = Date.now() - start;

      setLatency(ping);
      setIsSlow(ping > 1000);
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkNetwork();

    const interval = setInterval(checkNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, latency, isSlow }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error("useNetwork must be used inside NetworkProvider");
  }

  return context;
};
