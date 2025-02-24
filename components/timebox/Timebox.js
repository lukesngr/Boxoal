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

    const dispatch = useDispatch();
    const {headerWidth, timeboxHeight} = useSelector(state => state.overlayDimensions.value);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    const profile = useSelector(state => state.profile.value);
    const date = props.day.date+"/"+props.day.month;
    const dayName = props.day.name;
    let data;
    let marginFromTop = 0;
    let numberOfBoxesInSpace = 0;
    let boxesInsideSpace = [];

    if(timeboxGrid) { 
        if(timeboxGrid[date]) {
            boxesInsideSpace = filterTimeGridBasedOnSpace(timeboxGrid[date], profile.boxSizeUnit, profile.boxSizeNumber, props.time);
            numberOfBoxesInSpace = boxesInsideSpace.length;

            if(timeboxGrid[date][props.time]) {
                data = timeboxGrid[date][props.time];
            }else if(numberOfBoxesInSpace == 1) {
                marginFromTop = getMarginFromTopOfTimebox(profile.boxSizeUnit, profile.boxSizeNumber, props.time, boxesInsideSpace[0], timeboxHeight);
                data = timeboxGrid[date][boxesInsideSpace[0]];
            }
        }
    }

    function onPress() {
        if(data) {
            dispatch({type: 'modalVisible/set', payload: {visible: true, props: {data: data, date: date, time: props.time}}});
        }else{
            dispatch({type: 'modalVisible/set', payload: {visible: true, props: {dayName: dayName, date: date, time: props.time}}});
        }
    }

    function expandSchedule() {
        let smallestTimeboxLength = findSmallestTimeBoxLengthInSpace(timeboxGrid[date], boxesInsideSpace);
        if(smallestTimeboxLength % 60 == 0) {
            axios.post(serverIP+'/updateProfile', {...profile, boxSizeNumber: (smallestTimeboxLength / 60), boxSizeUnit: 'hr'}).catch(function(error) { console.log(error); });
            dispatch({type: 'profile/set', payload: {...profile, boxSizeNumber: smallestTimeboxLength, boxSizeUnit: 'hr'}});
        }else{
            axios.post(serverIP+'/updateProfile', {...profile, boxSizeNumber: smallestTimeboxLength, boxSizeUnit: 'min'}).catch(function(error) { console.log(error); });
            dispatch({type: 'profile/set', payload: {...profile, boxSizeNumber: smallestTimeboxLength, boxSizeUnit: 'min'}});
        }
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

        {numberOfBoxesInSpace < 2 ? (
            <Pressable onPress={onPress}>
                {numberOfBoxesInSpace == 1 ? (<NormalTimebox marginFromTop={marginFromTop} data={data}></NormalTimebox>) : (<Text style={{width: '100%', height: '100%'}}></Text>)}
            </Pressable>
        ) : (
            <Pressable style={{alignContent: 'center', alignItems: 'center'}} onPress={expandSchedule}>
                <FontAwesomeIcon style={{width: '100%', height: '100%'}} icon={faDiagramPredecessor} size={onDayView ? 60 : 30} />
            </Pressable>
        )}

    </div>)
}