import { createContext, useState } from "react";

const TimeboxContext = createContext();

function TimeboxContextProvider({ children }) {
    const [addTimeBoxDialogOpen, setAddTimeBoxDialogOpen] = useState(false);
    const listOfColors = ["#00E3DD", "#00C5E6", "#00A4E7", "#0081DC", "#1E5ABF", "#348D9D", "#67D6FF"];
    const [timeboxRecording, setTimeBoxRecording] = useState(-1);
    
    return (
      <TimeboxContext.Provider value={{ addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording }}>
        {children}
      </TimeboxContext.Provider>
    );
};

export { TimeboxContext, TimeboxContextProvider };