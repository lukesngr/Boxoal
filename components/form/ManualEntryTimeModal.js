import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { convertToTimeAndDate } from "../../modules/formatters.js";
import dayjs from 'dayjs';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';

export default function ManualEntryTimeModal({ visible, close, data, scheduleID, setAlert, dispatch }) {
    const [recordedStartTime, setRecordedStartTime] = useState(dayjs(data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(dayjs(data.endTime));
    const [startTimePickerOpen, setStartTimePickerOpen] = useState(false);
    const [endTimePickerOpen, setEndTimePickerOpen] = useState(false);

    function submitManualEntry() {
        axios.post(serverIP+'/createRecordedTimebox', {
            recordedStartTime: recordedStartTime.toDate(), 
            recordedEndTime: recordedEndTime.toDate(),
            timeBox: {connect: {id: data.id}}, 
            schedule: {connect: {id: scheduleID}}
        }).then(async () => {
            close();
            setAlert({
                open: true,
                title: "Timebox", 
                message: "Added recorded timebox!"
            });
            await queryClient.refetchQueries();
        }).catch(function(error) {
            close();
            setAlert({
                open: true,
                title: "Error", 
                message: "An error occurred, please try again or contact the developer"
            });
            console.log(error.message); 
        });
        
        let [date, time] = convertToTimeAndDate(data.startTime);
        let timeboxTitle = data.title;
        let timebox = {
            ...data, 
            recordedTimeBoxes: [{
                recordedStartTime: recordedStartTime.toDate(), 
                recordedEndTime: recordedEndTime.toDate(), 
                title: timeboxTitle
            }]
        };
        dispatch({type: 'modalVisible/set', payload: {visible: true, props: {data: timebox, date, time}}});
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
                <DialogTitle sx={{ color: 'white' }}>Manual Entry Of Recorded Time</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Button 
                            onClick={() => setStartTimePickerOpen(true)}
                            variant="contained"
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white'
                                },
                                mb: 1
                            }}
                        >
                            Pick Recorded Start Time
                        </Button>
                        <Button 
                            onClick={() => setEndTimePickerOpen(true)}
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
                            Pick Recorded End Time
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} sx={{ color: 'white' }}>
                        Close
                    </Button>
                    <Button
                        onClick={submitManualEntry}
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
                        Enter
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={startTimePickerOpen} 
                onClose={() => setStartTimePickerOpen(false)}
                BackdropProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'none'
                    }
                }}
            >
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={recordedStartTime}
                            onChange={(newValue) => {
                                setRecordedStartTime(newValue);
                                setStartTimePickerOpen(false);
                            }}
                        />
                    </LocalizationProvider>
                </DialogContent>
            </Dialog>

            <Dialog 
                open={endTimePickerOpen} 
                onClose={() => setEndTimePickerOpen(false)}
                BackdropProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'none'
                    }
                }}
            >
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={recordedEndTime}
                            onChange={(newValue) => {
                                setRecordedEndTime(newValue);
                                setEndTimePickerOpen(false);
                            }}
                        />
                    </LocalizationProvider>
                </DialogContent>
            </Dialog>
        </>
    );
}