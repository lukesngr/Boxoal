import { createContext, useState } from "react";

const TimeboxContext = createContext();

function TimeboxContextProvider({ children }) {
    const [addTimeBoxDialogOpen, setAddTimeBoxDialogOpen] = useState(false);
    const [timeboxRecording, setTimeBoxRecording] = useState([-1, 0]);
    
    return (
      <TimeboxContext.Provider value={{ addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, timeboxRecording, setTimeBoxRecording }}>
        {children}
      </TimeboxContext.Provider>
    );
};

export { TimeboxContext, TimeboxContextProvider };