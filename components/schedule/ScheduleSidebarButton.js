import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateGoalModal from '../goal/CreateGoalModal';
import { useState } from 'react';
import PortalComponent from '../base/PortalComponent';
import GoalSidebarButton from './GoalSidebarButton';
import UpdateScheduleModal from './UpdateScheduleModal';
import ChevronExpandable from '../base/ChevronExpandable';

export default function ScheduleSidebarButton(props) {
    
    return (
        <div key={props.schedule.id} onClick={() => props.selectSchedule(props.index)} className={props.selectedSchedule == props.index ? 'selectedSchedule' : 'schedule'}>
            <span className='sidebarExpandableTitle'>{props.schedule.name}</span>
            <ChevronExpandable render={button => (
                <div className='sidebarExpandableButtons'>
                    {button}
                    <FontAwesomeIcon data-bs-toggle="modal" data-bs-target="#updateScheduleModal" className='sidebarExpandableButton' icon={faGear} />
                    <UpdateScheduleModal schedule={props.schedule}></UpdateScheduleModal>
                </div>
            )}>
                {props.schedule.goals.map(goal => (<GoalSidebarButton goal={goal}></GoalSidebarButton>))}
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createGoalModal">Add goal</button>
                <CreateGoalModal id={props.schedule.id}/>
            </ChevronExpandable>
        </div>)
}