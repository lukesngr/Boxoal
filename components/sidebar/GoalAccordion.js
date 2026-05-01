import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import EditGoalForm from '../goal/EditGoalForm';
import TimeboxAsListItem from '../timebox/TimeboxAsListItem';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

export default function GoalAccordion(props) {
    const [timeboxesListShown, setTimeboxesListShown] = useState(false);
    const [goalShown, setGoalShown] = useState(false);
    const timeboxes = useSelector(state => state.scheduleData.value.timeboxes);
    const timeboxesForGoalID = timeboxes.getFromK1(props.goal.id)
  
    
    return (props.goal.state != "active" ? <></> : (
    <>  
        <EditGoalForm visible={goalShown} close={() => setGoalShown(false)} data={props.goal}></EditGoalForm>
        <div className="goalAccordion" >      
            <span className='goalTitle'>{props.goal.title} by {dayjs(props.goal.targetDate).format('D/M')}</span>
            
            <IconButton style={{marginLeft: 'auto', padding: '5px', color: 'white'}} className='openUpdateGoalButton' onClick={() => setGoalShown(true)}>
                <SettingsIcon></SettingsIcon>
            </IconButton>
            <IconButton style={{padding: '5px', color: 'white'}} onClick={() => setTimeboxesListShown(!timeboxesListShown)}>
                <ExpandMoreIcon></ExpandMoreIcon>
            </IconButton>
            
            
        </div>
        {timeboxesListShown && timeboxesForGoalID.map((timebox, index) => <TimeboxAsListItem key={index} data={timebox}></TimeboxAsListItem>)}
    </>))
}
