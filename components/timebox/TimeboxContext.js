import { createContext, useState } from "react";

const TimeboxContext = createContext();

function TimeboxContextProvider({ children }) {
    const [timeBoxInUse, setTimeBoxInUse] = useState("");
    
    return (
      <TimeboxContext.Provider value={{ timeBoxInUse, setTimeBoxInUse }}>
        {children}
      </TimeboxContext.Provider>
    );
};

export { TimeboxContext, TimeboxContextProvider };