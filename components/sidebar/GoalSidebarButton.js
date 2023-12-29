import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateGoalModal from '../modal/CreateGoalModal';
import { useState } from 'react';
import PortalComponent from '../modal/PortalComponent';
import UpdateGoalModal from '../modal/UpdateGoalModal';
import UpdateTimeBoxModal from '../modal/UpdateTimeBoxModal';
import ChevronExpandable from '../base/ChevronExpandable';

export default function GoalSidebarButton(props) {
    
    return (
        <div className='goalButton'>
            <span className='sidebarExpandableTitle'>{props.goal.name}</span>
            <ChevronExpandable render={button => (
                <div className='sidebarExpandableButtons'>
                    {button}
                    <FontAwesomeIcon data-bs-toggle="modal" data-bs-target="#updateGoalModal" className='sidebarExpandableButton' icon={faGear} />
                    <UpdateGoalModal goal={props.goal}></UpdateGoalModal>
                </div>
            )}>
                {props.goal.timeboxes.map(timebox => (
                <div key={timebox.id} className="sidebarTimeBox">
                    {timebox.title}
                    <FontAwesomeIcon data-bs-toggle="modal" data-bs-target="#updateTimeBoxModal" className='sidebarExpandableButton' icon={faGear} />
                    <UpdateTimeBoxModal timebox={timebox}></UpdateTimeBoxModal>
                </div>))}
            </ChevronExpandable>
        </div>)
}