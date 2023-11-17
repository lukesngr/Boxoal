import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/timebox.scss';
import { useState } from 'react';
import '../styles/addtimebox.scss';

export default function TimeBox(props) {

    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);

    function addTimeBox() {
        setTimeBoxFormVisible(true);
    }

    function handleSubmit(event) {
        event.preventDefault();
        let startTime = new Date();
        startTime.setMonth(props.month);
        startTime.setDate(props.date);
        let timeSeparated = props.time.split(":").map(function(num) { return parseInt(num); });
        startTime.setHours(timeSeparated[0]);
        startTime.setMinutes(timeSeparated[1]);
        let endTime = startTime;
        axios.post('/api/createTimebox', {
            title,
            description
        }).catch(function(error) {
            console.log(error);
        })
    }

    return (
    <div className={props.active ? 'col-1 timeBox' : 'col-1 inactiveTimebox'}>
        {timeBoxFormVisible && <div id="addTimeBox">
            <div id="timeBoxBubble"></div>
            <button onClick={() => setTimeBoxFormVisible(false)} id="addTimeBoxExitButton">X</button>
            <form onSubmit={handleSubmit}>
                <h4>Add TimeBox</h4>
                <label for="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input><br />
                <label for="description">Description</label>
                <input type="text" name="description" id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></input><br />
                <label for="boxes">Boxes</label>
                <input min="1" max={props.maxNumberOfBoxes} type="number" name="boxes" id="boxes" placeholder="Boxes" value={numberOfBoxes} onChange={(e) => setNumberOfBoxes(e.target.value)}></input><br />
                <button id="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>}
        {timeBoxFormVisible && <div style={{height: `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)`}} id="placeholderTimeBox">{title}</div>}
        {props.active && !timeBoxFormVisible && <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton"><FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/></button>}
    </div>)
}