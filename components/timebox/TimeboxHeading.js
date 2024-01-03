import {S}
import { useContext, useState } from "react";
import { ScheduleContext } from "../schedule/ScheduleContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCog } from "@fortawesome/free-solid-svg-icons";
import { StaticDatePicker } from "@mui/x-date-pickers";

export default function TimeboxHeading(props) {

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const {selectedSchedule, setSelectedSchedule, expanded, setExpanded, selectedDate, setSelectedDate} = useContext(ScheduleContext);

    return <h1 className="viewHeading">This Week
                <FontAwesomeIcon icon={faCalendar} onClick={() => setDatePickerVisible(true)}></FontAwesomeIcon>
                {datePickerVisible && <StaticDatePicker displayStaticWrapperAs="desktop"
        openTo="year"
        value={selectedDate}
        onChange={(newValue) => {
            setSelectedDate(newValue);
        }}
      />}
                {!props.expanded && <FontAwesomeIcon className="sideBarExpandBtn ml-1" icon={faCog} onClick={() => props.setExpanded(true)}></FontAwesomeIcon>}
            </h1>
}