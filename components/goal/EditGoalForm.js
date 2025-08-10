import { useState } from 'react';
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import dayjs from 'dayjs';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { muiActionButton, muiDatePicker, muiInputStyle, muiNonActionButton, muiToggleButtonStyle, muiFormControlStyle } from "../../modules/muiStyles";
import styles from '@/styles/muiStyles.js';
import { useMutation } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function EditGoalForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [metric, setMetric] = useState(props.data.metric);
    const [hasMetric, setHasMetric] = useState(props.data.metric === null ? (false) : (true));
    const [targetDate, setTargetDate] = useState(dayjs(props.data.targetDate));
    const [completed, setCompleted] = useState(props.data.state == "completed");
    const {scheduleIndex, wakeupTime} = useSelector(state => state.profile.value);
    const [onLogMetricView, setOnLogMetricView] = useState(false);

    const updateGoalMutation = useMutation({
        mutationFn: (goalData) => axios.put('/api/updateGoal', goalData),
        onMutate: async (goalData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousGoals = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                const copyOfOld = structuredClone(old);
                const goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.objectUUID == props.data.objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex] = {...goalData, timeboxes: copyOfOld[scheduleIndex].goals[goalIndex].timeboxes};
                return copyOfOld;
            });
            
            
            return { previousGoals };
        },
        onSuccess: (goalData) => {
            props.close();
            if(goalData.state === "completed") {
                dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Completed!" }});
            }else{
                dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Updated goal!" }});
            }
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            props.close();
            
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
        }
    });

    function updateGoal() {

        let wakeupTimeSplitted = wakeupTime.split(':');
        let alteredDate = targetDate.hour(wakeupTimeSplitted[0]).minute(wakeupTimeSplitted[1]);

        const goalData = {
            title,
            targetDate: alteredDate.toISOString(),
            objectUUID: props.data.objectUUID,
            completed,
            completedOn: new Date().toISOString(),
            active: !completed,
            state: completed ? "completed" : "active",
        }

        if(hasMetric) {
            goalData.metric = Number(metric);
        }
        
        updateGoalMutation.mutate(goalData);

        if(completed) {
            axios.get('/api/setNextGoalToActive', {line: props.data.partOfLine}).then(async () => {
                await queryClient.refetchQueries();
            }).catch(function() {
            })
        };
    }
    
    function deleteGoal() {
        axios.post('/api/deleteGoal', {
            id: props.data.id
        })
        .then(async () => {   
            props.close();
            dispatch({type: 'alert/set', payload: { open: true, title: "Timebox", message: "Deleted goal!" }});
            await queryClient.refetchQueries();
        })
        .catch(function() {
            props.close();
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
        });

        axios.get('/api/setNextGoalToActive', {line: props.data.partOfLine}).then(async () => {
            await queryClient.refetchQueries();
        }).catch(function() {
        })
    }

     function close() {
        if(onLogMetricView) {
            setOnLogMetricView(false);
            setMetric(props.data.metric);
        }else {
            props.close();
        }
    }

    function logMetric() {
        if(onLogMetricView) {
            const data = {
                date: new Date().toISOString(),
                metric: Number(metric),
                goal: {
                    connect: {
                        id: props.data.id
                    }
                }
            }

            if(metric >= props.data.metric) {
                let wakeupTimeSplitted = wakeupTime.split(':');
                let alteredDate = targetDate.hour(wakeupTimeSplitted[0]).minute(wakeupTimeSplitted[1]);

                const goalData = {
                    title,
                    targetDate: alteredDate.toISOString(),
                    objectUUID: props.data.objectUUID,
                    completed: true,
                    completedOn: new Date().toISOString(),
                    active: !completed,
                    state: "completed",
                }
                
                updateGoalMutation.mutate(goalData);

                if(completed) {
                    axios.get('/api/setNextGoalToActive', {line: props.data.partOfLine}).then(async () => {
                        await queryClient.refetchQueries();
                    }).catch(function() {
                    })
                };
            }else{

                axios.post('/api/logMetric', data)
                .then(async () => {
                    close();
                    dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Logged metric!" }});
                    await queryClient.refetchQueries();
                })
                .catch(function() {
                    close();
                    dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
                });
            }
        }else {
            setOnLogMetricView(true);
        }
    }

   

    return (
        <>
            <Dialog
                open={props.visible}
                onClose={props.close}
                PaperProps={styles.paperProps}
            >
                <DialogTitle sx={{ color: 'white' }} className='dialogTitle'>{onLogMetricView ? ("Log Metric") : ("Edit Goal")}</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                        {onLogMetricView ? (
                            <TextField
                                label="Metric Value"
                                type="number"
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                                variant="standard"
                                sx={muiInputStyle}
                            />
                         ) : (<>
                        <ToggleButtonGroup
                            color="primary"
                            value={completed}
                            exclusive
                            onChange={(event, newMode) => {setCompleted(newMode)}}
                            sx={{'& .MuiToggleButton-root': {borderRadius: 0}}}
                            fullWidth
                            >
                            <ToggleButton sx={muiToggleButtonStyle} value={false}>Not Completed</ToggleButton>
                            <ToggleButton sx={muiToggleButtonStyle} className='goalCompletedButton' value={true}>Completed</ToggleButton>
                        </ToggleButtonGroup>
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
                                    }}
                                    sx={muiDatePicker}
                                />
                            </div>
                        </LocalizationProvider>
                        <FormControl variant="standard" sx={muiFormControlStyle}>
                            <InputLabel>Metric</InputLabel>
                            <Select
                                value={hasMetric}
                                onChange={(e) => setHasMetric(e.target.value)}
                                sx={muiInputStyle}
                                className="openMetric"
                            >
                                <MenuItem value={false}>No</MenuItem>
                                <MenuItem className="turnMetricOn" value={true}>Yes</MenuItem>
                            </Select>
                        </FormControl>

                        {hasMetric && (<>
                                <TextField
                                    label="Metric Value"
                                    type="number"
                                    value={metric}
                                    onChange={(e) => setMetric(e.target.value)}
                                    variant="standard"
                                    sx={muiInputStyle}
                                />
                            </>)}
                        </>)}
                    </div>                    
                </DialogContent>
                <DialogActions>
                    {hasMetric &&
                    <Button
                        onClick={logMetric}
                        variant="contained"
                        sx={muiActionButton}
                        className='updateGoalButton'
                    >
                        Log Metric
                    </Button>}
                    {!onLogMetricView && (<>
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
                        className='deleteGoal'
                    >
                        Delete
                    </Button>
                    </>)}
                    <Button onClick={close} sx={muiNonActionButton}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}