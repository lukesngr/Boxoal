import '../../styles/schedulessidebar.scss';

import CreateScheduleModal from '../modal/CreateScheduleModal';
import { useContext, useEffect, useState } from 'react';
import { ScheduleContext } from '../schedule/ScheduleContext';
import ScheduleSidebarButton from './ScheduleSidebarButton';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { IconButton, Button } from '@mui/material';
import {Paper} from '@mui/material';
import GoalAccordion from './GoalAccordion';

export default function SchedulesSidebar(props) {
    const dispatch = useDispatch();
    const [isSideBarMobile, setIsSideBarMobile] = useState(true);
    const [createGoalModalOpen, setCreateGoalModalOpen] = useState(false);
    const {scheduleIndex} = useSelector(state => state.profile.value);
    const expanded = useSelector(state => state.expanded.value);
    let schedule = props.data[scheduleIndex];

    let smallerThanLargeBreakpoint = useMediaQuery({query: '(max-width: 992px)'});

    useEffect(() => {
        dispatch({type: 'expanded/set', payload: !smallerThanLargeBreakpoint});
        setIsSideBarMobile(smallerThanLargeBreakpoint);
    }, [smallerThanLargeBreakpoint])

    return (<>
        <div className={isSideBarMobile ? ("mobileSideBar") : ("col-2")} 
        id={expanded ? ('animateToAppear') : ('animateToDisappear')}>
            <div className="schedulesSidebar">
                <h1 className="sidebarHeading">{schedule.title} 
                    <IconButton onClick={() => setExpanded(false)} className='minimizeButton'>
                        <ArrowLeftIcon></ArrowLeftIcon>
                    </IconButton></h1>
                {schedule.goals.map((goal, index) => (<GoalAccordion key={index} goal={goal}></GoalAccordion>))}
                <Button variant="contained"  disableElevation 
                    sx={{backgroundColor: 'black', color: 'white', width: '100%', borderRadius: '0px'}} 
                    onClick={() => setCreateGoalModalOpen(true)} 
                >Create Goal</Button>
            </div>
        </div>
        </>)
}