import Overlay from '../overlay/Overlay';
import ActiveOverlay from '../overlay/ActiveOverlay';
import RecordingOverlay from '../overlay/RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';
import { ifCurrentDay, ifEqualOrBeyondCurrentDay } from '../../modules/untestableFunctions';
export default function GridHeader({headerContainerRef, dayToName, currentDay}) {
    return (
        <div className="row">
            <div className="col-1"></div>
            
            {dayToName.map((day, index) => (
                <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col '+ifCurrentDay(index, 'currentDay', '')}>
                    <RecordingOverlay day={day}></RecordingOverlay>
                    <span className='timeboxHeadingText'>{day.name}<br />{" ("+day.date+"/"+day.month+")"}</span>
                    {/*ifCurrentDay(index, true, false) ? (<>
                        {/*<ActiveOverlay></ActiveOverlay>
                        <RecordingOverlay></RecordingOverlay>
                    </>) : (<Overlay active={ifEqualOrBeyondCurrentDay(index, true, false)}></Overlay>)
                    <RecordedTimeBoxOverlay day={day}></RecordedTimeBoxOverlay>*/}
                    {day.day == currentDay && <ActiveOverlay></ActiveOverlay>}
                    {day.day < currentDay && <Overlay></Overlay>}
                    
                </div>
            ))}
        </div>
    )
}