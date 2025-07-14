import { useEffect, useState } from 'react';
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import serverIP from '../../modules/serverIP';
import dayjs from 'dayjs';
import Alert from "../base/Alert";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { muiActionButton, muiDatePicker, muiFormControlStyle, muiInputStyle, muiNonActionButton } from "../../modules/muiStyles";
import styles from '@/styles/muiStyles.js';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as Sentry from "@sentry/nextjs";

export default function EditGoalForm(props) {
    const [title, setTitle] = useState(props.data.title);
    const [targetDate, setTargetDate] = useState(dayjs(props.data.targetDate));
    const [completed, setCompleted] = useState(props.data.completed);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const {scheduleIndex} = useSelector(state => state.profile.value);

    const updateGoalMutation = useMutation({
        mutationFn: (goalData) => axios.put('/api/updateGoal', goalData),
        onMutate: async (goalData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousGoals = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.objectUUID == props.data.objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex] = {...goalData, timeboxes: copyOfOld[scheduleIndex].goals[goalIndex].timeboxes};
                return copyOfOld;
            });
            
            
            return { previousGoals };
        },
        onSuccess: () => {
            props.close();
            setAlert({ open: true, title: "Timebox", message: "Updated goal!" });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            props.close();
            
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
        }
    });

    function updateGoal() {
        let goalData = {
            title,
            targetDate: targetDate.toISOString(),
            objectUUID: props.data.objectUUID,
            completed,
            completedOn: new Date().toISOString(),
            active: !completed
        }
        
        updateGoalMutation.mutate(goalData);

        if(completed) {
            axios.get('/api/setNextGoalToActive', {line: props.data.partOfLine}).then(async () => {
                await queryClient.refetchQueries();
            }).catch(function(error) {
                console.log(error);
            })
        };
    }
    
    function deleteGoal() {
        axios.post('/api/deleteGoal', {
            id: props.data.id
        })
        .then(async () => {   
            props.close();
            setAlert({ open: true, title: "Timebox", message: "Deleted goal!" });
            await queryClient.refetchQueries();
        })
        .catch(function(error) {
            props.close();
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            console.log(error);
        });
    }

    return (
        <>
            <Dialog
                open={props.visible}
                onClose={props.close}
                PaperProps={styles.paperProps}
            >
                <DialogTitle sx={{ color: 'white' }} className='dialogTitle'>Edit Goal</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="standard"
                            className='updateGoalTitle'
                            sx={muiInputStyle}
                        />
                        
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div style={{backgroundColor: 'white', padding: '7px'}}>
                                <DatePicker
                                    label="Target Date"
                                    value={targetDate}
                                    onChange={(newValue) => {
                                        setTargetDate(newValue);
                                        setDatePickerOpen(false);
                                    }}
                                    sx={muiDatePicker}
                                />
                            </div>
                        </LocalizationProvider>
                        
                        
                        <FormControl variant="standard"  sx={muiFormControlStyle}>
                            <InputLabel>Completed</InputLabel>
                            <Select
                                value={completed}
                                onChange={(e) => setCompleted(e.target.value)}
                                sx={muiInputStyle}
                            >
                                <MenuItem value={false}>False</MenuItem>
                                <MenuItem value={true}>True</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={updateGoal}
                        variant="contained"
                        sx={muiActionButton}
                        className='updateGoalButton'
                    >
                        Update
                    </Button>
                    <Button 
                        onClick={deleteGoal} 
                        sx={muiNonActionButton}
                    >
                        Delete
                    </Button>
                    <Button onClick={props.close} sx={muiNonActionButton}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Alert alert={alert} setAlert={setAlert} />
        </>
    );
}