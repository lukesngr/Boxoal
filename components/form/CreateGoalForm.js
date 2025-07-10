import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import serverIP from '../../modules/serverIP';
import { queryClient } from '../../modules/queryClient.js';
import { getMaxNumberOfGoals } from '../../modules/coreLogic.js';
import Alert from '../base/Alert';
import { muiActionButton, muiDatePicker, muiFormControlStyle, muiInputStyle, muiNonActionButton } from "../../modules/muiStyles";

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
import { useProfile } from '@/hooks/useProfile';
import { useSelector } from 'react-redux';
import * as Sentry from "@sentry/nextjs";

export default function CreateGoalForm(props) {
    const [title, setTitle] = useState("");
    const [targetDate, setTargetDate] = useState(dayjs());
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const {scheduleIndex} = useSelector(state => state.profile.value);
    
    let goalsCompleted = props.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
    let goalsNotCompleted = props.goals.length - goalsCompleted;
    let maxNumberOfGoals = getMaxNumberOfGoals(goalsCompleted);

    const createGoalMutation = useMutation({
        mutationFn: (goalData) => axios.post('/api/createGoal', goalData),
        onMutate: async (goalData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousGoals = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                copyOfOld[scheduleIndex].goals.push({...goalData, timeboxes: []});
                console.log(copyOfOld)
                return copyOfOld;
            });
            
            
            return { previousGoals };
        },
        onSuccess: () => {
            props.close();
            setAlert({ open: true, title: "Timebox", message: "Created goal!" });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            props.close();
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            
        }
    });
    
    function createGoal() {
        let goalData = {
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
            active: props.active,
            objectUUID: crypto.randomUUID()
        }

        if (maxNumberOfGoals > goalsNotCompleted || !props.active) {
            createGoalMutation.mutate(goalData);
        } else {
            setAlert({ open: true, title: "Error", message: "Please complete more goals and we will unlock more goal slots for you!" });
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
                            data-testid="createGoalTitle"
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
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={createGoal}
                        variant="contained"
                        data-testid="createGoalButton"
                        sx={muiActionButton}
                    >
                        Create
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