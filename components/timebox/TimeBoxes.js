import { getDayNumbers, returnTimesSeperatedForSchedule, ifNumberIsCurrentDay, ifNumberIsEqualOrBeyondCurrentDay, convertToTimeAndDate, calculateSizeOfOverlayBasedOnCurrentTime} from '@/modules/dateLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { useContext, useEffect, useRef, useState } from 'react';
import { ScheduleContext } from '../schedule/ScheduleContext';
import { TimeboxContextProvider } from "./TimeboxContext";
import Overlay from './Overlay';
import ActiveOverlay from './ActiveOverlay';

export default function TimeBoxes(props) {

    const gridRef = useRef(null);
    const headerRef = useRef(null);
    const boxRef = useRef(null);
    const [overlayDimensions, setOverlayDimensions] = useState(0);
    const [activeOverlayHeight, setActiveOverlayHeight] = useState(0);
    const {month, dayToName} = getDayNumbers();
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);
    let schedule = props.data.data[selectedSchedule];
    const listOfTimes = returnTimesSeperatedForSchedule(schedule);

    let timeBoxGrid = new Map();

    schedule.timeboxes.forEach(function (element) {
        const [time, date] = convertToTimeAndDate(element.startTime);
        if (!timeBoxGrid.has(date)) { timeBoxGrid.set(date, new Map()); }
        timeBoxGrid.get(date).set(time, element);
    });

    function calculateOverlayDimensions() {
        if (gridRef.current && headerRef.current && boxRef.current) {
            const gridHeight = gridRef.current.offsetHeight;
            const headerHeight = headerRef.current.offsetHeight;
            const headerWidth = headerRef.current.offsetWidth;
            const overlayHeight = gridHeight - headerHeight;
            const timeboxHeight = boxRef.current.offsetHeight;
            setOverlayDimensions([headerWidth, overlayHeight, timeboxHeight]);
        }else{
            console.log("oh no")
        }
    };

    useEffect(() => {
        calculateOverlayDimensions();
        const activeOverlayInterval = setInterval(() => {
            setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule, overlayDimensions));
          }, 5000);
    
        
        setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule, overlayDimensions));
        window.addEventListener('resize', calculateOverlayDimensions);
    
        return () => {
            clearInterval(activeOverlayInterval);
            window.removeEventListener('resize', calculateOverlayDimensions);
        };
    }, []);

    useEffect(() => {
        calculateOverlayDimensions();
        setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule, overlayDimensions));
    }, [selectedSchedule]);

    return (
    <>
        <h1 className="viewHeading">This Week</h1>
        <div ref={gridRef} className="container-fluid mt-2 timeboxesGrid">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-1">
                </div>
                {dayToName.map((day, index) => (
                    <div ref={headerRef} key={index} style={{padding: '0'}} className={'col-1 '+ifNumberIsCurrentDay(index, 'currentDay', '')}>
                        <span className='timeboxHeadingText'>{day.name+" ("+day.date+"/"+month+")"}</span>
                        {ifNumberIsCurrentDay(index, true, false) && <ActiveOverlay width={overlayDimensions[0]} overlayHeight={activeOverlayHeight}></ActiveOverlay>}
                        {!ifNumberIsCurrentDay(index, true, false) && <Overlay dimensions={overlayDimensions} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)}></Overlay>}
                    </div>
                ))}
            </div>
            <TimeboxContextProvider>
            {listOfTimes.map(time => (
                <div key={time} className="row">
                    <div className="col-2"></div>
                    <div ref={boxRef} className="col-1 timeCol">{time}</div>
                    {dayToName.map((day, index) => (
                        <TimeBox key={index} dayName={day.name} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)} schedule={schedule} time={time} date={day.date+"/"+month} data={timeBoxGrid.get(day.date+"/"+month)?.get(time)}></TimeBox>
                    ))}
                </div>))}
            </TimeboxContextProvider>
        </div>
    </>
    )
}