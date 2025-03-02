import { useState } from 'react';
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
import { muiFormControlStyle } from "../../modules/muiStyles";

export default function EditGoalForm({ visible, close, data }) {
    const [title, setTitle] = useState(data.title);
    const [priority, setPriority] = useState(""+data.priority);
    const [targetDate, setTargetDate] = useState(dayjs(data.targetDate));
    const [completed, setCompleted] = useState(data.completed);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });

    function updateGoal() {
        axios.put(serverIP+'/updateGoal', {
            title,
            priority: parseInt(priority),
            targetDate: targetDate.toISOString(),
            id: data.id,
            completed,
            completedOn: new Date().toISOString(),
            active: true
        })
        .then(async () => {
            close();
            setAlert({ open: true, title: "Timebox", message: "Updated goal!" });
            await queryClient.refetchQueries();
        })
        .catch(function(error) {
            close();
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            console.log(error);
        });
    }
    
    function deleteGoal() {
        axios.post(serverIP+'/deleteGoal', {
            id: data.id
        })
        .then(async () => {   
            close();
            setAlert({ open: true, title: "Timebox", message: "Deleted goal!" });
            await queryClient.refetchQueries();
        })
        .catch(function(error) {
            close();
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            console.log(error);
        });
    }

    return (
        <>
            <Dialog
                open={visible}
                onClose={close}
                PaperProps={{
                    style: {
                        backgroundColor: '#C5C27C',
                        borderRadius: '15px'
                    }
                }}
                BackdropProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ color: 'white' }}>Edit Goal</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="standard"
                            sx={{
                                backgroundColor: 'white',
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'black'
                                }
                            }}
                        />

                        <TextField
                            label="Priority (1-10)"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            variant="standard"
                            sx={{
                                backgroundColor: 'white',
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'black'
                                }
                            }}
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
                                />
                            </div>
                        </LocalizationProvider>
                        
                        
                        <FormControl variant="standard"  sx={muiFormControlStyle}>
                            <InputLabel>Completed</InputLabel>
                            <Select
                                value={completed}
                                onChange={(e) => setCompleted(e.target.value)}
                                sx={{
                                    backgroundColor: 'white',
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: 'black'
                                    }
                                }}
                            >
                                <MenuItem value={false}>False</MenuItem>
                                <MenuItem value={true}>True</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} sx={{ color: 'white' }}>
                        Close
                    </Button>
                    <Button 
                        onClick={deleteGoal} 
                        sx={{ color: 'white' }}
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={updateGoal}
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
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            
                    
                
            
            <Alert alert={alert} setAlert={setAlert} />
        </>
    );
}