import '../../styles/schedulessidebar.scss';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { IconButton, Button } from '@mui/material';
import GoalAccordion from './GoalAccordion';
import CreateGoalForm from '../form/CreateGoalForm';
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
    const schedule = props.data[scheduleIndex];

    const smallerThanLargeBreakpoint = useMediaQuery({query: '(max-width: 992px)'});

    useEffect(() => {
        dispatch({type: 'expanded/set', payload: !smallerThanLargeBreakpoint});
        setIsSideBarMobile(smallerThanLargeBreakpoint);
    }, [smallerThanLargeBreakpoint, dispatch])

    
    let highestActiveIndex = 0;

    for(let i = 0; i < schedule.goals.length; i++) {
        if(schedule.goals[i].active && schedule.goals[i].partOfLine > highestActiveIndex) {
            highestActiveIndex = schedule.goals[i].partOfLine;
        }
    }
    

    return (<>
        <QueryClientProvider client={queryClient}>
            <div className={isSideBarMobile ? ("mobileSideBar") : ("col-2")} 
            id={expanded ? ('animateToAppear') : ('animateToDisappear')}>
                <div className="schedulesSidebar">
                    <span className="sidebarHeading">{schedule.title}</span>
                    <div className="scheduleButtons">
                        <IconButton style={{color: 'white'}} onClick={() => dispatch({type: 'expanded/set', payload: !expanded})} className='minimizeButton'>
                            <ArrowLeftIcon></ArrowLeftIcon>
                        </IconButton>
                        <IconButton style={{color: 'white'}} onClick={() => setCreateScheduleDialogOpen(true)} className='minimizeButton'>
                            <AddIcon></AddIcon>
                        </IconButton>
                        <IconButton style={{color: 'white'}} onClick={() => setUpdateScheduleDialogOpen(true)} className='updateScheduleFormOpen minimizeButton'>
                            <SettingsIcon></SettingsIcon>
                        </IconButton>
                    </div>

                    {schedule.goals.map((goal, index) => (<GoalAccordion key={index} goal={goal}></GoalAccordion>))}
                    <Button variant="contained"  disableElevation className="openCreateGoalForm"
                        sx={{backgroundColor: 'black', color: 'white', width: '100%', borderRadius: '0px'}} 
                        onClick={() => setCreateGoalModalOpen(true)} 
                    >Create Goal</Button>
                </div>
            </div>
        
            <CreateScheduleForm open={createScheduleDialogOpen} onClose={() => setCreateScheduleDialogOpen(false)}></CreateScheduleForm>
            <CreateGoalForm visible={createGoalModalOpen} active={true} line={highestActiveIndex+1} close={() => setCreateGoalModalOpen(false)} id={schedule.id}  goals={schedule.goals}></CreateGoalForm>
            <UpdateScheduleForm open={updateScheduleDialogOpen} onClose={() => setUpdateScheduleDialogOpen(false)} schedule={schedule}></UpdateScheduleForm>
        </QueryClientProvider>
        {skillTreeOpen && <GoalTree data={schedule} close={() => setSkillTreeOpen(false)}></GoalTree>}
        </>)
}