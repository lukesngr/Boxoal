import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import serverIP from "../modules/serverIP";
import { convertToTimeAndDate } from "../modules/formatters";
import dayjs from 'dayjs';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { muiActionButton, muiFormControlStyle, muiInputStyle, muiNonActionButton } from "@/modules/muiStyles";
import styles from "@/styles/muiStyles";

export default function SettingsDialog({ visible, hideDialog, data }) {
    const { user } = useAuthenticator();
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.value);
    
    const [scheduleIndex, setScheduleIndex] = useState(profile.scheduleIndex + 1);
    const [boxSizeNumber, setBoxSizeNumber] = useState(String(profile.boxSizeNumber));
    const [boxSizeUnit, setBoxSizeUnit] = useState(profile.boxSizeUnit);
    const [wakeupTime, setWakeupTime] = useState(dayjs(profile.wakeupTime, 'HH:mm'));
    const [timePickerOpen, setTimePickerOpen] = useState(false);

    function updateProfile() {
        const wakeupTimeAsText = wakeupTime.format('HH:mm');
        const convertedBackBoxSizeNumber = Number(boxSizeNumber);
        
        axios.put('/api/updateProfile', {
            scheduleIndex: (scheduleIndex - 1),
            scheduleID: data[scheduleIndex - 1].id,
            boxSizeUnit,
            boxSizeNumber: convertedBackBoxSizeNumber,
            wakeupTime: wakeupTimeAsText,
            userUUID: user.userId
        }).catch(function(error) {
            console.log(error);
        });

        dispatch({
            type: 'profile/set',
            payload: {
                scheduleIndex: (scheduleIndex - 1),
                scheduleID: data[scheduleIndex - 1].id,
                boxSizeNumber: convertedBackBoxSizeNumber,
                boxSizeUnit,
                wakeupTime: wakeupTimeAsText
            }
        });
        
        hideDialog();
    }

    return (
        <>
            <Dialog
                open={visible}
                onClose={hideDialog}
                PaperProps={styles.paperProps}
            >
                <DialogTitle sx={{ color: 'white' }} className="dialogTitle">Settings</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>

                        <FormControl variant="standard" sx={muiFormControlStyle}>
                            <InputLabel>Schedule</InputLabel>
                            <Select
                                value={scheduleIndex}
                                onChange={(e) => setScheduleIndex(e.target.value)}
                                sx={muiInputStyle}
                            >
                                {data && data.map((schedule, index) => (
                                    <MenuItem key={index} value={index + 1}>
                                        {schedule.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Timebox Duration"
                            value={boxSizeNumber}
                            onChange={(e) => setBoxSizeNumber(e.target.value)}
                            variant="standard"
                            sx={muiInputStyle}
                        />

                        <FormControl variant="standard" sx={muiFormControlStyle}>
                            <InputLabel>Timebox Unit</InputLabel>
                            <Select
                                value={boxSizeUnit}
                                onChange={(e) => setBoxSizeUnit(e.target.value)}
                                sx={muiInputStyle}
                            >
                                <MenuItem value="min">Min</MenuItem>
                                <MenuItem value="hr">Hour</MenuItem>
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div style={{backgroundColor: 'white', padding: '6px'}}>
                            <TimePicker
                                label="Wakeup Time"
                                value={wakeupTime}
                                onChange={(newValue) => {
                                    setWakeupTime(newValue);
                                    setTimePickerOpen(false);
                                }}
                                sx={muiInputStyle}
                            />
                            </div>
                        </LocalizationProvider>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={updateProfile}
                        variant="contained"
                        sx={muiActionButton}
                    >
                        Update
                    </Button>
                    <Button onClick={hideDialog} sx={muiNonActionButton}>
                        Exit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}