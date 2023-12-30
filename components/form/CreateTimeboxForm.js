import { useState } from "react";
import { calculateMaxNumberOfBoxes, convertToDateTime, addBoxesToTime } from "@/modules/dateLogic";
import { queryClient } from './../../pages/_app';
import axios from 'axios';
import {toast} from "react-toastify";

export default function CreateTimeboxForm(props) {
    let {schedule, time, date, closeTimeBox, dayName, timeBoxFormVisible, titleFunc, listOfColors, ...theRest} = props;
    let [numberOfBoxes, setNumberOfBoxes] = props.numberOfBoxes;
    let [title, setTitle] = props.titleFunc;
    let initialSelectedGoal;
    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(schedule, time, date);

    if(schedule.goals.length > 0) {
        initialSelectedGoal = schedule.goals[0].id;
    }else{
        initialSelectedGoal = null;
    }

    const [goalSelected, setGoalSelected] = useState(initialSelectedGoal);
    const [description, setDescription] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        let startTime = convertToDateTime(time, date);
        let endTime = convertToDateTime(addBoxesToTime(schedule.boxSizeUnit, schedule.boxSizeNumber, time, numberOfBoxes), date); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color

        if(goalSelected === null) { toast.error("No goal selected, please select or make one"); }

        //post to api
        axios.post('/api/createTimebox', 
            {title, description, startTime, endTime, numberOfBoxes: parseInt(numberOfBoxes), color, schedule: {connect: {id: schedule.id}}, goal: {connect: {id: parseInt(goalSelected)}}}
        ).then(() => {
            //reset the form
            queryClient.refetchQueries();
            closeTimeBox();
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

    return <>
        {timeBoxFormVisible && <div id={(dayName == 'Sat' || dayName == 'Fri') ? 'addTimeBoxConstrained' : 'addTimeBox'}> 
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
                <select value={goalSelected} onChange={(e) => {setGoalSelected(e.target.value)}}>
                    {schedule.goals.map((goal) => (
                        <option value={String(goal.id)}>{goal.name}</option>
                    ))}
                </select>
                <button id="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>}
    </>
}