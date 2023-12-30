import { faCirclePlus, faCircleDot, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/timebox.scss';
import { useState, useContext } from 'react';
import '../../styles/addtimebox.scss';
import axios from 'axios';
import { TimeboxContext } from './TimeboxContext';
import {toast} from "react-toastify";
import { queryClient } from './../../pages/_app';
import CreateTimeboxForm from '../form/CreateTimeboxForm';

export default function TimeBox(props) {

    const {schedule, time, date, active, dayName, data, overlayFuncs} = props;
    const [pauseActiveOverlay, resumeActiveOverlay] = overlayFuncs;
    const [recordedStartTime, setRecordedStartTime] = useState();
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);
    const [title, setTitle] = useState("");
    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

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

    console.log(data);

    return (
    <div className={'col timeBox'}>
        {/* Form section of this TimeBox component */}
        <CreateTimeboxForm schedule={schedule} time={time} date={date} numberOfBoxes={[numberOfBoxes, setNumberOfBoxes]}
        closeTimeBox={closeTimeBox} dayName={dayName} timeBoxFormVisible={timeBoxFormVisible} titleFunc={[title, setTitle]} listOfColors={listOfColors}></CreateTimeboxForm>

        {/* Normal time box */}
        {data && <div style={{height: getHeightForBoxes(data.numberOfBoxes), backgroundColor: data.color}} id="timeBox">
            <span className="timeboxText">{data.title}</span>

            {data.recordedTimeBoxes.length == 0 && timeboxRecording == -1 && <button className="recordTimeButton" onClick={startRecording} ><FontAwesomeIcon height={20} width={20} icon={faCircleDot} /></button>}
            {data.recordedTimeBoxes.length == 0 && timeboxRecording == data.id && <button className="stopRecordTimeButton" onClick={stopRecording} ><FontAwesomeIcon height={20} width={20} icon={faCircleStop} /></button>}

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