import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateAreaModal from '../area/CreateAreaModal';
import { useState } from 'react';

export default function ScheduleSidebarButton(props) {
    const [isAddGoalVisible, setIsAddGoalVisible] = useState(false);

    function toggleAddGoalButton() { setIsAddGoalVisible(!isAddGoalVisible); } //flips visibility of add goal button

    return (
        <div onClick={() => props.selectSchedule(props.index)} className={props.selectedSchedule == props.index ? 'selectedSchedule' : 'schedule'}>
            {props.schedule.name}
            {!isAddGoalVisible && <FontAwesomeIcon onClick={toggleAddGoalButton} className='scheduleButton' icon={faChevronDown}/> }
            {isAddGoalVisible && <FontAwesomeIcon onClick={toggleAddGoalButton} className='scheduleButton' icon={faChevronUp}/> }
            <FontAwesomeIcon className='scheduleButton' icon={faGear} />
            {isAddGoalVisible && props.schedule.goals.map(goal => (<div key={goal.id} className="areaButton">{goal.name}</div>))}
            {isAddGoalVisible && <>
                <button type="button" className="btn btn-dark createGoal createButton" data-bs-toggle="modal" data-bs-target="#createAreaModal">
                    Add goal 
                </button>
                <CreateAreaModal id={props.schedule.id}/>
            </>}
        </div>)
}