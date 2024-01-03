import dayjs from "dayjs";
import { createContext, useState } from "react";

const ScheduleContext = createContext();

function ScheduleContextProvider({ children }) {
    const [selectedSchedule, setSelectedSchedule] = useState("0");
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [expanded, setExpanded] = useState(true);
    
    return (
      <ScheduleContext.Provider value={{ selectedSchedule, setSelectedSchedule, expanded, setExpanded, selectedDate, setSelectedDate }}>
        {children}
      </ScheduleContext.Provider>
    );
};

export { ScheduleContext, ScheduleContextProvider };