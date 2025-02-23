import { useContext, useState } from "react";
import { ScheduleContext } from "../schedule/ScheduleContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCog } from "@fortawesome/free-solid-svg-icons";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from "@mui/material";
import "../../styles/timeboxheading.scss";
import { useDispatch, useSelector } from "react-redux";

export default function TimeboxHeading(props) {

  const dispatch = useDispatch();
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
    const selectedDate = useSelector(state => state.selectedDate.value);
    const expanded = useSelector(state => state.expanded.value);

    return <h1 className="viewHeading">Timeboxes
                <FontAwesomeIcon className="calendarIcon" icon={faCalendar} onClick={() => setDatePickerVisible(!datePickerVisible)}></FontAwesomeIcon>
                {datePickerVisible && <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ThemeProvider theme={theme}>
                        <StaticDatePicker sx={{position: "absolute", zIndex: 999, left: '50%'}} displayStaticWrapperAs="desktop"
                        openTo="day" value={selectedDate} onChange={(newValue) => {
                          dispatch({type: 'selectedDate/set', payload: newValue.toUTCString()})
                          setDatePickerVisible(false);
                        }}></StaticDatePicker>
                    </ThemeProvider>
                </LocalizationProvider>}
                {!expanded && <FontAwesomeIcon className="sideBarExpandBtn ml-1" icon={faCog} onClick={() => {}}></FontAwesomeIcon>}
            </h1>
}