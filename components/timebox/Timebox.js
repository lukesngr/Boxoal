import { faCirclePlus, faCircleDot, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {addBoxesToTime, calculateMaxNumberOfBoxes, convertToDateTime} from '@/modules/dateLogic';
import '../../styles/timebox.scss';
import { useState, useContext } from 'react';
import '../../styles/addtimebox.scss';
import axios from 'axios';
import { TimeboxContext } from './TimeboxContext';

export default function TimeBox(props) {

    const {schedule, time, date, active, dayName} = props;
    const [timeBoxProps, setTimeBoxProps] = useState({ formVisible: false, title: "", description: "", numberOfBoxes: 1});
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(schedule, time, date);

    function addTimeBox() {
        if(!addTimeBoxDialogOpen) {
            setTimeBoxProps((prevProps => ({...prevProps, formVisible: true})));
            setAddTimeBoxDialogOpen(true);
        }
    }

    function closeTimeBox() {
        setTimeBoxProps((prevProps => ({...prevProps, formVisible: false})));
        setAddTimeBoxDialogOpen(false);
    }

    function startRecording() {}

    function handleSubmit(event) {
        event.preventDefault();
        let endTime = addBoxesToTime(schedule, time, numberOfBoxes);

        axios.post('/api/createTimebox', {
            title,
            description,
            startTime: convertToDateTime(time, date),
            endTime: convertToDateTime(endTime, date),
            numberOfBoxes: parseInt(numberOfBoxes),
            color: listOfColors[Math.floor(Math.random() * listOfColors.length)],
            schedule: {
                connect: {id: schedule.id}
            }
        }).catch(function(error) {
            console.log(error);
        })

        //reset the form
        setTimeBoxInUse(false);
        setTimeBoxProps({formVisible: false, title: "", description: "", numberOfBoxes: 1});
    }

    return (
    <div className={'col-1 timeBox'}>
        {timeBoxFormVisible && <div id={props.dayName == 'Sat' ? 'addTimeBoxConstrained' : 'addTimeBox'}>
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
                <button id="addTimeBoxButton">Add TimeBox</button>
            </form>
        </div>}
        {props.data && <div style={{height: `calc(${(props.data.numberOfBoxes * 100)}% + ${(props.data.numberOfBoxes - 1) * 2}px)`, backgroundColor: props.data.color}} id="timeBox">
            <span class="timeboxText">{props.data.title}</span>
            {timeboxRecording != -1 ? <button onClick={startRecording} ><FontAwesomeIcon height={25} width={25} icon={faCircleDot} /></button> : 
            <FontAwesomeIcon height={25} width={25} icon={faCircleStop} />}
        </div>}
        {timeBoxFormVisible && <div style={{height: `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)`}} id="placeholderTimeBox">{title}</div>}
        {props.active && !timeBoxFormVisible && !timeBoxInUse && !props.data &&
        <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton"><FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/></button>}
    </div>)
}