import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from "@/modules/queryClient";
import { useAuthenticator } from "@aws-amplify/ui-react";
import * as Sentry from "@sentry/nextjs";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from "../base/Alert";
import styles from "@/styles/muiStyles";
import { muiActionButton, muiInputStyle, muiNonActionButton } from "@/modules/muiStyles";

export default function CreateScheduleForm({ open, onClose }) {
    const [title, setTitle] = useState("");
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const { user } = useAuthenticator();
    
    async function createSchedule() {
        try {
            await axios.post('/api/createSchedule', {
                title,
                userUUID: user.userId,
            });
            onClose();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Created schedule!"
            });
            await queryClient.refetchQueries();
        } catch (error) {
            onClose();
            setAlert({
                open: true,
                title: "Error",
                message: "An error occurred, please try again or contact the developer"
            });
            
        }
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
                Create Schedule
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

