import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
// Define the context type
interface AuthContextType {
  draftDetails: any | [];
  setDraftDetails: React.Dispatch<React.SetStateAction<any | []>>;
  AIGenData: any | [];
  setAIGenData: React.Dispatch<React.SetStateAction<any | []>>;
  isPublishedTrigured: boolean;
  setIsPublishedTrigured: React.Dispatch<React.SetStateAction<boolean>>;
  finalTemplate: any|[];
  setFinalTemplate:React.Dispatch<React.SetStateAction<any | []>>;
}

// Create context with a default value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
  const[isPublishedTrigured,setIsPublishedTrigured]= useState<boolean>(false)
  const[finalTemplate,setFinalTemplate]=useState<any | []>({});

    const [AIGenData, setAIGenData] = useState<any>({});

const navigate = useNavigate();

async function FetchAPI(){
   const response= await fetch(`https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.publishedId}`,{
    method: 'PUT',
    
    body: JSON.stringify(finalTemplate)
   })
   const res = await response.json()

   if(response.ok){
    console.log("response:", res);
    navigate("/user/companies")
   }
}

function publishTemplate(){
     setIsPublishedTrigured(true)
     FetchAPI()
    }
    
    useEffect(()=>{
      console.log("finalData:",finalTemplate)
    
        },[finalTemplate])

  return (
    <AuthContext.Provider value={{ draftDetails, setDraftDetails, AIGenData, setAIGenData, isPublishedTrigured, setIsPublishedTrigured,setFinalTemplate, finalTemplate, publishTemplate }}>
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
