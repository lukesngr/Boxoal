import EditTimeboxForm from "../form/EditTimeboxForm"
import { IconButton } from "@mui/material";
import { thereIsNoRecording } from "@/modules/coreLogic";
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";
import { convertToTimeAndDate } from "@/modules/formatters";

export default function TimeboxAsListItem(props) {
    const [editTimeboxShown, setEditTimeboxShown] = useState(false);
    const [time, date] = convertToTimeAndDate(props.data.startTime);
    const noPreviousRecording = thereIsNoRecording(props.data.recordedTimeBox, props.data.reoccuring, date, time);
    return (
        <>  
        {editTimeboxShown && <EditTimeboxForm back={() => setEditTimeboxShown(false)} data={props.data} previousRecording={!noPreviousRecording}></EditTimeboxForm>}
        <div className="timeboxListItem" >          
            <span className='timeboxListItemTitle' style={noPreviousRecording ? {} : {textDecoration: 'line-through'}}>{props.data.title}</span>
            
            <IconButton style={{float: 'inline-end', padding: '5px', color: 'white'}} onClick={() => setEditTimeboxShown(true)}>
                <SettingsIcon></SettingsIcon>
            </IconButton>
            
            
        </div>
    </>
    )
}
