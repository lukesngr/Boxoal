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
import UpdateTimeBoxModal from '../modal/UpdateTimeBoxModal';
import { isRecordingButtonPresent } from '@/modules/coreLogic';

export default function TimeBox(props) {

    const {schedule, time, date, active, dayName, data, overlayFuncs} = props;
    const [pauseActiveOverlay, resumeActiveOverlay] = overlayFuncs;
    const [recordedStartTime, setRecordedStartTime] = useState();
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);
    const [title, setTitle] = useState("");
    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }
    let boxHeight = {height: getHeightForBoxes(numberOfBoxes)};

    function addTimeBox() {
        setTimeBoxFormVisible(true);
        setAddTimeBoxDialogOpen(true);
    }

    function closeTimeBox() {
        setTimeBoxFormVisible(false);
        setAddTimeBoxDialogOpen(false);
    }

    function startRecording() {
        setTimeBoxRecording([data.id, date]);
        pauseActiveOverlay();
        setRecordedStartTime(new Date());
    }

    function stopRecording() {
        setTimeBoxRecording([-1, 0]);
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

    return (
    <div className={'col timeBox'}>
        {/* Add timebox button */}
        {active && !timeBoxFormVisible && !addTimeBoxDialogOpen && !props.data &&
        <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton">
            <FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/>
        </button>}

        {/* Form section of this TimeBox component */}
        {timeBoxFormVisible && <><CreateTimeboxForm schedule={schedule} time={time} date={date} numberOfBoxes={[numberOfBoxes, setNumberOfBoxes]}
        closeTimeBox={closeTimeBox} dayName={dayName} titleFunc={[title, setTitle]} listOfColors={listOfColors}></CreateTimeboxForm>
        <div style={boxHeight} id="placeholderTimeBox">{title}</div></>}

        {/* Normal time box */}
        {data && <UpdateTimeBoxModal render={tags => 
            (<div style={{height: getHeightForBoxes(data.numberOfBoxes), backgroundColor: data.color}} id="timeBox" date-test>    
                <span {...tags} style={{height: getHeightForBoxes}} className="timeboxText">{data.title}</span>
                {isRecordingButtonPresent(data.recordedTimeBoxes, data.reoccuring, date, time) && timeboxRecording[0] == -1 && <button className="recordTimeButton" onClick={startRecording} ><FontAwesomeIcon height={20} width={20} icon={faCircleDot} /></button>}
                {isRecordingButtonPresent(data.recordedTimeBoxes, data.reoccuring, date, time) && timeboxRecording[0] == data.id && timeboxRecording[1] == date 
                && <button className="stopRecordTimeButton" onClick={stopRecording} ><FontAwesomeIcon height={20} width={20} icon={faCircleStop} /></button>}

            </div>)
        } timebox={data}></UpdateTimeBoxModal> }

    </div>)
}