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
            {props.goal.name}
            {!timeBoxExpanded && <FontAwesomeIcon onClick={toggleTimeBoxExpanded} className='scheduleButton' icon={faChevronDown}/> }
            {timeBoxExpanded && <FontAwesomeIcon onClick={toggleTimeBoxExpanded} className='scheduleButton' icon={faChevronUp}/> }
            <FontAwesomeIcon className='scheduleButton' icon={faGear} />
            {timeBoxExpanded && props.goal.timeboxes.map(timebox => (<div key={timebox.id} className="goalButton">{timebox.title}</div>))}
        </div>)
}