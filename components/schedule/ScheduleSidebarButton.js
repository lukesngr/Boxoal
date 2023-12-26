import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateGoalModal from '../goal/CreateGoalModal';
import { useState } from 'react';
import PortalComponent from '../base/PortalComponent';
import GoalSidebarButton from './GoalSidebarButton';
import UpdateScheduleModal from './UpdateScheduleModal';

export default function ScheduleSidebarButton(props) {
    const [isAddGoalVisible, setIsAddGoalVisible] = useState(false);

    function toggleAddGoalButton() { setIsAddGoalVisible(!isAddGoalVisible); } //flips visibility of add goal button

    return (
        <div key={props.schedule.id} onClick={() => props.selectSchedule(props.index)} className={props.selectedSchedule == props.index ? 'selectedSchedule' : 'schedule'}>
            <span className='sidebarExpandableTitle'>{props.schedule.name}</span>
            <div className='sidebarExpandableButtons'>
                {!isAddGoalVisible && <FontAwesomeIcon onClick={toggleAddGoalButton} className='sidebarExpandableButton' icon={faChevronDown}/> }
                {isAddGoalVisible && <FontAwesomeIcon onClick={toggleAddGoalButton} className='sidebarExpandableButton' icon={faChevronUp}/> }
                <FontAwesomeIcon data-bs-toggle="modal" data-bs-target="#updateScheduleModal" className='sidebarExpandableButton' icon={faGear} />
                <PortalComponent>
                    <UpdateScheduleModal schedule={props.schedule}></UpdateScheduleModal>
                </PortalComponent>
            </div>
            {isAddGoalVisible && props.schedule.goals.map(goal => (<GoalSidebarButton goal={goal}></GoalSidebarButton>))}
            {isAddGoalVisible && <>
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createGoalModal">
                    Add goal 
                </button>
                <PortalComponent>
                    <CreateGoalModal id={props.schedule.id}/>
                </PortalComponent>
            </>}
        </div>)
}