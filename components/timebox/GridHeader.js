import Overlay from '../overlay/Overlay';
import ActiveOverlay from '../overlay/ActiveOverlay';
import RecordingOverlay from '../overlay/RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';
import '../../styles/timeboxes.scss';

import { useSelector } from 'react-redux';
import { ifCurrentDay, ifEqualOrBeyondCurrentDay } from '../../modules/untestableFunctions';
export default function GridHeader({headerContainerRef, dayToName}) {
    const onDayView = useSelector(state => state.onDayView.value);
    const daySelected = useSelector(state => state.daySelected.value);
    let headerStyles = dayToName.map((day, index) => { return ifCurrentDay(index, 'currentDay', '') });
    let dayToNameModified = onDayView ? [dayToName[daySelected]] : dayToName;
    if(onDayView) {
        headerStyles = ['currentDay onDayViewHeader'];
    }
    return (
        <div className="row">
            <div className="col-1"></div>
            
            {dayToNameModified.map((day, index) => (
                <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col '+headerStyles[index]}>
                    <span className='timeboxHeadingText'>
                        {day.name}
                        {!onDayView && <br />}
                        {" ("+day.date+"/"+day.month+")"}
                    </span>
                    {/*ifCurrentDay(index, true, false) ? (<>
                        {/*<ActiveOverlay></ActiveOverlay>
                        <RecordingOverlay></RecordingOverlay>
                    </>) : (<Overlay active={ifEqualOrBeyondCurrentDay(index, true, false)}></Overlay>)
                    <RecordedTimeBoxOverlay day={day}></RecordedTimeBoxOverlay>*/}
                </div>
            ))}
        </div>
    )
}