import { createContext, useState } from "react";

const TimeboxDialogContext = createContext();

function TimeboxDialogContextProvider({ children }) {
    const [addTimeBoxDialogOpen, setAddTimeBoxDialogOpen] = useState(false);
    
    return (
      <TimeboxDialogContext.Provider value={{ addTimeBoxDialogOpen, setAddTimeBoxDialogOpen}}>
        {children}
      </TimeboxDialogContext.Provider>
    );
};

export { TimeboxDialogContext, TimeboxDialogContextProvider };