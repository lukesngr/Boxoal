import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateAreaModal from './CreateAreaModal';
import { useState } from 'react';

export default function ScheduleSidebarButton(props) {
    const [isAddAreaVisible, setIsAddAreaVisible] = useState(false);

    function toggleAddAreaButton() {
        setIsAddAreaVisible(!isAddAreaVisible);
    }

    return (
        <div onClick={() => props.selectSchedule(props.index)} className={props.selectedSchedule == props.index ? 'selectedSchedule' : 'schedule'}>
            {props.schedule.name}
            {!isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronDown}/> }
            {isAddAreaVisible && <FontAwesomeIcon onClick={toggleAddAreaButton} className='scheduleButton' icon={faChevronUp}/> }
            <FontAwesomeIcon className='scheduleButton' icon={faGear} />
            {isAddAreaVisible && props.schedule.areas.map(area => (<div key={area.id} className="areaButton">{area.name}</div>))}
            {isAddAreaVisible && <>
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createAreaModal">
                    Add area 
                </button>
                <CreateAreaModal id={props.schedule.id}/>
            </>}
        </div>)
}