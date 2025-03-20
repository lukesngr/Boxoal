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

export default function TimeboxActionsForm({ visible, data, date, time, closeModal }) {
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const { boxSizeUnit, boxSizeNumber, scheduleID } = useSelector(state => state.profile.value);
    const dispatch = useDispatch();
    const [manualEntryModalShown, setManualEntryModalShown] = useState(false);
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording.timeboxID === -1;
    const timeboxIsRecording = timeboxRecording.timeboxID === data.id && timeboxRecording.timeboxDate === date;

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
        
        axios.post('/api/createRecordedTimebox', {
            recordedStartTime: recordedStartTime, 
            recordedEndTime: new Date(), 
            timeBox: { connect: { id: data.id } }, 
            schedule: { connect: { id: scheduleID } }
        })
        .then(async () => {
            closeModal();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Added recorded timebox!"
            });
            await queryClient.refetchQueries();
        })
        .catch(function(error) {
            closeModal();
            setAlert({
                open: true,
                title: "Error",
                message: "An error occurred, please try again or contact the developer"
            });
            console.log(error); 
        });
    }
    
    return (
        <>
            {showEditTimeboxForm ? (
                <EditTimeboxForm 
                    data={data} 
                    previousRecording={!noPreviousRecording} 
                    back={() => setShowEditTimeboxForm(false)}
                    setAlert={setAlert}
                />
            ) : (
                <Dialog
                    open={visible}
                    onClose={closeModal}
                    PaperProps={{
                        style: {
                            backgroundColor: '#875F9A',
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
                    <DialogTitle sx={{ color: 'white' }}>{data.title}</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ color: 'white' }}>
                            Actions for "{data.title}" {data.isTimeblock ? "timeblock" : "timebox"}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} sx={{ color: 'white' }}>
                            Close
                        </Button>
                        {noPreviousRecording && timeboxIsntRecording && !data.isTimeblock && (
                            <>
                                <Button
                                    onClick={() => setManualEntryModalShown(true)}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        marginRight: 1,
                                        '&:hover': {
                                            backgroundColor: 'black',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Time Entry
                                </Button>
                                <Button
                                    onClick={startRecording}
                                    variant="contained"
                                    data-testid="recordButton"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        '&:hover': {
                                            backgroundColor: 'black',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Record
                                </Button>
                            </>
                        )}
                        {noPreviousRecording && timeboxIsRecording && !data.isTimeblock && (
                            <Button
                                onClick={stopRecording}
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
                                Stop Recording
                            </Button>
                        )}
                        {timeboxIsntRecording && (
                            <Button
                                onClick={() => setShowEditTimeboxForm(true)}
                                variant="contained"
                                data-testid="editTimebox"
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    marginLeft: 1,
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white'
                                    }
                                }}
                            >
                                Edit
                            </Button>
                        )}
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