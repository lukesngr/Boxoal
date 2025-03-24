import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { convertToTimeAndDate, convertToDayjs } from "../../modules/formatters.js";
import { addBoxesToTime, calculateMaxNumberOfBoxes } from "../../modules/boxCalculations.js";
import { Slider, Typography } from "@mui/material";
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
import { muiFormControlStyle, muiInputStyle } from '@/modules/muiStyles.js';

export default function EditTimeboxForm({ data, back, previousRecording }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [numberOfBoxes, setNumberOfBoxes] = useState(String(data.numberOfBoxes));
    const [goalSelected, setGoalSelected] = useState(data.goalID);
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    const [reoccuring, setReoccuring] = useState(data.reoccuring != null);
    const [goalPercentage, setGoalPercentage] = useState(String(data.goalPercentage));
    const [startOfDayRange, setStartOfDayRange] = useState(0);
    const [endOfDayRange, setEndOfDayRange] = useState(6);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);

    const {wakeupTime, boxSizeUnit, boxSizeNumber } = useSelector(state => state.profile.value);
    const { timeboxes, goals } = useSelector(state => state.scheduleData.value);

    let [time, date] = convertToTimeAndDate(data.startTime);
    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxGrid, time, date);

    function closeModal() {
        setTitle('');
        setDescription('');
        setNumberOfBoxes('0');
        back();
    }

    function updateTimeBox() {
        let endTime = convertToDayjs(...addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes, date)).utc().format();

        let updateData = {
            id: data.id,
            title,
            description,
            startTime: data.startTime,
            endTime,
            numberOfBoxes: parseInt(numberOfBoxes),
            goalPercentage: parseInt(goalPercentage)
        };

        if(!data.isTimeblock) {
            updateData["goal"] = { connect: { id: goalSelected } };
        }

        if(reoccuring) {
            updateData["reoccuring"] = { create: { startOfDayRange, endOfDayRange } };
        } 

        axios.put('/api/updateTimeBox', updateData)
            .then(async () => {
                setAlert({
                    open: true,
                    title: "Timebox",
                    message: "Updated timebox!"
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

    function deleteTimeBox() {
        axios.post('/api/deleteTimebox', {
            id: data.id
        })
            .then(async () => {
                setAlert({
                    open: true,
                    title: "Timebox",
                    message: "Deleted timebox!"
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
            PaperProps={{
                style: {
                    backgroundColor: '#875F9A',
                    borderRadius: '15px'
                }
            }}
            hideBackdrop={true}
            disableScrollLock={true}
        >
            <DialogTitle sx={{ color: 'white' }}>Edit {data.isTimeblock ? "Timeblock" : "Timebox"}</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <div>
                        <Typography sx={{color: 'white'}}>Number Of Boxes</Typography>

                        <Slider value={parseInt(numberOfBoxes)} 
                                onChange={(e) => setNumberOfBoxes(e.target.value)}
                                min={0}
                                max={maxNumberOfBoxes}
                                valueLabelDisplay="auto"
                                sx={{ color: 'white', marginLeft: '10px', width: '90%' }}
                        />
                    </div>
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
                            sx={{
                                backgroundColor: 'white',
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'black'
                                }
                            }}
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
                            sx={{
                                backgroundColor: 'white',
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'black'
                                }
                            }}
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
                                    sx={{
                                        backgroundColor: 'white',
                                        '& .MuiInput-underline:before': {
                                            borderBottomColor: 'black'
                                        }
                                    }}
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
                                    sx={{
                                        backgroundColor: 'white',
                                        '& .MuiInput-underline:before': {
                                            borderBottomColor: 'black'
                                        }
                                    }}
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
                <Button onClick={closeModal} sx={{ color: 'white' }}>
                    Back
                </Button>
                <Button
                    onClick={deleteTimeBox}
                    variant="contained"
                    data-testid="deleteTimebox"
                    sx={{
                        backgroundColor: 'white',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white'
                        }
                    }}
                >
                    Delete
                </Button>
                {previousRecording && (
                    <Button
                        onClick={clearRecording}
                        variant="contained"
                        data-testid="clearRecording"
                        sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: 'black',
                                color: 'white'
                            }
                        }}
                    >
                        Clear Recording
                    </Button>
                )}
                <Button
                    onClick={updateTimeBox}
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
        </>);
}