import '../styles/schedulessidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateScheduleModal from './CreateScheduleModal';
import CreateAreaModal from './CreateAreaModal';
import { useState } from 'react';

export default function SchedulesSidebar(props) {
    const [isAddAreaVisible, setIsAddAreaVisible] = useState(false);

    function toggleAddAreaButton() {
        setIsAddAreaVisible(!isAddAreaVisible);
    }

    return (
    <div id="schedulesSidebar">
        <h1 className="sidebarHeading">My Schedules</h1>
        {props.data.data.map(schedule => (<div key={schedule.id} className="schedule">
            {schedule.name} 
            {!isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronDown}/> }
            {isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronUp}/> }
            <FontAwesomeIcon className='scheduleButton' icon={faGear} />
            {isAddAreaVisible && schedule.areas.map(area => (<div key={area.id} className="areaButton">{area.name}</div>))}
            {isAddAreaVisible && <>
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createAreaModal">
                    Add area 
                </button>
                <CreateAreaModal id={schedule.id}/>
            </>}
        </div>))}
        <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createFirstScheduleModal">
            Add schedule 
        </button>
        <CreateScheduleModal/>
    </div>)
}