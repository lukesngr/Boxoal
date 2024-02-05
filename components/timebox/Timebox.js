import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/timebox.scss';
import { useState, useContext } from 'react';
import '../../styles/addtimebox.scss';
import { TimeboxContext } from './TimeboxContext';
import CreateTimeboxForm from '../form/CreateTimeboxForm';
import UpdateTimeBoxModal from '../modal/UpdateTimeBoxModal';
import NormalTimeBox from './NormalTimeBox';

export default function TimeBox(props) {

    const {schedule, time, date, active, dayName, data, overlayFuncs} = props;
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);
    const [title, setTitle] = useState("");
    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

    function addTimeBox() {
        setTimeBoxFormVisible(true);
        setAddTimeBoxDialogOpen(true);
    }

    function closeTimeBox() {
        setTimeBoxFormVisible(false);
        setAddTimeBoxDialogOpen(false);
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
        <div style={{height: getHeightForBoxes(numberOfBoxes)}} id="placeholderTimeBox">{title}</div></>}

        {/* Normal time box */}
        {data && <UpdateTimeBoxModal timebox={data} render={tags => 
            (<NormalTimeBox tags={tags} data={data} schedule={schedule} overlayFuncs={overlayFuncs} recordFuncs={[timeboxRecording, setTimeBoxRecording]}
              height={getHeightForBoxes(data.numberOfBoxes)} date={date} time={time}></NormalTimeBox>)
        }></UpdateTimeBoxModal> }

    </div>)
}