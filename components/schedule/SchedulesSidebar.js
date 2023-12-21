import '../../styles/schedulessidebar.scss';

import CreateScheduleModal from './CreateScheduleModal';
import { useContext, useState } from 'react';
import { ScheduleContext } from './ScheduleContext';
import ScheduleSidebarButton from './ScheduleSidebarButton';

export default function SchedulesSidebar(props) {
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);
    const [expanded, setExpanded] = useState(true);
    

    function selectSchedule(id) {
        setSelectedSchedule(id);
    }

    function getCorrectClass() {
        if(expanded) {
            return 'expandedSideBar'
        }else{
            return 'closedSideBar'
        }
    }

    return (
        <div className={"col-2 schedulesSidebarContainer "+getCorrectClass()}>
            <div className="schedulesSidebar">
                <h1 className="sidebarHeading">My Schedules</h1>
                {props.data.data.map((schedule, index) => (<ScheduleSidebarButton key={index} index={index} selectedSchedule={selectedSchedule} schedule={schedule} selectSchedule={selectSchedule}></ScheduleSidebarButton>))}
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createFirstScheduleModal">
                    Add schedule 
                </button>
                <CreateScheduleModal/>
            </div>
        </div>)
}