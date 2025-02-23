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
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsDialog from "../SettingsDialog";

export default function TimeboxHeading({data}) {

  const dispatch = useDispatch();
  const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#C5C27C',
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
    const [settingDialogVisible, setSettingDialogVisible] = useState(false);
    const selectedDate = useSelector(state => state.selectedDate.value);
    const expanded = useSelector(state => state.expanded.value);

    return <><h1 className="viewHeading">Timeboxes
                <IconButton onClick={() => setDatePickerVisible(!datePickerVisible)}>
                  <EditCalendarIcon sx={{color: 'black'}} fontSize="medium"></EditCalendarIcon>
                </IconButton>
                <IconButton onClick={() => setSettingDialogVisible(!settingDialogVisible)}>
                  <SettingsIcon sx={{color: 'black'}} fontSize="medium"></SettingsIcon>
                </IconButton>
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
                
            </h1><SettingsDialog visible={settingDialogVisible} hideDialog={() => setSettingDialogVisible(false)} data={data}/>
            </>
}