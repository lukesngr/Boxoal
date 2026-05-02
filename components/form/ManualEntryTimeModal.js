import { useState } from "react";
import { useDispatch } from "react-redux";
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
import styles from "@/styles/muiStyles";
import { muiActionButton, muiDatePicker, muiNonActionButton } from "@/modules/muiStyles";
import createRecordingMut from "@/hooks/createRecordingMut.js"; 	
import useCreateBoxMut from "@/hooks/useCreateBoxMut";
import { convertToTimeAndDate } from "@/modules/formatters";
import { reoccurringBoxOnOriginalDate } from "@/modules/dateCode";

export default function ManualEntryTimeModal({ visible, close, data, scheduleID }) {
    const dispatch = useDispatch();
    const [recordedStartTime, setRecordedStartTime] = useState(dayjs(data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(dayjs(data.endTime));
    const createRecordingMutation = createRecordingMut(data, close, dispatch)
    const createTimeboxMutation = useCreateBoxMut(data.goalID);

    async function submitManualEntry() {
       let timeboxData; //alot of redundant code here but alas dont want to fix just yet
	const [time, date] = convertToTimeAndDate(recordedStartTime);
	const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
	const headers = {
	      headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
        }};
	if(!reoccurringBoxOnOriginalDate(data.startTime, date, time)) {
		const startTimeAsDate = new Date(data.startTime)
	  	const differenceInMinutes = (new Date(data.endTime).getTime() - startTimeAsDate.getTime()) / 60000;
		const startTime = dayjs().hour(startTimeAsDate.getHours()).minute(startTimeAsDate.getMinutes())
			.year(recordedStartTime.year()).month(recordedStartTime.month()).date(recordedStartTime.date());
		let endTime = startTime;
		endTime = endTime.add(differenceInMinutes, 'm')
		timeboxData = {...data,
		  objectUUID: crypto.randomUUID(),
		  startTime: startTime.utc().format(),
		  endTime: endTime.utc().format(),
		  schedule: {connect: {id: scheduleID}},
		  goal: {connect: {id: data.goalID}},
		  recordedTimeBox: {
		    create: {
                      recordedStartTime: recordedStartTime.toISOString(), 
                      recordedEndTime: recordedEndTime.toISOString(), 
                      schedule: { connect: { id: scheduleID } },
            	      objectUUID: crypto.randomUUID(),
		    }
                  }
                }
		delete timeboxData.goalID;
		delete timeboxData.reoccuring;
		createTimeboxMutation.mutate({timeboxData, headers});
	}else{
		timeboxData = data;
	        const recordingData = {
            	  recordedStartTime: recordedStartTime.toISOString(), 
                  recordedEndTime: recordedEndTime.toISOString(), 
                  timeBox: { connect: { objectUUID: timeboxData.objectUUID } }, 
                  schedule: { connect: { id: scheduleID } },
                  objectUUID: crypto.randomUUID(),
        	};
        	createRecordingMutation.mutate({recordingData, headers});
	}    }

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
