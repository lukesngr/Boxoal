import axios from "axios";
import { useState } from "react";
import { queryClient } from "@/modules/queryClient";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useMutation } from "react-query";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from "@/styles/muiStyles";
import { muiActionButton, muiInputStyle, muiNonActionButton } from "@/modules/muiStyles";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function UpdateScheduleForm({ schedule, open, onClose }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(schedule.title);
    const profile = useSelector(state => state.profile.value);

    useEffect(() => {
        setTitle(schedule.title);
    }, [schedule.title]);

    const updateScheduleMutation = useMutation({
        mutationFn: ({scheduleData, headers}) => axios.put('/api/updateSchedule', scheduleData, headers),
        onMutate: async ({scheduleData, headers}) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                const copyOfOld = structuredClone(old);
                copyOfOld[profile.scheduleIndex].title = scheduleData.title; 
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            onClose();
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Timebox",
                message: "Updated schedule!"
            }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
            
            onClose();
        }
    });

    const deleteScheduleMutation = useMutation({
        mutationFn: ({scheduleData, headers}) => axios.post('/api/deleteSchedule', scheduleData, headers),
        onMutate: async () => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                const copyOfOld = structuredClone(old);
                copyOfOld.splice(profile.scheduleIndex, 1); 
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            const scheduleBefore = (profile.scheduleIndex-1);
            if(profile.scheduleIndex > 0) {
                    dispatch({type: 'profile/set', payload: {...profile, scheduleIndex: scheduleBefore}});
            }
            onClose();
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Timebox",
                message: "Deleted schedule!"
            }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
            
            onClose();
        }
    });
    
    async function updateSchedule() {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
	const headers = {
	      headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }};
        let scheduleID = schedule.id;
       updateScheduleMutation.mutate({scheduleData: {title, id: scheduleID}, headers});
    }

    async function deleteSchedule() {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
	const headers = {
	      headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
        }};
	let scheduleID = schedule.id
        deleteScheduleMutation.mutate({scheduleData: {id: scheduleID}, headers});
            
    }

    return (
    <>
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
                    className="updateScheduleTitle"
                    onChange={(e) => setTitle(e.target.value)}
                    sx={muiInputStyle}
                />
            </DialogContent>
            <DialogActions>
                
                <Button 
                    onClick={updateSchedule}
                    variant="contained"
                    sx={muiActionButton}
                    className="updateScheduleButton"
                >
                    Update
                </Button>
                <Button 
                    onClick={deleteSchedule}
                    variant="contained"
                    className="deleteScheduleButton"
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

