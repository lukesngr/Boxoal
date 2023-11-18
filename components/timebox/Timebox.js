import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ifNumberIsEqualOrBeyondCurrentDay, calculateMaxNumberOfBoxes} from '@/modules/dateLogic';
import '../../styles/timebox.scss';
import { useState } from 'react';
import '../../styles/addtimebox.scss';
import axios from 'axios';

export default function TimeBox(props) {

    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(props.schedule, props.time);

    function addTimeBox() {
        setTimeBoxFormVisible(true);
    }

    function handleSubmit(event) {
        event.preventDefault();
        let endHours = "";
        let endMinutes = "";
        let timeSeparated = props.time.split(":").map(function(num) { return parseInt(num); });

        if(props.schedule.boxSizeUnit == "min") {
            endHours = parseInt(numberOfBoxes*props.schedule.boxSizeNumber) / 60 + parseInt(timeSeparated[0]);
            endMinutes = parseInt(numberOfBoxes*props.schedule.boxSizeNumber) % 60 + parseInt(timeSeparated[1]);
        }
        
        axios.post('/api/createTimebox', {
            title,
            description,
            startTime: props.time,
            endTime: endHours+":"+endMinutes,
            date: props.date,
            numberOfBoxes: parseInt(numberOfBoxes)
        }).catch(function(error) {
            console.log(error);
        })

        setTimeBoxFormVisible(false);
        setDescription("");
        setNumberOfBoxes(1);
        setTitle("");
    }

    console.log(props.dayName)

    return (
    <div className={props.active ? 'col-1 timeBox' : 'col-1 inactiveTimebox'}>
        {timeBoxFormVisible && <div id={props.dayName == 'Sat' ? 'addTimeBoxConstrained' : 'addTimeBox'}>
            <div id="timeBoxBubble"></div>
            <button onClick={() => setTimeBoxFormVisible(false)} id="addTimeBoxExitButton">X</button>
            <form onSubmit={handleSubmit}>
                <h4>Add TimeBox</h4>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input><br />
                <label htmlFor="description">Description</label>
                <input type="text" name="description" id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></input><br />
                <label htmlFor="boxes">Boxes</label>
                <input min="1" max={maxNumberOfBoxes} type="number" name="boxes" id="boxes" placeholder="Boxes" value={numberOfBoxes} onChange={(e) => setNumberOfBoxes(e.target.value)}></input><br />
                <button id="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>}
        {timeBoxFormVisible && <div style={{height: `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)`}} id="placeholderTimeBox">{title}</div>}
        {props.active && !timeBoxFormVisible && <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton"><FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/></button>}
    </div>)
}