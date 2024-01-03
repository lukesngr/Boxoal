import { useContext, useState } from "react";
import { ScheduleContext } from "../schedule/ScheduleContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCog } from "@fortawesome/free-solid-svg-icons";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../../styles/timeboxheading.scss";

export default function TimeboxHeading(props) {

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const {selectedSchedule, setSelectedSchedule, expanded, setExpanded, selectedDate, setSelectedDate} = useContext(ScheduleContext);

    return <h1 className="viewHeading">This Week
                <FontAwesomeIcon className="calendarIcon" icon={faCalendar} onClick={() => setDatePickerVisible(true)}></FontAwesomeIcon>
                {datePickerVisible && <LocalizationProvider dateAdapter={AdapterDayjs}><StaticDatePicker displayStaticWrapperAs="desktop"
                    openTo="year" value={selectedDate} onChange={(newValue) => setSelectedDate(newValue)}></StaticDatePicker>
                </LocalizationProvider>}
                {!props.expanded && <FontAwesomeIcon className="sideBarExpandBtn ml-1" icon={faCog} onClick={() => props.setExpanded(true)}></FontAwesomeIcon>}
            </h1>
}