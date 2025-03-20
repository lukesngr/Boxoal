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

export default function ManualEntryTimeModal({ visible, close, data, scheduleID, setAlert }) {
    const [recordedStartTime, setRecordedStartTime] = useState(dayjs(data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(dayjs(data.endTime));

    function submitManualEntry() {
        axios.post('/api/createRecordedTimebox', {
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
    }

    return (
        <>
            <Dialog
                open={visible}
                onClose={close}
                PaperProps={{
                    style: {
                        backgroundColor: '#875F9A',
                        borderRadius: '15px'
                    }
                }}
            >
                <DialogTitle sx={{ color: 'white' }}>Manual Entry Of Recorded Time</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{backgroundColor: 'white', padding: '7px'}}>
                            <DateTimePicker label="Start Time" value={recordedStartTime} onChange={(newValue) => setRecordedStartTime(newValue)} />
                        </div>
                        <div style={{backgroundColor: 'white', padding: '7px'}}>
                            <DateTimePicker label="End Time" value={recordedEndTime} onChange={(newValue) => setRecordedEndTime(newValue)}/>
                        </div>
                        </LocalizationProvider>
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
        </>
    );
}