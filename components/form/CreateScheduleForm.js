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
            console.log(error);
        }
    }

    return (
    <>
        <Alert alert={alert} setAlert={setAlert}/>
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: '#875F9A',
                    borderRadius: '15px'
                }
            }}
        >
            <DialogTitle sx={{ color: 'white' }}>
                Create Schedule
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    label="Title"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                        backgroundColor: 'white',
                        '& .MuiInput-underline:before': {
                            borderBottomColor: 'black'
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: 'black'
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black'
                        },
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: 'white' }}>
                    Close
                </Button>
                <Button 
                    onClick={createSchedule}
                    variant="contained"
                    sx={{ 
                        backgroundColor: 'white',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white'
                        }
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
}

