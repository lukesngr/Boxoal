import { faCirclePlus, faCircleDot, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {addBoxesToTime, calculateMaxNumberOfBoxes, convertToDateTime} from '@/modules/dateLogic';
import '../../styles/timebox.scss';
import { useState, useContext } from 'react';
import '../../styles/addtimebox.scss';
import axios from 'axios';
import { TimeboxContext } from './TimeboxContext';
import {toast} from "react-toastify";
import { queryClient } from './../../pages/_app';

export default function TimeBox(props) {

    const {schedule, time, date, active, dayName, data, overlayFuncs} = props;
    const [pauseActiveOverlay, resumeActiveOverlay] = overlayFuncs;
    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);
    const [recordedStartTime, setRecordedStartTime] = useState();
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    let initialSelectedGoal;

    if(schedule.goals.length > 0) {
        initialSelectedGoal = schedule.goals[0].id;
    }else{
        initialSelectedGoal = null;
    }

    const [goalSelected, setGoalSelected] = useState(initialSelectedGoal);

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(schedule, time, date);

    function addTimeBox() {
        if(!addTimeBoxDialogOpen) {
            setTimeBoxFormVisible(true);
            setAddTimeBoxDialogOpen(true);
        }
    }

    function closeTimeBox() {
        setTimeBoxFormVisible(false);
        setAddTimeBoxDialogOpen(false);
    }

    function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

    function startRecording() {
        setTimeBoxRecording(data.id);
        pauseActiveOverlay();
        setRecordedStartTime(new Date());
    }

    function stopRecording() {
        setTimeBoxRecording(-1);
        resumeActiveOverlay();
        axios.post('/api/createRecordedTimebox', 
            {recordedStartTime, recordedEndTime: new Date(), timeBox: {connect: {id: data.id}}, schedule: {connect: {id: schedule.id}}
        }).then(() => {
            queryClient.refetchQueries();
            toast.success("Added recorded timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error: "+error, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error); 
        })  
    }

    function handleSubmit(event) {
        event.preventDefault();
        let startTime = convertToDateTime(time, date);
        let endTime = convertToDateTime(addBoxesToTime(schedule, time, numberOfBoxes), date); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color

        if(goalSelected === null) {
            toast.error("No goal selected, please select or make one");
        }

        //post to api
        axios.post('/api/createTimebox', 
            {title, description, startTime, endTime,
                numberOfBoxes, color, schedule: {connect: {id: schedule.id}}, goal: {connect: {id: goalSelected}}}
        ).then(() => {
            //reset the form
            queryClient.refetchQueries();
            setAddTimeBoxDialogOpen(false);
            setTimeBoxFormVisible(false);
            setTitle("");
            setDescription("");
            setNumberOfBoxes(1);
            toast.success("Added timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }

    return (
    <div className={'col timeBox'}>
        {/* Form section of this TimeBox component */}
        {timeBoxFormVisible && <div id={dayName == 'Sat' ? 'addTimeBoxConstrained' : 'addTimeBox'}> 
            <div id="timeBoxBubble"></div>
            <button onClick={closeTimeBox} id="addTimeBoxExitButton">X</button>
            <form onSubmit={handleSubmit}>
                <h4>Add TimeBox</h4>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input><br />
                <label htmlFor="description">Description</label>
                <input type="text" name="description" id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></input><br />
                <label htmlFor="boxes">Boxes</label>
                <input min="1" max={maxNumberOfBoxes} type="number" name="boxes" id="boxes" placeholder="Boxes" value={numberOfBoxes} onChange={(e) => setNumberOfBoxes(e.target.value)}></input><br />
                <label>Goal: </label>
                <select value={goalSelected} onChange={(e) => {console.log(e.target.value); setGoalSelected(e.target.value)}}>
                    {schedule.goals.map((goal) => (
                        <option value={String(goal.id)}>{goal.name}</option>
                    ))}
                </select>
                <button id="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>}

        {/* Normal time box */}
        {data && <div style={{height: getHeightForBoxes(data.numberOfBoxes), backgroundColor: data.color}} id="timeBox">
            <span className="timeboxText">{data.title}</span>

            {timeboxRecording == -1 && <button className="recordTimeButton" onClick={startRecording} ><FontAwesomeIcon height={20} width={20} icon={faCircleDot} /></button>}
            {timeboxRecording == data.id && <button className="stopRecordTimeButton" onClick={stopRecording} ><FontAwesomeIcon height={20} width={20} icon={faCircleStop} /></button>}

        </div>}

        {/* Placeholder */}
        {timeBoxFormVisible && <div style={{height: getHeightForBoxes(numberOfBoxes)}} id="placeholderTimeBox">{title}</div>}

        {/* Add timebox button */}
        {active && !timeBoxFormVisible && !addTimeBoxDialogOpen && !props.data &&
        <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton">
            <FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/>
        </button>}
    </div>)
}