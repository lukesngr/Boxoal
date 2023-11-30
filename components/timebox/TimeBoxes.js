import { getDayNumbers, returnTimesSeperatedForSchedule, ifNumberIsCurrentDay, ifNumberIsEqualOrBeyondCurrentDay, convertToTimeAndDate} from '@/modules/dateLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { useContext, useEffect, useRef, useState } from 'react';
import { ScheduleContext } from '../schedule/ScheduleContext';
import { TimeboxContextProvider } from "./TimeboxContext";
import Overlay from './Overlay';

export default function TimeBoxes(props) {

    const gridRef = useRef(null);
    const headerRef = useRef(null);
    const [overlayDimensions, setOverlayDimensions] = useState(0);
    const {month, dateToDay} = getDayNumbers();
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);
    let schedule = props.data.data[selectedSchedule];
    const listOfTimes = returnTimesSeperatedForSchedule(schedule);

    let timeBoxGrid = new Map();

    schedule.timeboxes.forEach(function (element) {
        const [time, date] = convertToTimeAndDate(element.startTime);
        if (!timeBoxGrid.has(date)) { timeBoxGrid.set(date, new Map()); }
        timeBoxGrid.get(date).set(time, element);
    });

    useEffect(() => {
        const calculateOverlayDimensions = () => {
            if (gridRef.current && headerRef.current) {
                const gridHeight = gridRef.current.offsetHeight;
                const headerHeight = headerRef.current.offsetHeight;
                const headerWidth = headerRef.current.offsetWidth;
                const overlayHeight = gridHeight - headerHeight;
                setOverlayDimensions([headerWidth, overlayHeight]);
            }
        };
    
        calculateOverlayDimensions();
        window.addEventListener('resize', calculateOverlayDimensions);
    
        return () => {
            window.removeEventListener('resize', calculateOverlayDimensions);
        };
    }, []);

    console.log(overlayDimensions);

    return (
    <>
        <h1 className="viewHeading">This Week</h1>
        <div ref={gridRef} className="container-fluid mt-2 timeboxesGrid">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-1">
                </div>
                {dateToDay.map((date, index) => (
                    <div ref={headerRef} key={index} style={{padding: '0'}} className={'col-1 '+ifNumberIsCurrentDay(index, 'currentDay', '')}>
                        <span className='timeboxHeadingText'>{date.name+" ("+date.date+"/"+month+")"}</span>
                        <Overlay dimensions={overlayDimensions} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)}></Overlay>
                    </div>
                ))}
            </div>
            <TimeboxContextProvider>
            {listOfTimes.map(time => (
                <div key={time} className="row">
                    <div className="col-2"></div>
                    <div className="col-1">{time}</div>
                    {dateToDay.map((date, index) => (
                        <TimeBox key={index} dayName={date.name} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)} schedule={schedule} time={time} date={date.date+"/"+month} data={timeBoxGrid.get(date.date+"/"+month)?.get(time)}></TimeBox>
                    ))}
                </div>))}
            </TimeboxContextProvider>
        </div>
    </>
    )
}