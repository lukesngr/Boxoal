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
    
    const [timeboxFormData, setTimeboxFormData] = useState({
        title: "",
        description: "",
        goalSelected: null,
        reoccurFrequency: "no",
        weeklyDate: new Date(),
        numberOfBoxes: 1
    });
    
    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

    function setTimeBoxVisibility(state) {
        setTimeBoxFormVisible(state);
        setAddTimeBoxDialogOpen(state);
    }

    return (
    <div className={'col timeBox'}>
        {/* Add timebox button */}
        {active && !timeBoxFormVisible && !addTimeBoxDialogOpen && !props.data &&
        <button data-testid="addTimeBoxButton" onClick={() => setTimeBoxVisibility(true)} className="btn btn-dark addBoxButton">
            <FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/>
        </button>}

        {/* Form section of this TimeBox component */}
        {timeBoxFormVisible && <><CreateTimeboxForm time={time} date={date} timeboxFormData={[timeboxFormData, setTimeboxFormData]}
        closeTimeBox={() => setTimeBoxVisibility(true)} dayName={dayName} listOfColors={listOfColors}></CreateTimeboxForm>
        <div style={{height: getHeightForBoxes(numberOfBoxes)}} id="placeholderTimeBox">{title}</div></>}

        {/* Normal time box */}
        {data && <UpdateTimeBoxModal timebox={data} render={tags => 
            (<NormalTimeBox tags={tags} data={data} overlayFuncs={overlayFuncs} recordFuncs={[timeboxRecording, setTimeBoxRecording]}
              height={getHeightForBoxes(data.numberOfBoxes)} date={date} time={time}></NormalTimeBox>)
        }></UpdateTimeBoxModal> }

    </div>)
}