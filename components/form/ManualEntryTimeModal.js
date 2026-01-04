import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { queryClient } from '../../modules/queryClient.js';
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
import { muiActionButton, muiDatePicker, muiNonActionButton } from "@/modules/muiStyles";
import createRecordingMut from "@/hooks/createRecordingMut.js"; 	

export default function ManualEntryTimeModal({ visible, close, data, scheduleID }) {
    const dispatch = useDispatch();
    const [recordedStartTime, setRecordedStartTime] = useState(dayjs(data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(dayjs(data.endTime));
    const {scheduleIndex} = useSelector(state => state.profile.value);
    const createRecordingMutation = createRecordingMut(data, close, dispatch)

    function submitManualEntry() {
       const recordingData = {
            recordedStartTime: recordedStartTime.toDate(), 
            recordedEndTime: recordedEndTime.toDate(), 
            timeBox: { connect: { id: data.id, objectUUID: data.objectUUID } }, 
            schedule: { connect: { id: scheduleID } },
            objectUUID: crypto.randomUUID(),
        };
        createRecordingMutation.mutate(recordingData);
    }

    return (
      <Dialog open={visible} onClose={close} PaperProps={styles.paperProps}>
        <DialogTitle className="dialogTitle">Manual Entry Of Recorded Time</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{backgroundColor: 'white', padding: '7px'}}>
                <DateTimePicker 
		  label="Start Time" 
		  value={recordedStartTime} 
		  onChange={(newValue) => setRecordedStartTime(newValue)} sx={muiDatePicker}
		/>
              </div>
              <div style={{backgroundColor: 'white', padding: '7px'}}>
                <DateTimePicker 
		  label="End Time" 
		  value={recordedEndTime} 
                  onChange={(newValue) => setRecordedEndTime(newValue)} 
		  sx={muiDatePicker}/>
              </div>
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={submitManualEntry}
            variant="contained"
            sx={muiActionButton}
	  >Enter
          </Button>
          <Button onClick={close} sx={muiNonActionButton}>
             Close
          </Button>
        </DialogActions>
      </Dialog>
    );
}
