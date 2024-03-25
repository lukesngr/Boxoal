import { createContext, useState } from "react";

const TimeboxRecordingContext = createContext(null);

function TimeboxRecordingContextProvider({ children }) {
    const [timeboxRecording, setTimeBoxRecording] = useState([-1, 0]);
    
    return (
      <TimeboxRecordingContext.Provider value={[ timeboxRecording, setTimeBoxRecording ]}>
        {children}
      </TimeboxRecordingContext.Provider>
    );
};

export { TimeboxRecordingContext, TimeboxRecordingContextProvider };