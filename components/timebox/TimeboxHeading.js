import { useContext, useState } from "react";
import { ScheduleContext } from "../schedule/ScheduleContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCog } from "@fortawesome/free-solid-svg-icons";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from "@mui/material";
import "../../styles/timeboxheading.scss";

export default function TimeboxHeading(props) {

    const theme = createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#7FFFD4',
          },
          secondary: {
            main: '#e21919',
          },
          text: {
            hint: '#ffffff',
            secondary: '#ffffff',
          },
        }
      });

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const {expanded, setExpanded, selectedDate, setSelectedDate} = useContext(ScheduleContext);

    return <h1 className="viewHeading">This Week
                <FontAwesomeIcon className="calendarIcon" icon={faCalendar} onClick={() => setDatePickerVisible(!datePickerVisible)}></FontAwesomeIcon>
                {datePickerVisible && <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ThemeProvider theme={theme}>
                        <StaticDatePicker sx={{position: "absolute", zIndex: 999, left: '50%'}} displayStaticWrapperAs="desktop"
                        openTo="day" value={selectedDate} onChange={(newValue) => {setSelectedDate(newValue);}}></StaticDatePicker>
                    </ThemeProvider>
                </LocalizationProvider>}
                {!expanded && <FontAwesomeIcon className="sideBarExpandBtn ml-1" icon={faCog} onClick={() => setExpanded(true)}></FontAwesomeIcon>}
            </h1>
}