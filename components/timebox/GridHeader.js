import Overlay from '../overlay/Overlay';
import ActiveOverlay from '../overlay/ActiveOverlay';
import RecordingOverlay from '../overlay/RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';
import { getCurrentDate, ifCurrentDay, ifEqualOrBeyondCurrentDay } from '../../modules/untestableFunctions';
export default function GridHeader({headerContainerRef, dayToName}) {
    let currentDate = getCurrentDate();
    return (
        <div className="row">
            <div className="col-1"></div>
            
            {dayToName.map((day, index) => (
                <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col '+ifCurrentDay(index, 'currentDay', '')}>
                    <RecordingOverlay day={day}></RecordingOverlay>
                    <span className='timeboxHeadingText'>{day.name}<br />{" ("+day.date+"/"+day.month+")"}</span>
                    {day.date == currentDate && <ActiveOverlay></ActiveOverlay>}
                    {day.date < currentDate && <Overlay></Overlay>}
                </div>
            ))}
        </div>
    )
}