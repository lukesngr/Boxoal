import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { convertToTimeAndDate, convertToDayjs } from "../../modules/formatters.js";
import { addBoxesToTime, calculateMaxNumberOfBoxes } from "../../modules/boxCalculations.js";
import { dayToName } from "../../modules/dateCode";

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

    let reoccurFreq = "no";
    let weeklyDayIndex = "0";
    if (data.reoccuring != null) {
        reoccurFreq = data.reoccuring.reoccurFrequency;
        if (reoccurFreq === "weekly") {
            weeklyDayIndex = String(data.reoccuring.weeklyDay);
        }
    }
    const [reoccurFrequency, setReoccurFrequency] = useState(reoccurFreq);
    const [weeklyDay, setWeeklyDay] = useState(weeklyDayIndex);
    const [goalPercentage, setGoalPercentage] = useState(String(data.goalPercentage));

    const {wakeupTime, boxSizeUnit, boxSizeNumber } = useSelector(state => state.profile.value);
    const { timeboxes, goals } = useSelector(state => state.scheduleData.value);

    let [time, date] = convertToTimeAndDate(data.startTime);
    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

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

        if (!data.isTimeblock) {
            data["goal"] = { connect: { id: goalSelected } };
        }

        if (reoccurFrequency === "weekly") {
            updateData["reoccuring"] = { create: { reoccurFrequency: "weekly", weeklyDay: parseInt(weeklyDay) } };
        } else if (reoccurFrequency === "daily") {
            updateData["reoccuring"] = { create: { reoccurFrequency: "daily" } };
        } else if (reoccurFrequency === "no") {
            if (data.reoccuring != null) {
                updateData["reoccuring"] = { delete: true };
            }
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

    function safeSetNumberOfBoxes(number) {
        let amountOfBoxes;
        try {
            amountOfBoxes = Number(number);
        } catch(e) {
            amountOfBoxes = 1;
        }

        if (amountOfBoxes > maxNumberOfBoxes) {
            setNumberOfBoxes('1');
        } else {
            setNumberOfBoxes(String(amountOfBoxes));
        }
    }

    return (<>
        <Alert alert={alert} setAlert={setAlert}/>
        <Dialog
            open={true}
            onClose={closeModal}
            PaperProps={{
                style: {
                    backgroundColor: '#C5C27C',
                    borderRadius: '15px'
                }
            }}
        >
            <DialogTitle sx={{ color: 'white' }}>Edit {data.isTimeblock ? "Timeblock" : "Timebox"}</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
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

                    <TextField
                        label="Number of Boxes"
                        value={numberOfBoxes}
                        onChange={(e) => safeSetNumberOfBoxes(e.target.value)}
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
                            value={reoccurFrequency}
                            onChange={(e) => setReoccurFrequency(e.target.value)}
                            sx={{
                                backgroundColor: 'white',
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'black'
                                }
                            }}
                        >
                            <MenuItem value="no">No</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                        </Select>
                    </FormControl>

                    {reoccurFrequency === 'weekly' && (
                        <FormControl variant="standard" sx={muiFormControlStyle}>
                            <InputLabel>Reoccurring Day</InputLabel>
                            <Select
                                value={weeklyDay}
                                onChange={(e) => setWeeklyDay(e.target.value)}
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
                    )}

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