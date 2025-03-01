import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateGoalModal from '../modal/CreateGoalModal';
import { useState } from 'react';
import PortalComponent from '../modal/PortalComponent';
import GoalSidebarButton from './GoalAccordion';
import UpdateScheduleModal from '../modal/UpdateScheduleModal';
import ChevronExpandable from '../base/ChevronExpandable';

export default function ScheduleSidebarButton(props) {
    
    return (
        <div key={props.schedule.id} onClick={() => props.selectSchedule(props.index)} className={props.selectedSchedule == props.index ? 'selectedSchedule' : 'schedule'}>
            <span className='sidebarExpandableTitle'>{props.schedule.name}</span>
            <ChevronExpandable render={button => (<>
                {button}
                <UpdateScheduleModal render={tags => ( <FontAwesomeIcon {...tags} className='sidebarExpandableButton' icon={faGear} />)} schedule={props.schedule}></UpdateScheduleModal>
            </>)}>
                {props.schedule.goals.map((goal, index) => (<GoalSidebarButton key={index} goal={goal}></GoalSidebarButton>))}
                <CreateGoalModal render={tags => ( <button {...tags} type="button" className="btn btn-dark createButton">Add goal</button>)} id={props.schedule.id}/>
            </ChevronExpandable>
        </div>)
}