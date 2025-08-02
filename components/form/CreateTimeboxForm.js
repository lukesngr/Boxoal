import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import { dayToName } from '../../modules/dateCode.js';
import { convertToDayjs } from '../../modules/formatters.js';
import { calculateMaxNumberOfBoxes, addBoxesToTime } from '@/modules/boxCalculations.js';
import { useMutation } from 'react-query';
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
import { muiActionButton, muiFormControlStyle, muiInputStyle, muiNonActionButton, muiToggleButtonStyle } from '@/modules/muiStyles.js';
import { ToggleButton, ToggleButtonGroup, Slider, Typography } from '@mui/material';

const listOfColors = ["#606EFE", "#3AFFB0", "#DC5EFB", "#86FB80", "#AF79FB", "#7BFF59", "#639D5E", "#4AF9FF"];

export default function CreateTimeboxForm({ visible, time, date, close, numberOfBoxes, setNumberOfBoxes, day, title, setTitle }) {
    const dispatch = useDispatch();
    const { scheduleID, wakeupTime, boxSizeUnit, boxSizeNumber } = useSelector(state => state.profile.value);
    const { goals } = useSelector(state => state.scheduleData.value);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    
    const activeGoals = goals.filter(goal => (goal.state === "active"));
    const [description, setDescription] = useState("");

    
    
    const [goalSelected, setGoalSelected] = useState(activeGoals.length != 0 ? Number(activeGoals[0].id) : "");
    const [isTimeblock, setIsTimeBlock] = useState(false);
    
    const [reoccuring, setReoccuring] = useState(false);
    const [startOfDayRange, setStartOfDayRange] = useState(0);
    const [endOfDayRange, setEndOfDayRange] = useState(6);
   
    const transformPercentages = ['35%', '45%', '55%', '65%', '40%', '50%', '55%'];

    const maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxGrid, time, date);
    const {scheduleIndex} = useSelector(state => state.profile.value);

    useEffect(() => {
        if(visible) {
            setNumberOfBoxes('1');
        }
    }, [visible, setNumberOfBoxes])

    const createTimeboxMutation = useMutation({
        mutationFn: (timeboxData) => axios.post('/api/createTimebox', timeboxData),
        onMutate: async (timeboxData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                const copyOfOld = structuredClone(old);
                copyOfOld[scheduleIndex].timeboxes.push({...timeboxData, recordedTimeBoxes: []});
                const goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.push({...timeboxData, recordedTimeBoxes: []})
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Timebox",
                message: "Added timebox!"
            }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
            
            //closeModal(true);
        },
        onError: (error, goalData, context) => {
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.setQueryData(['schedule'], context.previousGoals);
            
            queryClient.invalidateQueries(['schedule']);
            
            //closeModal(true);
        }
    });

    function closeModal(exiting = false) {
        setTitle(''); //due to react maintaing internal state of components
        setDescription('');
        setNumberOfBoxes('0');
        if(exiting) {
            close();
        }
    }

    function handleSubmit() {
        if (goalSelected == "" && !isTimeblock) {
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Error",
                message: "Please create a goal before creating a timebox"
            }});
            return;
        }else{

            const startTime = convertToDayjs(time, date).utc().format();
            const endTime = convertToDayjs(...addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes, date)).utc().format();
            const color = isTimeblock ? ('black') : (listOfColors[Math.floor(Math.random() * listOfColors.length)]);

            const data = {
                title,
                description,
                startTime,
                endTime,
                numberOfBoxes: parseInt(numberOfBoxes),
                color,
                schedule: { connect: { id: scheduleID } },
                isTimeblock,
                objectUUID: crypto.randomUUID(),
            };

            if (!isTimeblock) {
                data["goal"] = { connect: { id: Number(goalSelected) } };
            }

            if (reoccuring) {
                data["reoccuring"] = { create: { startOfDayRange, endOfDayRange } };
            } 

            createTimeboxMutation.mutate(data);
        }
    }

    return (<>
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
                        className="createTimeboxTitle"
                        sx={muiInputStyle}
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="standard"
                        className="createTimeboxDescription"
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <FormControl variant="standard" sx={muiFormControlStyle}>
                            <InputLabel>Reoccurring</InputLabel>
                            <Select
                                value={reoccuring}
                                onChange={(e) => setReoccuring(e.target.value)}
                                sx={muiInputStyle}
                                className="openReoccurring"
                            >
                                <MenuItem value={false}>No</MenuItem>
                                <MenuItem className="turnReoccuringOn" value={true}>Yes</MenuItem>
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

                        
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    className="createTimebox"
                    sx={muiActionButton}
                >
                    Create
                </Button>
                
                <Button className='closeCreateTimeboxButton' onClick={closeModal} sx={muiNonActionButton}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        </>);
}