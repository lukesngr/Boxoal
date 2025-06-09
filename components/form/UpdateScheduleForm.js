import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from "@/modules/queryClient";
import { useAuthenticator } from "@aws-amplify/ui-react";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from "../base/Alert";
import styles from "@/styles/muiStyles";
import { muiActionButton, muiInputStyle, muiNonActionButton } from "@/modules/muiStyles";
import { useSelector } from "react-redux";

export default function UpdateScheduleForm({ oldTitle, id, open, onClose }) {
    const [title, setTitle] = useState(oldTitle);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const { user } = useAuthenticator();
    const profile = useSelector(state => state.profile.value);
    
    async function updateSchedule() {
        try {
            await axios.put('/api/updateSchedule', {
                title,
                userUUID: user.userId,
                id: id
            });
            onClose();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Updated schedule!"
            });
            await queryClient.refetchQueries();
        } catch (error) {
            onClose();
            setAlert({
                open: true,
                title: "Error",
                message: "An error occurred, please try again or contact the developer"
            });
            console.log(error);
        }
    }

    async function deleteSchedule() {
        let scheduleBefore = (profile.scheduleIndex-1);
        try {
             axios.post('/api/deleteSchedule', {
                userUUID: user.userId,
                id: id
            }).then(() => {
                onClose();
                if(profile.scheduleIndex > 0) {
                    dispatch({type: 'profile/set', payload: {...profile, scheduleIndex: scheduleBefore}});
                }
                setAlert({
                    open: true,
                    title: "Timebox",
                    message: "Deleted schedule!"
                });
                queryClient.refetchQueries();
            })
            
        } catch (error) {
            onClose();
            setAlert({
                open: true,
                title: "Error",
                message: "An error occurred, please try again or contact the developer"
            });
            console.log(error);
        }
        dispatch
    }

    return (
    <>
        <Alert alert={alert} setAlert={setAlert}/>
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={styles.paperProps}
        >
            <DialogTitle className="dialogTitle">
                Update Schedule
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    label="Title"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={muiInputStyle}
                />
            </DialogContent>
            <DialogActions>
                
                <Button 
                    onClick={updateSchedule}
                    variant="contained"
                    sx={muiActionButton}
                >
                    Update
                </Button>
                <Button 
                    onClick={deleteSchedule}
                    variant="contained"
                    sx={muiActionButton}
                >
                    Delete
                </Button>
                <Button onClick={onClose} sx={muiNonActionButton}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
}

