import { createContext, useState } from "react";

const ScheduleContext = createContext();

function ScheduleContextProvider({ children }) {
    const [selectedSchedule, setSelectedSchedule] = useState("0");
    
    return (
      <ScheduleContext.Provider value={{ selectedSchedule, setSelectedSchedule }}>
        {children}
      </ScheduleContext.Provider>
    );
};

export { ScheduleContext, ScheduleContextProvider };