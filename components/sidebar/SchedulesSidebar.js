import '../../styles/schedulessidebar.scss';

import { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { IconButton, Button } from '@mui/material';
import {Paper} from '@mui/material';
import GoalAccordion from './GoalAccordion';
import CreateGoalForm from '../form/CreateGoalForm';
import ParkIcon from '@mui/icons-material/Park';
import { GoalTree } from '../goal/GoalTree';
import CreateScheduleForm from '../form/CreateScheduleForm';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import UpdateScheduleForm from '../form/UpdateScheduleForm';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/modules/queryClient';

export default function SchedulesSidebar(props) {
    const dispatch = useDispatch();
    const [isSideBarMobile, setIsSideBarMobile] = useState(true);
    const [createGoalModalOpen, setCreateGoalModalOpen] = useState(false);
    const [skillTreeOpen, setSkillTreeOpen] = useState(false);
    const [createScheduleDialogOpen, setCreateScheduleDialogOpen] = useState(false);
    const [updateScheduleDialogOpen, setUpdateScheduleDialogOpen] = useState(false);
    const {scheduleIndex} = useSelector(state => state.profile.value);
    const expanded = useSelector(state => state.expanded.value);
    let schedule = props.data[scheduleIndex];

    let smallerThanLargeBreakpoint = useMediaQuery({query: '(max-width: 992px)'});

    useEffect(() => {
        dispatch({type: 'expanded/set', payload: !smallerThanLargeBreakpoint});
        setIsSideBarMobile(smallerThanLargeBreakpoint);
    }, [smallerThanLargeBreakpoint])

    
    let highestActiveIndex = 0;

    for(let i = 0; i < schedule.goals.length; i++) {
        if(schedule.goals[i].active && schedule.goals[i].partOfLine > highestActiveIndex) {
            highestActiveIndex = schedule.goals[i].partOfLine;
        }
    }
    

    return (<>
        <div className={isSideBarMobile ? ("mobileSideBar") : ("col-2")} 
        id={expanded ? ('animateToAppear') : ('animateToDisappear')}>
            <div className="schedulesSidebar">
                <h1 className="sidebarHeading">{schedule.title} 
                    
                    <IconButton onClick={() => dispatch({type: 'expanded/set', payload: !expanded})} className='minimizeButton'>
                        <ArrowLeftIcon></ArrowLeftIcon>
                    </IconButton>
                    <IconButton onClick={() => setSkillTreeOpen(true)} className='minimizeButton'>
                        <ParkIcon></ParkIcon>
                    </IconButton>
                    <IconButton onClick={() => setCreateScheduleDialogOpen(true)} className='minimizeButton'>
                        <AddIcon></AddIcon>
                    </IconButton>
                    <IconButton onClick={() => setUpdateScheduleDialogOpen(true)} className='minimizeButton'>
                        <SettingsIcon></SettingsIcon>
                    </IconButton>
                    </h1>

                {schedule.goals.map((goal, index) => (<GoalAccordion key={index} goal={goal}></GoalAccordion>))}
                <Button variant="contained"  disableElevation 
                    sx={{backgroundColor: 'black', color: 'white', width: '100%', borderRadius: '0px'}} 
                    onClick={() => setCreateGoalModalOpen(true)} 
                >Create Goal</Button>
            </div>
        </div>
        <QueryClientProvider client={queryClient}>
            <CreateScheduleForm open={createScheduleDialogOpen} onClose={() => setCreateScheduleDialogOpen(false)}></CreateScheduleForm>
            <CreateGoalForm visible={createGoalModalOpen} active={true} line={highestActiveIndex+1} close={() => setCreateGoalModalOpen(false)} id={schedule.id}  goals={schedule.goals}></CreateGoalForm>
            <UpdateScheduleForm open={updateScheduleDialogOpen} onClose={() => setUpdateScheduleDialogOpen(false)} oldTitle={schedule.title} id={schedule.id}></UpdateScheduleForm>
        </QueryClientProvider>
        {skillTreeOpen && <GoalTree data={schedule} close={() => setSkillTreeOpen(false)}></GoalTree>}
        </>)
}