import '../styles/schedulessidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateScheduleModal from './CreateScheduleModal';
import CreateAreaModal from './CreateAreaModal';
import { useContext, useState } from 'react';
import { ScheduleContext } from './ScheduleContext';

export default function SchedulesSidebar(props) {
    const [isAddAreaVisible, setIsAddAreaVisible] = useState(false);
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);

    function toggleAddAreaButton() {
        setIsAddAreaVisible(!isAddAreaVisible);
    }

    function selectSchedule(id) {
        setSelectedSchedule(id);
    }

    return (
    <div id="schedulesSidebar">
        <h1 className="sidebarHeading">My Schedules</h1>
        {props.data.data.map((schedule, index) => (<div key={schedule.id}  onClick={() => selectSchedule(index)} className={selectedSchedule == index ? 'selectedSchedule' : 'schedule'}>
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