import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/timebox.scss';
import { useState, useContext } from 'react';
import '../../styles/addtimebox.scss';
import CreateTimeboxForm from '../form/CreateTimeboxForm';
import UpdateTimeBoxModal from '../modal/UpdateTimeBoxModal';
import NormalTimeBox from './NormalTimeBox';
import { ifEqualOrBeyondCurrentDay } from '@/modules/dateLogic';
import { getHeightForBoxes } from '@/modules/coreLogic';
import { useDispatch, useSelector } from 'react-redux';

export default function TimeBox(props) {

    const {time, day, index} = props;
    const [timeboxFormData, setTimeboxFormData] = useState({
        title: "",
        description: "",
        goalSelected: 1,
        reoccurFrequency: "no",
        weeklyDate: new Date(),
        numberOfBoxes: 1
    });
    const [timeBoxFormVisible, setTimeBoxFormVisible] = useState(false);
    const addTimeBoxDialogOpen = useSelector(state => state.timeboxDialog.value);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    const dispatch = useDispatch();

    let date = day.date+"/"+day.month;
    let dayName = day.name;
    let active = ifEqualOrBeyondCurrentDay(index, true, false)
    let data = timeboxGrid.get(date)?.get(time);

    function setTimeBoxVisibility(state) {
        setTimeBoxFormVisible(state);
        dispatch({type: 'timeboxDialog/set', payload: state});
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
        closeTimeBox={() => setTimeBoxVisibility(false)} dayName={dayName}></CreateTimeboxForm>
        <div style={{height: getHeightForBoxes(timeboxFormData.numberOfBoxes)}} className="placeholderTimeBox">{timeboxFormData.title}</div></>}

        {/* Normal time box */}
        {data && <UpdateTimeBoxModal timebox={data} render={tags => 
            (<NormalTimeBox tags={tags} data={data}
              height={getHeightForBoxes(data.numberOfBoxes)} date={date} time={time}></NormalTimeBox>)
        }></UpdateTimeBoxModal> }

    </div>)
}