import '../../styles/schedulessidebar.scss';

import CreateScheduleModal from './CreateScheduleModal';
import { useContext, useState } from 'react';
import { ScheduleContext } from './ScheduleContext';
import ScheduleSidebarButton from './ScheduleSidebarButton';

export default function SchedulesSidebar(props) {
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);
    

    function selectSchedule(id) {
        setSelectedSchedule(id);
    }

    return (
    <div id="schedulesSidebar">
        <h1 className="sidebarHeading">My Schedules</h1>
        {props.data.data.map((schedule, index) => (<ScheduleSidebarButton key={index} index={index} selectedSchedule={selectedSchedule} schedule={schedule} selectSchedule={selectSchedule}></ScheduleSidebarButton>))}
        <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createFirstScheduleModal">
            Add schedule 
        </button>
        <CreateScheduleModal/>
    </div>)
}