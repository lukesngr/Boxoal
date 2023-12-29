import '../../styles/schedulessidebar.scss';

import CreateScheduleModal from '../modal/CreateScheduleModal';
import { useContext, useEffect, useState } from 'react';
import { ScheduleContext } from '../schedule/ScheduleContext';
import ScheduleSidebarButton from './ScheduleSidebarButton';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';

export default function SchedulesSidebar(props) {
    const {selectedSchedule, setSelectedSchedule, expanded, setExpanded} = useContext(ScheduleContext);
    const [isSideBarMobile, setIsSideBarMobile] = useState(true);

    let smallerThanLargeBreakpoint = useMediaQuery({query: '(max-width: 992px)'});

    useEffect(() => {
        setExpanded(!smallerThanLargeBreakpoint);
        setIsSideBarMobile(smallerThanLargeBreakpoint);
    }, [smallerThanLargeBreakpoint])

    function selectSchedule(id) {
        setSelectedSchedule(id);
    }

    return (<>
        <div className={isSideBarMobile ? ("mobileSideBar") : ("col-2")} 
        id={expanded ? ('animateToAppear') : ('animateToDisappear')}>
            <div className="schedulesSidebar">
                <h1 className="sidebarHeading">My Schedules <FontAwesomeIcon onClick={() => setExpanded(false)} className='minimizeButton' icon={faArrowLeft}></FontAwesomeIcon></h1>
                {props.data.data.map((schedule, index) => (<ScheduleSidebarButton key={index} index={index} selectedSchedule={selectedSchedule} schedule={schedule} selectSchedule={selectSchedule}></ScheduleSidebarButton>))}                   
                <CreateScheduleModal render={tags => ( <button type="button" {...tags} className="btn btn-dark createButton">Add schedule</button>)}></CreateScheduleModal>
            </div>
        </div>
        </>)
}