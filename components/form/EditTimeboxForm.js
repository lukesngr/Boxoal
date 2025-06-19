import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { convertToTimeAndDate, convertToDayjs } from "../../modules/formatters.js";
import { addBoxesToTime, calculateMaxNumberOfBoxes } from "../../modules/boxCalculations.js";
import { Slider, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { dayToName } from "../../modules/dateCode";
import { Stack } from "@mui/material";
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
import Alert from "../base/Alert";
import { muiActionButton, muiFormControlStyle, muiInputStyle, muiToggleButtonStyle } from '@/modules/muiStyles.js';
import styles from "@/styles/muiStyles";
import { useMutation } from "react-query";

export default function EditTimeboxForm({ data, back, previousRecording, numberOfBoxesSetterAndGetter }) {
    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [numberOfBoxes, setNumberOfBoxes] = numberOfBoxesSetterAndGetter;
    const [goalSelected, setGoalSelected] = useState(data.goalID);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const [reoccuring, setReoccuring] = useState(data.reoccuring != null);
    const [isTimeblock, setIsTimeBlock] = useState(data.isTimeblock);
    const [goalPercentage, setGoalPercentage] = useState(String(data.goalPercentage));
    const [startOfDayRange, setStartOfDayRange] = useState(data.reoccuring != null ? (data.reoccuring.startOfDayRange) : 0);
    const [endOfDayRange, setEndOfDayRange] = useState(data.reoccuring != null ? data.reoccuring.endOfDayRange : 0);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    const {wakeupTime, boxSizeUnit, boxSizeNumber } = useSelector(state => state.profile.value);
    const { timeboxes, goals } = useSelector(state => state.scheduleData.value);
    const {scheduleIndex} = useSelector(state => state.profile.value);
    let [time, date] = convertToTimeAndDate(data.startTime);
    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxGrid, time, date);
    console.log(data);
    function closeModal() {
        setTitle('');
        setDescription('');
        back();
    }

    const updateTimeboxMutation = useMutation({
        mutationFn: (timeboxData) => axios.put('/api/updateTimeBox', timeboxData),
        onMutate: async (timeboxData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                copyOfOld[scheduleIndex].timeboxes[timeboxIndex] = {...timeboxData, recordedTimeBoxes: []};
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex] = {...timeboxData, recordedTimeBoxes: []};
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            setAlert({
                    open: true,
                    title: "Timebox",
                    message: "Updated timebox!"
            });
            //queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
        }
    });

    const deleteTimeboxMutation = useMutation({
        mutationFn: (objectUUID) => axios.post('/api/deleteTimebox', {objectUUID: objectUUID}),
        onMutate: async (objectUUID) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == objectUUID);
                copyOfOld[scheduleIndex].timeboxes.splice(timeboxIndex, 1);
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.splice(timeboxGoalIndex, 1);
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            setAlert({
                open: true,
                title: "Timebox",
                message: "Deleted timebox!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
        }
    });

    function updateTimeBox() {
        let endTime = convertToDayjs(...addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes, date)).utc().format();

        let updateData = {
            isTimeblock,
            id: data.id,
            title,
            color: data.color,
            objectUUID: data.objectUUID,
            description,
            startTime: data.startTime,
            endTime,
            numberOfBoxes: parseInt(numberOfBoxes),
            goalPercentage: parseInt(goalPercentage)
        };

        if(isTimeblock) {
            updateData["goal"] = { connect: { id: goalSelected } };
        }

        if(reoccuring) {
            updateData["reoccuring"] = { create: { startOfDayRange, endOfDayRange } };
        } 

        updateTimeboxMutation.mutate(updateData);
    }

    function deleteTimeBox() {
        deleteTimeboxMutation.mutate(data.objectUUID);
    }

    function clearRecording() {
        axios.post('/api/clearRecording', {
            id: data.id
        })
            .then(async () => {
                setAlert({
                    open: true,
                    title: "Timebox",
                    message: "Cleared recording!"
                });
                await queryClient.refetchQueries();
            })
            .catch(function(error) {
                setAlert({
                    open: true,
                    title: "Error",
                    message: "An error occurred, please try again or contact the developer"
                });
                console.log(error);
            });
    }

    return (<>
        <Alert alert={alert} setAlert={setAlert}/>
        <Dialog
            open={true}
            onClose={closeModal}
            PaperProps={styles.paperProps}
            hideBackdrop={true}
            disableScrollLock={true}
        >
            <DialogTitle className="dialogTitle">Edit {data.isTimeblock ? "Timeblock" : "Timebox"}</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    
                    <div>
                        <Typography className="numberOfBoxesLabel">Number Of Boxes</Typography>

                        <Slider value={parseInt(numberOfBoxes)} 
                                onChange={(e) => setNumberOfBoxes(e.target.value)}
                                min={1}
                                max={maxNumberOfBoxes}
                                valueLabelDisplay="auto"
                                sx={{ color: 'white', marginLeft: '10px', width: '90%', paddingBottom: '0px' }}
                        />
                    </div>
                    <ToggleButtonGroup
                        color="primary"
                        value={isTimeblock}
                        exclusive
                        onChange={(event, newMode) => {setIsTimeBlock(newMode)}}
                        sx={{'& .MuiToggleButton-root': {borderRadius: 0}}}
                        fullWidth
                        >
                        <ToggleButton sx={muiToggleButtonStyle} value={false}>Timebox</ToggleButton>
                        <ToggleButton sx={muiToggleButtonStyle} value={true}>Timeblock</ToggleButton>
                    </ToggleButtonGroup>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="standard"
                        data-testid="editTitle"
                        sx={muiInputStyle}
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="standard"
                        sx={muiInputStyle}
                    />

                    {!data.isTimeblock && <FormControl variant="standard" sx={muiFormControlStyle}>
                        <InputLabel>Goal</InputLabel>
                        <Select
                            value={goalSelected}
                            onChange={(e) => setGoalSelected(e.target.value)}
                            sx={muiInputStyle}
                        >
                            {goals.map((goal) => {
                                if(goal.active) {
                                    return (
                                    <MenuItem key={goal.id} value={goal.id}>
                                        {goal.title}
                                    </MenuItem>
                                    )
                            }})}
                        </Select>
                    </FormControl>}

                    <FormControl variant="standard" sx={muiFormControlStyle}>
                        <InputLabel>Reoccurring</InputLabel>
                        <Select
                            value={reoccuring}
                            onChange={(e) => setReoccuring(e.target.value)}
                            sx={muiInputStyle}
                        >
                            <MenuItem value={false}>No</MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                        </Select>
                    </FormControl>

                    {reoccuring && (
                        <Stack direction="row" spacing={2}>
                            <FormControl variant="standard" sx={{...muiFormControlStyle, flexGrow: 1}}>
                                <InputLabel>Start Day</InputLabel>
                                <Select
                                    value={startOfDayRange}
                                    onChange={(e) => setStartOfDayRange(e.target.value)}
                                    sx={muiInputStyle}
                                >
                                    {dayToName.map((day, index) => (
                                        <MenuItem key={index} value={index}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <p>to</p>
                            <FormControl variant="standard" sx={{ ...muiFormControlStyle, flexGrow: 1 }}>
                                <InputLabel>End Day</InputLabel>
                                <Select
                                    value={endOfDayRange}
                                    onChange={(e) => setEndOfDayRange(e.target.value)}
                                    sx={muiInputStyle}
                                >
                                    {dayToName.map((day, index) => (
                                        <MenuItem key={index} value={index}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>)}

                    {!data.isTimeblock && <TextField
                        label="Percentage of Goal"
                        value={goalPercentage}
                        onChange={(e) => setGoalPercentage(e.target.value)}
                        variant="standard"
                        sx={muiInputStyle}
                    />}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={updateTimeBox}
                    variant="contained"
                    sx={muiActionButton}
                >
                    Update
                </Button>
                <Button
                    onClick={deleteTimeBox}
                    variant="contained"
                    data-testid="deleteTimebox"
                    sx={muiActionButton}
                >
                    Delete
                </Button>
                {previousRecording && (
                    <Button
                        onClick={clearRecording}
                        variant="contained"
                        data-testid="clearRecording"
                        sx={muiActionButton}
                    >
                        Clear Recording
                    </Button>
                )}
                <Button onClick={closeModal} sx={{ color: 'white' }}>
                    Back
                </Button>
            </DialogActions>
        </Dialog>
        </>);
}