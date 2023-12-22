import { createContext, useState } from "react";

const ScheduleContext = createContext();

function ScheduleContextProvider({ children }) {
    const [selectedSchedule, setSelectedSchedule] = useState("0");
    const [expanded, setExpanded] = useState(true);
    
    return (
      <ScheduleContext.Provider value={{ selectedSchedule, setSelectedSchedule, expanded, setExpanded }}>
        {children}
      </ScheduleContext.Provider>
    );
};

export { ScheduleContext, ScheduleContextProvider };