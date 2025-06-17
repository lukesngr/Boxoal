import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { convertToTimeAndDate } from "../../modules/formatters.js";
import dayjs from 'dayjs';
import { useMutation } from "react-query";
import { useSelector } from "react-redux";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import styles from "@/styles/muiStyles";
import { muiActionButton, muiDatePicker, muiInputStyle, muiNonActionButton } from "@/modules/muiStyles";

export default function ManualEntryTimeModal({ visible, close, data, scheduleID, setAlert }) {
    const [recordedStartTime, setRecordedStartTime] = useState(dayjs(data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(dayjs(data.endTime));
    const {scheduleIndex} = useSelector(state => state.profile.value);

    const createRecordingMutation = useMutation({
        mutationFn: (recordingData) => axios.post('/api/createRecordedTimebox', recordingData),
        onMutate: async (recordingData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                //recordedTimeBoxes in schedule
                let copyOfOld = structuredClone(old);
                let recordingDataCopy = structuredClone(recordingData);
                recordingDataCopy.timeBox = data
                copyOfOld[scheduleIndex].recordedTimeboxes.push(recordingDataCopy);

                //recordedTimeboxes in timeboxes
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                copyOfOld[scheduleIndex].timeboxes[timeboxIndex].recordedTimeBoxes.push(recordingDataCopy);

                //recordedTimeBoxes in goals
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(data.goalID));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex].recordedTimeBoxes.push(recordingDataCopy);
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            closeModal();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Added recorded timebox!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            console.log(error);
            closeModal();
        }
    });

    function submitManualEntry() {
       let recordingData = {
            recordedStartTime: recordedStartTime.toDate(), 
            recordedEndTime: recordedEndTime.toDate(), 
            timeBox: { connect: { id: data.id, objectUUID: data.objectUUID } }, 
            schedule: { connect: { id: scheduleID } },
            objectUUID: crypto.randomUUID(),
        };
        createRecordingMutation.mutate(recordingData);
    }

    return (
        <>
            <Dialog
                open={visible}
                onClose={close}
                PaperProps={styles.paperProps}
            >
                <DialogTitle className="dialogTitle">Manual Entry Of Recorded Time</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{backgroundColor: 'white', padding: '7px'}}>
                            <DateTimePicker label="Start Time" value={recordedStartTime} onChange={(newValue) => setRecordedStartTime(newValue)} sx={muiDatePicker}/>
                        </div>
                        <div style={{backgroundColor: 'white', padding: '7px'}}>
                            <DateTimePicker label="End Time" value={recordedEndTime} onChange={(newValue) => setRecordedEndTime(newValue)} sx={muiDatePicker}/>
                        </div>
                        </LocalizationProvider>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={submitManualEntry}
                        variant="contained"
                        sx={muiActionButton}
                    >
                        Enter
                    </Button>
                    <Button onClick={close} sx={muiNonActionButton}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}