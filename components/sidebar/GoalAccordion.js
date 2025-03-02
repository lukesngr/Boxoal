import { Accordion, AccordionSummary, Typography, AccordionDetails, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoalProgressIndicator from '../goal/GoalProgressIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import EditGoalForm from '../goal/EditGoalForm';

export default function GoalAccordion(props) {
    const [timeboxesListShown, setTimeboxesListShown] = useState(false);
    const [goalShown, setGoalShown] = useState(false);
    console.log(props.goal)
    
    return (
    <>  
        <EditGoalForm visible={goalShown} close={() => setGoalShown(false)} data={props.goal}></EditGoalForm>
        <div className="goalAccordion" >
            <GoalProgressIndicator goal={props.goal}></GoalProgressIndicator>            
            <span className='goalTitle'>{props.goal.title}</span>
            <IconButton style={{float: 'inline-end', padding: '5px'}} onClick={() => setTimeboxesListShown(!timeboxesListShown)}>
                <ExpandMoreIcon></ExpandMoreIcon>
            </IconButton>
            <IconButton style={{float: 'inline-end', padding: '5px'}} onClick={() => setGoalShown(true)}>
                <SettingsIcon></SettingsIcon>
            </IconButton>
            
            
        </div>
        {timeboxesListShown && props.goal.timeboxes.map((timebox, index) => (<p key={index}>{timebox.title}</p>))}
    </>)
}