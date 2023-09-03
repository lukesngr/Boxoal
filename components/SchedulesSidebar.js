import '../styles/schedulessidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateScheduleModal from './CreateScheduleModal';
import { useState } from 'react';

export default function SchedulesSidebar(props) {
    const [isAddAreaVisible, setIsAddAreaVisible] = useState(false);

    function toggleAddAreaButton() {
        setIsAddAreaVisible(!isAddAreaVisible);
    }

    return (
    <div id="schedulesSidebar">
        <h1 class="sidebarHeading">My Schedules</h1>
        {props.data.data.map(schedule => (<p class="schedule">
            {schedule.name} 
            {!isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronDown}/> }
            {isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronUp}/> }
            <FontAwesomeIcon className='scheduleButton' icon={faGear} />
            {isAddAreaVisible && <>
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createFirstScheduleModal">
                    Add area 
                </button>
                <CreateScheduleModal/>
            </>}
        </p>))}
        <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createFirstScheduleModal">
            Add schedule 
        </button>
        <CreateScheduleModal/>
    </div>)
}