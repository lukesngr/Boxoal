import axios from "axios";
import { useState } from "react";
import { queryClient } from "@/modules/queryClient";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from "@/styles/muiStyles";
import { muiActionButton, muiInputStyle, muiNonActionButton } from "@/modules/muiStyles";
import { useDispatch } from 'react-redux';

export default function CreateScheduleForm({ open, onClose }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const { user } = useAuthenticator();
    
    async function createSchedule() {
        try {
            await axios.post('/api/createSchedule', {
                title,
                userUUID: user.userId,
            });
            onClose();
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Timebox",
                message: "Created schedule!"
            }});
            await queryClient.refetchQueries();
        } catch (error) {
            onClose();
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Error",
                message: "An error occurred, please try again or contact the developer"
            }});
            
        }
    }

    return (
    <>
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={styles.paperProps}
        >
            <DialogTitle className="dialogTitle">
                Create Schedule
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    label="Title"
                    variant="standard"
                    className="createScheduleTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={muiInputStyle}
                />
            </DialogContent>
            <DialogActions>
                
                <Button 
                    className="createScheduleButton" 
                    onClick={createSchedule}
                    variant="contained"
                    sx={muiActionButton}
                >
                    Create
                </Button>
                <Button onClick={onClose} sx={muiNonActionButton}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
}

