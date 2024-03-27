import { useContext, useState } from "react";
import { calculateMaxNumberOfBoxes, convertToDateTime, addBoxesToTime } from "@/modules/coreLogic";
import { queryClient } from './../../pages/_app';
import axios from 'axios';
import {toast} from "react-toastify";
import { ScheduleDataContext } from "../timebox/TimeBoxes";
import { useSelector } from "react-redux";

export default function CreateTimeboxForm(props) {
    const listOfColors = ["#00E3DD", "#00C5E6", "#00A4E7", "#0081DC", "#1E5ABF", "#348D9D", "#67D6FF"];
    let {time, date, closeTimeBox, dayName} = props;
    let [timeboxFormData, setTimeboxFormData] = props.timeboxFormData;
    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);
    const {title, description, reoccurFrequency, numberOfBoxes, goalSelected, weeklyDate} = timeboxFormData;


    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);
    
    function handleSubmit(e) {
        e.preventDefault();
        let startTime = convertToDateTime(time, date);
        let endTime = convertToDateTime(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color     
        let data = {
            title, 
            description, 
            startTime, 
            endTime, 
            numberOfBoxes: parseInt(numberOfBoxes), 
            color, 
            schedule: {connect: {id}}, 
            goal: {connect: {id: parseInt(goalSelected)}}
        }

        console.log(goalSelected);

        if(reoccurFrequency != "no") { data["reoccuring"] = {create: {reoccurFrequency: "no"}}; }
        if(reoccurFrequency == "weekly") {data.reoccuring.create.weeklyDay = new Date(weeklyDate).getDay();}

        //post to api
        axios.post('/api/createTimebox', data).then(() => {
            //reset the form
            queryClient.refetchQueries();
            e.target.reset();
            toast.success("Added timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
            console.log(error); 
        })

    }

    function handleChange(e) {
        setTimeboxFormData({...timeboxFormData, [e.target.name]: e.target.value});
    }

    return <>
        <div data-testid="createTimeboxForm" className={(dayName == 'Sat' || dayName == 'Fri' || dayName == 'Thur') ? 'addTimeBoxConstrained' : 'addTimeBox'}> 
            <div className="timeBoxBubble"></div>
            <button onClick={closeTimeBox} className="addTimeBoxExitButton">X</button>
            <form onSubmit={handleSubmit}>
                <h4>Add TimeBox</h4>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Title" onChange={handleChange}></input><br />
                <label htmlFor="description">Description</label>
                <input type="text" name="description" id="description" placeholder="Description" onChange={handleChange}></input><br />
                <label htmlFor="boxes">Boxes</label>
                <input min="1" max={maxNumberOfBoxes} type="number" name="numberOfBoxes" id="boxes" placeholder="Boxes" onChange={handleChange}></input><br />
                <label htmlFor="reoccurFrequency">Reoccuring?</label>
                <select data-testid="reoccurFrequency" name="reoccurFrequency" id="reoccurFrequency" onChange={handleChange}>
                    <option value="no">No</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select><br />
                {timeboxFormData.reoccurFrequency == 'weekly' && 
                    <>
                        <label htmlFor="weeklyDate">Weekly Date</label>
                        <input data-testid="weeklyDate" type="date" name="weeklyDate" id="weeklyDate" onChange={handleChange}></input>
                    </>
                }
                {goals.length == 0 ? (<p data-testid="noGoalsWarning">Must create a goal first</p>) : (
                    <>
                        <label htmlFor="goal">Goal</label>
                        <select name="goalSelected" id="goal" onChange={handleChange}>
                        {goals.map((goal, index) => (
                            <option key={index} value={String(goal.id)}>{goal.name}</option>
                        ))}
                        </select>
                    </>
                )}
                <button data-testid="addTimeBox" disabled={goals.length == 0} className="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>
    </>
}