import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CreateGoalModal from '../goal/CreateGoalModal';
import { useState } from 'react';
import PortalComponent from '../base/PortalComponent';

export default function GoalSidebarButton(props) {
    const [timeBoxExpanded, setTimeBoxExpanded] = useState(false);

    function toggleTimeBoxExpanded() { setTimeBoxExpanded(!timeBoxExpanded); } //flips visibility of timeboxes

    return (
        <div className='goalButton'>
            <span className='sidebarExpandableTitle'>{props.goal.name}</span>
            <div className='sidebarExpandableButtons'>
                {!timeBoxExpanded && <FontAwesomeIcon onClick={toggleTimeBoxExpanded} className='sidebarExpandableButton' icon={faChevronDown}/> }
                {timeBoxExpanded && <FontAwesomeIcon onClick={toggleTimeBoxExpanded} className='sidebarExpandableButton' icon={faChevronUp}/> }
                <FontAwesomeIcon className='sidebarExpandableButton' icon={faGear} />
            </div>
            {timeBoxExpanded && props.goal.timeboxes.map(timebox => (<div key={timebox.id} className="sidebarTimeBox">
                {timebox.title}<FontAwesomeIcon className='sidebarExpandableButton' icon={faGear} />
            </div>))}
        </div>)
}