import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from "@/modules/queryClient";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useMutation } from "react-query";

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
import { useEffect } from "react";

export default function UpdateScheduleForm({ schedule, open, onClose }) {
    const [title, setTitle] = useState(schedule.title);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const { user } = useAuthenticator();
    const profile = useSelector(state => state.profile.value);

    useEffect(() => {
        setTitle(schedule.title);
    }, [schedule.title]);

    const updateScheduleMutation = useMutation({
        mutationFn: (scheduleData) => axios.put('/api/updateSchedule', scheduleData),
        onMutate: async (scheduleData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                copyOfOld[profile.scheduleIndex].title = scheduleData.title; 
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            onClose();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Updated schedule!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, scheduleData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            console.log(error);
            onClose();
        }
    });

    const deleteScheduleMutation = useMutation({
        mutationFn: (scheduleData) => axios.post('/api/deleteSchedule', scheduleData),
        onMutate: async (scheduleData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                copyOfOld.splice(profile.scheduleIndex, 1); 
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            let scheduleBefore = (profile.scheduleIndex-1);
            if(profile.scheduleIndex > 0) {
                    dispatch({type: 'profile/set', payload: {...profile, scheduleIndex: scheduleBefore}});
            }
            onClose();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Delete schedule!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, scheduleData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            console.log(error);
            onClose();
        }
    });
    
    async function updateSchedule() {
       updateScheduleMutation.mutate({
                title,
                userUUID: user.userId,
                id: schedule.id
        });
    }

    async function deleteSchedule() {
        
        deleteScheduleMutation.mutate({
                userUUID: user.userId,
                id: schedule.id
        });
            
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

