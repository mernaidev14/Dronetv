import { useContext, createContext, ReactNode, useState } from "react";

// Define the context type
interface AuthContextType {
  draftDetails: any | [];
  setDraftDetails: React.Dispatch<React.SetStateAction<any | []>>;
  AIGenData: any | [];
  setAIGenData: React.Dispatch<React.SetStateAction<any | []>>; 
}

// Create context with a default value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
 


   const [AIGenData, setAIGenData] = useState<any>({});



  return (
    <AuthContext.Provider value={{ draftDetails, setDraftDetails, AIGenData, setAIGenData }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}