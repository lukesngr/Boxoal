import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/timebox.scss';
import { useState } from 'react';
import '../styles/addtimebox.scss';

export default function TimeBox(props) {

    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);

    function addTimeBox() {
        setTimeBoxFormVisible(true);
    }

    return (
    <div className={props.active ? 'col-1 timeBox' : 'col-1 inactiveTimebox'}>
        {timeBoxFormVisible && <div id="addTimeBox">
            <div id="timeBoxBubble"></div>
            <button onClick={() => setTimeBoxFormVisible(false)} id="addTimeBoxExitButton">X</button>
            <form>
                <h4>Add TimeBox</h4>
                <label for="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input><br />
                <label for="description">Description</label>
                <input type="text" name="description" id="description" placeholder="Description"></input><br />
                <label for="boxes">Boxes</label>
                <input min="1" type="number" name="boxes" id="boxes" placeholder="Boxes" value={numberOfBoxes} onChange={(e) => setNumberOfBoxes(e.target.value)}></input><br />
                <button id="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>}
        {timeBoxFormVisible && <div id="placeholderTimeBox">{title}</div>}
        {props.active && !timeBoxFormVisible && <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton"><FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/></button>}
    </div>)
}