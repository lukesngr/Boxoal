import '../../styles/timebox.scss';
import '../../styles/addtimebox.scss';
import NormalTimeBox from './NormalTimeBox';
import { useDispatch, useSelector } from 'react-redux';
import { filterTimeGridBasedOnSpace } from '@/modules/boxCalculations';
import { getMarginFromTopOfTimebox } from '@/modules/boxCalculations';
import { findSmallestTimeBoxLengthInSpace } from '@/modules/boxCalculations';
import { Icon } from '@aws-amplify/ui-react';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import TimeboxInCreation from './TimeboxInCreation';

export default function Timebox(props) {

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
    console.log(data);
    return (
    <div className={'col timeBox'}>

        {numberOfBoxesInSpace < 2 ? (
            <>
            {numberOfBoxesInSpace == 1 && <div onClick={onPress}>
                 <NormalTimeBox marginFromTop={marginFromTop} data={data}></NormalTimeBox>
            </div>}
            {numberOfBoxesInSpace < 1 && <TimeboxInCreation day={props.day.day} date={date} time={props.time}></TimeboxInCreation>}
            </>
        ) : (
            <IconButton onClick={expandSchedule}>
                <CalendarViewDayIcon fontSize='medium'></CalendarViewDayIcon>
            </IconButton>
        )}

    </div>)
}