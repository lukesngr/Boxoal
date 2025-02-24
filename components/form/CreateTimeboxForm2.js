import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import serverIP from '../../modules/serverIP';
import { dayToName } from '../../modules/dateCode';
import { listOfColors } from '../../styles/styles';
import { calculateMaxNumberOfBoxes, convertToDayjs, addBoxesToTime } from '../../modules/formatters';

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
import Collapse from '@mui/material/Collapse';

export default function CreateTimeboxForm({ visible, time, date, setAlert }) {
    const dispatch = useDispatch();
    const { scheduleID, wakeupTime, boxSizeUnit, boxSizeNumber } = useSelector(state => state.profile.value);
    const { timeboxes, goals } = useSelector(state => state.scheduleData.value);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    const [goalSelected, setGoalSelected] = useState(goals.length === 0 ? -1 : goals[0].id);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [reoccurFrequency, setReoccurFrequency] = useState("no");
    const [weeklyDay, setWeeklyDay] = useState('0');
    const [goalPercentage, setGoalPercentage] = useState('0');

    const maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

    function closeModal() {
        dispatch({ type: 'modalVisible/set', payload: { visible: false, props: {} } });
    }

    function handleSubmit() {
        if (goalSelected === -1) {
            setAlert({
                open: true,
                title: "Error",
                message: "Please create a goal before creating a timebox"
            });
            return;
        }

        let startTime = convertToDayjs(time, date).utc().format();
        let endTime = convertToDayjs(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date).utc().format();
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)];

        let data = {
            title,
            description,
            startTime,
            endTime,
            numberOfBoxes: parseInt(numberOfBoxes),
            color,
            schedule: { connect: { id: scheduleID } },
            goal: { connect: { id: parseInt(goalSelected) } },
            goalPercentage: parseInt(goalPercentage)
        };

        if (reoccurFrequency === "weekly") {
            data["reoccuring"] = { create: { reoccurFrequency: "weekly", weeklyDay: weeklyDay } };
        } else if (reoccurFrequency === "daily") {
            data["reoccuring"] = { create: { reoccurFrequency: "daily" } };
        }

        axios.post(serverIP + '/createTimebox', data)
            .then(async () => {
                closeModal();
                setAlert({
                    open: true,
                    title: "Timebox",
                    message: "Added timebox!"
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

    function safeSetNumberOfBoxes(number) {
        let amountOfBoxes;
        if (number !== '') {
            try {
                amountOfBoxes = Number(number);
            } catch(e) {
                amountOfBoxes = 1;
            }

            if (amountOfBoxes > maxNumberOfBoxes) {
                setNumberOfBoxes('1');
                setAlert({
                    open: true,
                    title: "Error",
                    message: "You cannot create a timebox that exceeds the number of boxes in the schedule"
                });
            } else {
                setNumberOfBoxes(String(amountOfBoxes));
            }
        } else {
            setNumberOfBoxes('');
        }
    }

    return (
        <Dialog
            open={visible}
            onClose={closeModal}
            PaperProps={{
                style: {
                    backgroundColor: '#C5C27C',
                    borderRadius: '15px'
                }
            }}
        >
            <DialogTitle sx={{ color: 'white' }}>Create Timebox</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="standard"
                        data-testid="createTimeboxTitle"
                        sx={{
                            backgroundColor: 'white',
                            '& .MuiInput-underline:before': {
                                borderBottomColor: 'black'
                            }
                        }}
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="standard"
                        data-testid="createTimeboxDescription"
                        sx={{
                            backgroundColor: 'white',
                            '& .MuiInput-underline:before': {
                                borderBottomColor: 'black'
                            }
                        }}
                    />

                    <TextField
                        label="Number of Boxes"
                        value={numberOfBoxes}
                        onChange={(e) => safeSetNumberOfBoxes(e.target.value)}
                        variant="standard"
                        data-testid="createTimeboxBoxes"
                        sx={{
                            backgroundColor: 'white',
                            '& .MuiInput-underline:before': {
                                borderBottomColor: 'black'
                            }
                        }}
                    />

                    <FormControl variant="standard">
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
                            {goals.map((goal) => (
                                <MenuItem key={goal.id} value={goal.id}>
                                    {goal.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Collapse in={moreOptionsVisible}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <FormControl variant="standard">
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
                                <FormControl variant="standard">
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

                            <TextField
                                label="Percentage of Goal"
                                value={goalPercentage}
                                onChange={(e) => setGoalPercentage(e.target.value)}
                                variant="standard"
                                sx={{
                                    backgroundColor: 'white',
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: 'black'
                                    }
                                }}
                            />
                        </div>
                    </Collapse>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} sx={{ color: 'white' }}>
                    Close
                </Button>
                <Button
                    onClick={() => setMoreOptionsVisible(!moreOptionsVisible)}
                    sx={{ color: 'white' }}
                >
                    {moreOptionsVisible ? 'Less Options' : 'More Options'}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    data-testid="createTimebox"
                    sx={{
                        backgroundColor: 'white',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white'
                        }
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}