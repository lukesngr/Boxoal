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

import Stack from '@mui/material/Stack';
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
import { muiActionButton, muiFormControlStyle, muiInputStyle, muiNonActionButton, muiToggleButtonStyle } from '@/modules/muiStyles.js';
import Alert from '../base/Alert.js';
import { ToggleButton, ToggleButtonGroup, Slider, Typography } from '@mui/material';

const listOfColors = ["#00E3DD", "#00C5E6", "#00A4E7", "#0081DC", "#1E5ABF", "#348D9D", "#67D6FF"]

export default function CreateTimeboxForm({ visible, time, date, close, numberOfBoxes, setNumberOfBoxes, day, title, setTitle }) {
    const dispatch = useDispatch();
    const { scheduleID, wakeupTime, boxSizeUnit, boxSizeNumber } = useSelector(state => state.profile.value);
    const { timeboxes, goals } = useSelector(state => state.scheduleData.value);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    
    const activeGoals = goals.filter(goal => goal.active);
    const [description, setDescription] = useState("");
    const [goalSelected, setGoalSelected] = useState(String(activeGoals.length == 0 ? -1 : activeGoals[0].id));
    const [isTimeblock, setIsTimeBlock] = useState(false);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [reoccuring, setReoccuring] = useState(false);
    const [startOfDayRange, setStartOfDayRange] = useState(0);
    const [endOfDayRange, setEndOfDayRange] = useState(6);
    const [goalPercentage, setGoalPercentage] = useState('0');
    const [alert, setAlert] = useState({ open: false, title: "", message: "" });
    let transformPercentages = ['35%', '45%', '55%', '65%', '40%', '50%', '55%'];

    const maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxGrid, time, date);

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

            if (reoccuring) {
                data["reoccuring"] = { create: { startOfDayRange, endOfDayRange } };
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

    return (<>
        <Alert alert={alert} setAlert={setAlert}/>
        <Dialog
            open={visible}
            onClose={closeModal}
            PaperProps={{
                style: {
                    backgroundColor: '#875F9A',
                    borderRadius: '0px',
                    position: 'absolute',
                    left: transformPercentages[day], 
                }
            }}
            hideBackdrop={true}
            disableScrollLock={true}
        >
            <DialogTitle className='dialogTitle'>Create {isTimeblock ? "Timeblock" : "Timebox"}</DialogTitle>
            <DialogContent>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <div>
                        <Typography className='numberOfBoxesLabel'>Number Of Boxes</Typography>

                        <Slider value={parseInt(numberOfBoxes)} 
                                onChange={(e) => setNumberOfBoxes(e.target.value)}
                                min={0}
                                max={maxNumberOfBoxes}
                                valueLabelDisplay="auto"
                                sx={{ color: 'white', marginLeft: '10px', width: '90%', paddingBottom: '0px' }}
                        />
                    </div>
                    <ToggleButtonGroup
                    color="primary"
                    value={isTimeblock}
                    exclusive
                    onChange={(event, newMode) => setIsTimeBlock(newMode)}
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
                    {!isTimeblock && <FormControl variant="standard" sx={muiFormControlStyle}>
                        <InputLabel>Goal</InputLabel>
                        <Select
                            value={goalSelected}
                            onChange={(e) => setGoalSelected(e.target.value)}
                            sx={muiInputStyle}
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
                                    sx={muiInputStyle}
                                >
                                    <MenuItem value={false}>No</MenuItem>
                                    <MenuItem value={true}>Yes</MenuItem>
                                </Select>
                            </FormControl>

                            {reoccuring && (
                                <Stack direction="row" spacing={2}>
                                    <FormControl variant="standard" sx={{ ...muiFormControlStyle, flexGrow: 1 }}>
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
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    data-testid="createTimebox"
                    sx={muiActionButton}
                >
                    Create
                </Button>
                <Button
                    onClick={() => setMoreOptionsVisible(!moreOptionsVisible)}
                    sx={muiNonActionButton}
                >
                    {moreOptionsVisible ? 'Less Options' : 'More Options'}
                </Button>
                <Button onClick={closeModal} sx={muiNonActionButton}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        </>);
}