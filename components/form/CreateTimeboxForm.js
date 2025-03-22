import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import serverIP from '../../modules/serverIP.js';
import { dayToName } from '../../modules/dateCode.js';
import { convertToDayjs } from '../../modules/formatters.js';
import { calculateMaxNumberOfBoxes, addBoxesToTime } from '@/modules/boxCalculations.js';

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
import { muiFormControlStyle, muiInputStyle } from '@/modules/muiStyles.js';
import Alert from '../base/Alert.js';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const listOfColors = ["#00E3DD", "#00C5E6", "#00A4E7", "#0081DC", "#1E5ABF", "#348D9D", "#67D6FF"]

export default function CreateTimeboxForm({ visible, time, date, close, numberOfBoxes, setNumberOfBoxes, day, title, setTitle }) {
    const dispatch = useDispatch();
    const { scheduleID, wakeupTime, boxSizeUnit, boxSizeNumber } = useSelector(state => state.profile.value);
    const { timeboxes, goals } = useSelector(state => state.scheduleData.value);
    
    const activeGoals = goals.filter(goal => goal.active);
    const [description, setDescription] = useState("");
    const [goalSelected, setGoalSelected] = useState(String(activeGoals.length == 0 ? -1 : activeGoals[0].id));
    const [isTimeblock, setIsTimeBlock] = useState(false);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [reoccuring, setReoccuring] = useState(false);
    const [weeklyDay, setWeeklyDay] = useState('0');
    const [goalPercentage, setGoalPercentage] = useState('0');
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    let transformPercentages = ['35%', '45%', '55%', '65%', '40%', '50%', '55%'];

    const maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

    function closeModal() {
        setTitle('');
        setDescription('');
        setNumberOfBoxes('0');
        close();
    }

    function handleSubmit() {
        if (goalSelected == -1 && !isTimeblock) {
            setAlert({
                open: true,
                title: "Error",
                message: "Please create a goal before creating a timebox"
            });
            return;
        }else{

            let startTime = convertToDayjs(time, date).utc().format();
            let endTime = convertToDayjs(...addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes, date)).utc().format();
            let color = isTimeblock ? ('black') : (listOfColors[Math.floor(Math.random() * listOfColors.length)]);

            let data = {
                title,
                description,
                startTime,
                endTime,
                numberOfBoxes: parseInt(numberOfBoxes),
                color,
                schedule: { connect: { id: scheduleID } },
                isTimeblock,
                
                goalPercentage: parseInt(goalPercentage)
            };

            if (!isTimeblock) {
                data["goal"] = { connect: { id: goalSelected } };
            }

            if (reoccurFrequency === "weekly") {
                data["reoccuring"] = { create: { reoccurFrequency: "weekly", weeklyDay: weeklyDay } };
            } else if (reoccurFrequency === "daily") {
                data["reoccuring"] = { create: { reoccurFrequency: "daily" } };
            }

            axios.post('/api/createTimebox', data)
                .then(async () => {
                    setAlert({
                        open: true,
                        title: "Timebox",
                        message: "Added timebox!"
                    });
                    await queryClient.refetchQueries();
                    closeModal();
                })
                .catch(function(error) {
                    setAlert({
                        open: true,
                        title: "Error",
                        message: "An error occurred, please try again or contact the developer"
                    });
                    console.log(error);
                    closeModal();
                });

            
            
        }
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
            open={visible}
            onClose={closeModal}
            PaperProps={{
                style: {
                    backgroundColor: '#875F9A',
                    borderRadius: '15px',
                    position: 'absolute',
                    left: transformPercentages[day], 
                }
            }}
            hideBackdrop={true}
            disableScrollLock={true}
        >
            <DialogTitle sx={{ color: 'white' }}>Create {isTimeblock ? "Timeblock" : "Timebox"}</DialogTitle>
            <DialogContent>
                <ToggleButtonGroup
                    color="primary"
                    value={isTimeblock}
                    exclusive
                    onChange={(event, newMode) => {console.log(newMode); setIsTimeBlock(newMode)}}
                    >
                    <ToggleButton sx={{'&.Mui-selected': { backgroundColor: 'black', color: 'white',  
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white',
                        }, 
                    }}} value={false}>Timebox</ToggleButton>
                    <ToggleButton sx={{'&.Mui-selected': { backgroundColor: 'black', color: 'white',  
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white',
                        }, 
                    }}} value={true}>Timeblock</ToggleButton>
                </ToggleButtonGroup>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="standard"
                        data-testid="createTimeboxTitle"
                        sx={muiInputStyle}
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="standard"
                        data-testid="createTimeboxDescription"
                        sx={muiInputStyle}
                    />

                    <TextField
                        label="Number of Boxes"
                        value={numberOfBoxes}
                        onChange={(e) => safeSetNumberOfBoxes(e.target.value)}
                        variant="standard"
                        data-testid="createTimeboxBoxes"
                        sx={muiInputStyle}
                    />

                    {!isTimeblock && <FormControl variant="standard" sx={muiFormControlStyle}>
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
                            {activeGoals.map((goal) => (
                                    <MenuItem key={goal.id} value={goal.id}>
                                        {goal.title}
                                    </MenuItem>
                                    )
                            )}
                        </Select>
                    </FormControl>}

                    <Collapse in={moreOptionsVisible}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                            {!isTimeblock && <TextField
                                label="Percentage of Goal"
                                value={goalPercentage}
                                onChange={(e) => setGoalPercentage(e.target.value)}
                                variant="standard"
                                sx={muiInputStyle}
                            />}
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
        </>);
}