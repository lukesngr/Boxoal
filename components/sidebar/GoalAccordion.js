import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoalProgressIndicator from '../goal/GoalProgressIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import EditGoalForm from '../goal/EditGoalForm';
import TimeboxAsListItem from '../timebox/TimeboxAsListItem';

export default function GoalAccordion(props) {
    const [timeboxesListShown, setTimeboxesListShown] = useState(false);
    const [goalShown, setGoalShown] = useState(false);
    
    
    return (!props.goal.active ? <></> : (
    <>  
        <EditGoalForm visible={goalShown} close={() => setGoalShown(false)} data={props.goal}></EditGoalForm>
        <div className="goalAccordion" >
            <GoalProgressIndicator goal={props.goal}></GoalProgressIndicator>            
            <span className='goalTitle'>{props.goal.title}</span>
            <IconButton style={{float: 'inline-end', padding: '5px'}} onClick={() => setTimeboxesListShown(!timeboxesListShown)}>
                <ExpandMoreIcon></ExpandMoreIcon>
            </IconButton>
            <IconButton style={{float: 'inline-end', padding: '5px'}} className='openUpdateGoalButton' onClick={() => setGoalShown(true)}>
                <SettingsIcon></SettingsIcon>
            </IconButton>
            
            
        </div>
        {timeboxesListShown && props.goal.timeboxes.map((timebox, index) => <TimeboxAsListItem key={index} data={timebox}></TimeboxAsListItem>)}
    </>))
}