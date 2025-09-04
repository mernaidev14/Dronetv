import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 import {toast } from 'react-toastify';
// User Authentication Types and Context
interface User {
  email: string;
  fullName: string;
  token?: string;
  // Add other user properties as needed
}

interface UserAuthContextType {
  user: User | null;
  isLogin: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

interface UserAuthProviderProps {
  children: ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLogin = !!user;

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, isLogin, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}

// Template Management Types and Context
interface TemplateContextType {
  draftDetails: any | [];
  setDraftDetails: React.Dispatch<React.SetStateAction<any | []>>;
  AIGenData: any | [];
  setAIGenData: React.Dispatch<React.SetStateAction<any | []>>;
  isPublishedTriggered: boolean;
  setIsPublishedTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  finalTemplate: any | [];
  setFinalTemplate: React.Dispatch<React.SetStateAction<any | []>>;
  publishTemplate: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
  const [isPublishedTriggered, setIsPublishedTriggered] = useState<boolean>(false);
  const [finalTemplate, setFinalTemplate] = useState<any | []>({});
  const [AIGenData, setAIGenData] = useState<any>({});

  const navigate = useNavigate();

  async function fetchAPI() {
    const response = await fetch(
      `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.publishedId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalTemplate)
      }
    );
    
    const res = await response.json();

    if (response.ok) {
      console.log("response:", res);
      toast.success("your site is successfully published and now it is in under-review")
      navigate("/user/companies");
    }else{
      toast.error("somthing want wrong...")
    }
  }

  function publishTemplate() {
    setIsPublishedTriggered(true);
    fetchAPI();
  }

  useEffect(() => {
    console.log("finalData:", finalTemplate);
  }, [finalTemplate]);

  return (
    <TemplateContext.Provider value={{ 
      draftDetails, 
      setDraftDetails, 
      AIGenData, 
      setAIGenData, 
      isPublishedTriggered, 
      setIsPublishedTriggered, 
      finalTemplate, 
      setFinalTemplate, 
      publishTemplate 
    }}>
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}

// Combined Provider for easier app integration
interface CombinedProvidersProps {
  children: ReactNode;
}

export const CombinedProviders: React.FC<CombinedProvidersProps> = ({ children }) => {
  return (
    <UserAuthProvider>
      <TemplateProvider>
        {children}
      </TemplateProvider>
    </UserAuthProvider>
  );
};