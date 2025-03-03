import EditTimeboxForm from "../form/EditTimeboxForm"
import { IconButton } from "@mui/material";
import { thereIsNoRecording } from "@/modules/coreLogic";
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";

export default function TimeboxAsListItem(props) {
    const [editTimeboxShown, setEditTimeboxShown] = useState(false);
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    return (
        <>  
        {editTimeboxShown && <EditTimeboxForm close={() => setEditTimeboxShown(false)} data={props.data}></EditTimeboxForm>}
        <div className="goalAccordion" >          
            <span className='goalTitle'>{props.data.title}</span>
            
            <IconButton style={{float: 'inline-end', padding: '5px'}} onClick={() => setEditTimeboxShown(true)}>
                <SettingsIcon></SettingsIcon>
            </IconButton>
            
            
        </div>
    </>
    )
}