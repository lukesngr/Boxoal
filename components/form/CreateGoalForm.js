import { useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { queryClient } from '../../modules/queryClient.js';
import { muiActionButton, muiDatePicker, muiInputStyle, muiNonActionButton, muiFormControlStyle } from "../../modules/muiStyles";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from '@/styles/muiStyles';
import { useMutation } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function CreateGoalForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [metric, setMetric] = useState(0);
    const [hasMetric, setHasMetric] = useState(false)
    const [targetDate, setTargetDate] = useState(dayjs());
    const {scheduleIndex} = useSelector(state => state.profile.value);
    const {goalsNotCompleted} = useMemo(() => {
        const goalsCompleted = props.goals.reduce((count, item) => item.state === "completed" ? count + 1 : count, 0);
        const activeGoals = props.goals.filter(item => item.state === "active");
        const goalsNotCompleted = activeGoals.length - goalsCompleted;
        return {goalsNotCompleted};
    }, [props.goals]);
    const {goalLimit} = useSelector(state => state.profile.value);
    

    const createGoalMutation = useMutation({
        mutationFn: (goalData) => axios.post('/api/createGoal', goalData),
        onMutate: async (goalData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousGoals = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                const copyOfOld = structuredClone(old);
                copyOfOld[scheduleIndex].goals.push({...goalData, timeboxes: []});
                return copyOfOld;
            });
            
            
            return { previousGoals };
        },
        onSuccess: () => {
            props.close();
            dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Created goal!" }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            props.close();
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
            
        }
    });
    
    function createGoal() {
        let isActiveOnInTree = props.active ? "active" : "waiting"
        const goalData = {
            title,
            targetDate: targetDate.toISOString(),
            schedule: {
                connect: {
                    id: props.id
                }
            },
            completed: false,
            completedOn: new Date().toISOString(),
            partOfLine: props.line,
            state: isActiveOnInTree,
            objectUUID: crypto.randomUUID()
        }

        if(hasMetric) {
            goalData.metric = Number(metric);
        }
        if (goalLimit > goalsNotCompleted || !props.active) {
            createGoalMutation.mutate(goalData);
        } else {
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "Please complete more goals and we will unlock more goal slots for you!" }});
        }
    }

    return (
        <>
            <Dialog
                open={props.visible}
                onClose={props.close}
                PaperProps={styles.paperProps}
            >
                <DialogTitle className='dialogTitle'>Create Goal</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="standard"
                            className="createGoalTitle"
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
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={createGoal}
                        variant="contained"
                        className="createGoalButton"
                        sx={muiActionButton}
                    >
                        Create
                    </Button>
                    <Button onClick={props.close} sx={muiNonActionButton}>
                        Close
                    </Button>
                    
                </DialogActions>
            </Dialog>
            
        </>
    );
}