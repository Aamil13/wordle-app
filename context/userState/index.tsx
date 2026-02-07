import { createContext, ReactNode, useContext, useState } from "react";

type userProps = {
  session: string;
  isActive: boolean;
};

type userContextType = {
  user: userProps;
  setUser: React.Dispatch<React.SetStateAction<userProps>>;
};

const UserContext = createContext<userContextType | undefined>(undefined);

type providerProps = {
  children: ReactNode;
};

const UserContextProvider = ({ children }: providerProps) => {
  const [user, setUser] = useState<userProps>({
    session: "",
    isActive: false,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
