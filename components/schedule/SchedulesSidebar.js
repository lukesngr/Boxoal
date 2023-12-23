import '../../styles/schedulessidebar.scss';

import CreateScheduleModal from './CreateScheduleModal';
import { useContext, useEffect, useState } from 'react';
import { ScheduleContext } from './ScheduleContext';
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
        console.log(expanded);
    }, [smallerThanLargeBreakpoint])

    
    
    

    function selectSchedule(id) {
        setSelectedSchedule(id);
    }

    return (<>
        <div className={isSideBarMobile ? ("mobileSideBar") : ("col-2")} 
        style={{'display': expanded ? ('block') : ('none')}}>
            <div className="schedulesSidebar">
                <h1 className="sidebarHeading">My Schedules <FontAwesomeIcon onClick={() => setExpanded(false)} className='minimizeButton' icon={faArrowLeft}></FontAwesomeIcon></h1>
                {props.data.data.map((schedule, index) => (<ScheduleSidebarButton key={index} index={index} selectedSchedule={selectedSchedule} schedule={schedule} selectSchedule={selectSchedule}></ScheduleSidebarButton>))}
                <button type="button" className="btn btn-dark createButton" data-bs-toggle="modal" data-bs-target="#createFirstScheduleModal">
                    Add schedule 
                </button>
                <CreateScheduleModal/>
            </div>
        </div>
        </>)
}