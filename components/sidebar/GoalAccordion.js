import { Accordion, AccordionSummary, Typography, AccordionDetails, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoalProgressIndicator from '../goal/GoalProgressIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';

export default function GoalAccordion(props) {
    const [timeboxesListShown, setTimeboxesListShown] = useState(false);
    
    return (
    <>
        <div style={{backgroundColor: '#C5C27C'}}>
            
            <GoalProgressIndicator goal={props.goal}></GoalProgressIndicator>            
            <span>{props.goal.title}</span>
            <IconButton style={{float: 'inline-end', padding: '5px'}} onClick={() => setTimeboxesListShown(!timeboxesListShown)}>
                <ExpandMoreIcon></ExpandMoreIcon>
            </IconButton>
            <IconButton style={{float: 'inline-end', padding: '5px'}}>
                <SettingsIcon></SettingsIcon>
            </IconButton>
            
            
        </div>
        {timeboxesListShown && props.goal.timeboxes.map((timebox, index) => (<p key={index}>{timebox.title}</p>))}
    </>)
}