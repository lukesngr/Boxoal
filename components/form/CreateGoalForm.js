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

export default function CreateGoalForm(props) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("1");
    const [targetDate, setTargetDate] = useState(dayjs());
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    
    let goalsCompleted = props.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
    let goalsNotCompleted = props.goals.length - goalsCompleted;
    let maxNumberOfGoals = getMaxNumberOfGoals(goalsCompleted);

    function createGoal() {
        if (maxNumberOfGoals > goalsNotCompleted || !props.active) {
            axios.post('/api/createGoal', {
                title,
                priority: parseInt(priority),
                targetDate: targetDate.toISOString(),
                schedule: {
                    connect: {
                        id: props.id
                    }
                },
                completed: false,
                completedOn: new Date().toISOString(),
                partOfLine: props.line,
                active: props.active
            })
            .then(async () => {
                props.close();
                setAlert({ open: true, title: "Timebox", message: "Created goal!" });
                await queryClient.refetchQueries();
            })
            .catch(function(error) {
                props.close();
                setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
                console.log(error);
            });
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
                <DialogTitle sx={{ color: 'white' }} className='dialogTitle'>Create Goal</DialogTitle>
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

                        <TextField
                            label="Priority (1-10)"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            variant="standard"
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