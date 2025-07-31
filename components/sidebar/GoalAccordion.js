import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import EditGoalForm from '../goal/EditGoalForm';
import TimeboxAsListItem from '../timebox/TimeboxAsListItem';
import dayjs from 'dayjs';

export default function GoalAccordion(props) {
    const [timeboxesListShown, setTimeboxesListShown] = useState(false);
    const [goalShown, setGoalShown] = useState(false);
    
    
    return (!props.goal.active ? <></> : (
    <>  
        <EditGoalForm visible={goalShown} close={() => setGoalShown(false)} data={props.goal}></EditGoalForm>
        <div className="goalAccordion" >      
            <span className='goalTitle'>{props.goal.title} by {dayjs(props.goal.targetDate).format('D/M')}</span>
            <IconButton style={{float: 'inline-end', padding: '5px', color: 'white'}} onClick={() => setTimeboxesListShown(!timeboxesListShown)}>
                <ExpandMoreIcon></ExpandMoreIcon>
            </IconButton>
            <IconButton style={{float: 'inline-end', padding: '5px', color: 'white'}} className='openUpdateGoalButton' onClick={() => setGoalShown(true)}>
                <SettingsIcon></SettingsIcon>
            </IconButton>
            
            
        </div>
        {timeboxesListShown && props.goal.timeboxes.map((timebox, index) => <TimeboxAsListItem key={index} data={timebox}></TimeboxAsListItem>)}
    </>))
}