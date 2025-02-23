import Overlay from '../overlay/Overlay';
import ActiveOverlay from '../overlay/ActiveOverlay';
import RecordingOverlay from '../overlay/RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';
import { ifCurrentDay, ifEqualOrBeyondCurrentDay } from '../../modules/untestableFunctions';
export default function GridHeader({headerContainerRef, dayToName}) {
    return (
        <div className="row">
            <div className="col-1"></div>
            
            {dayToName.map((day, index) => (
                <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col '+ifCurrentDay(index, 'currentDay', '')}>
                    <span className='timeboxHeadingText'>{day.name}<br />{" ("+day.date+"/"+day.month+")"}</span>
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