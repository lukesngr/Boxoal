import '../styles/schedulessidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function SchedulesSidebar(props) {
    return (
    <div id="schedulesSidebar">
        <h1 class="sidebarHeading">My Schedules</h1>
            {props.data.data.map(schedule => (<p class="schedule">
                {schedule.name} 
                <FontAwesomeIcon className='scheduleButton' icon={faChevronDown}/>
                <FontAwesomeIcon className='scheduleButton' icon={faGear} />
            </p>))}
        <
    </div>)
}