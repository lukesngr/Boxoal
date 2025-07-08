import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "../../redux/activeOverlayInterval";
import serverIP from "../../modules/serverIP";
import { thereIsNoRecording } from "../../modules/coreLogic";
import { useAuthenticator } from "@aws-amplify/ui-react";
import EditTimeboxForm from "./EditTimeboxForm";
import ManualEntryTimeModal from "./ManualEntryTimeModal";
import Alert from "../base/Alert";
import Dialog from '@mui/material/Dialog';
import styles from '@/styles/muiStyles.js';
import { useMutation } from 'react-query';
import { muiActionButton, muiNonActionButton } from '@/modules/muiStyles.js';
import * as Sentry from "@sentry/nextjs";
import TimelineRecording from '../timebox/TimelineRecording.js';

export default function TimeboxActionsForm({ visible, data, date, time, closeModal, numberOfBoxes }) {
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const { boxSizeUnit, boxSizeNumber, scheduleID } = useSelector(state => state.profile.value);
    const dispatch = useDispatch();
    const [manualEntryModalShown, setManualEntryModalShown] = useState(false);
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording.timeboxID === -1;
    const timeboxIsRecording = timeboxRecording.timeboxID === data.id && timeboxRecording.timeboxDate === date;
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
                
                closeModal();
            }
        });

    async function startRecording() {
        // Start recording logic for web version
        dispatch({ type: 'timeboxRecording/set', payload: {
            timeboxID: data.id,
            timeboxDate: date,
            recordingStartTime: new Date().toISOString()
        }});
        dispatch(resetActiveOverlayInterval());
    }

    async function stopRecording() {
        // Stop recording logic for web version
        let recordedStartTime = new Date(timeboxRecording.recordingStartTime);
        dispatch({ type: 'timeboxRecording/set', payload: {
            timeboxID: -1,
            timeboxDate: 0,
            recordingStartTime: 0
        }});
        dispatch(setActiveOverlayInterval());
        
        let recordingData = {
            recordedStartTime: recordedStartTime, 
            recordedEndTime: new Date(), 
            timeBox: { connect: { id: data.id, objectUUID: data.objectUUID } }, 
            schedule: { connect: { id: scheduleID } },
            objectUUID: crypto.randomUUID(),
        };
        createRecordingMutation.mutate(recordingData);
    }
    
    return (
        <>
            {showEditTimeboxForm ? (
                <EditTimeboxForm 
                    data={data} 
                    previousRecording={!noPreviousRecording} 
                    back={() => setShowEditTimeboxForm(false)}
                    setAlert={setAlert}
                    numberOfBoxesSetterAndGetter={numberOfBoxes}
                />
            ) : (
                <Dialog
                    open={visible}
                    onClose={closeModal}
                    PaperProps={styles.paperProps}
                >
                    <DialogTitle className='dialogTitle'>{data.title}</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ color: 'white', fontFamily: 'Kameron, san-serif' }}>
                            {noPreviousRecording ? (`Actions for ${data.title} ${data.isTimeblock ? "timeblock" : "timebox"}`) :
                            ("Timebox and recording comparison")}
                        </Typography>
                        {!noPreviousRecording && <TimelineRecording timeboxStart={data.startTime}
                            timeboxEnd={data.endTime}
                            recordingStart={data.recordedTimeBoxes[0].recordedStartTime}
                            recordingEnd={data.recordedTimeBoxes[0].recordedEndTime}></TimelineRecording>}
                    </DialogContent>
                    <DialogActions>
                        
                        {noPreviousRecording && timeboxIsntRecording && !data.isTimeblock && (
                            <>
                                <Button
                                    onClick={startRecording}
                                    variant="contained"
                                    data-testid="recordButton"
                                    sx={muiActionButton}
                                >
                                    Record
                                </Button>
                                <Button
                                    onClick={() => setManualEntryModalShown(true)}
                                    variant="contained"
                                    sx={muiActionButton}
                                >
                                    Time Entry
                                </Button>
                                
                            </>
                        )}
                        {noPreviousRecording && timeboxIsRecording && !data.isTimeblock && (
                            <Button
                                onClick={stopRecording}
                                variant="contained"
                                sx={muiActionButton}
                            >
                                Stop Recording
                            </Button>
                        )}
                        {timeboxIsntRecording && (
                            <Button
                                onClick={() => setShowEditTimeboxForm(true)}
                                variant="contained"
                                data-testid="editTimebox"
                                sx={muiActionButton}
                            >
                                Edit
                            </Button>
                        )}
                        <Button onClick={closeModal} sx={muiNonActionButton}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <ManualEntryTimeModal
                visible={manualEntryModalShown}
                close={() => setManualEntryModalShown(false)}
                data={data}
                scheduleID={scheduleID}
                setAlert={setAlert}
                dispatch={dispatch}
            />

            <Alert alert={alert} setAlert={setAlert}/>
        </>
    );
}