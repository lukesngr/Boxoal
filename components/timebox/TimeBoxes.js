import React, { useRef, useState, useContext, useEffect } from 'react';
import { getDayNumbers, returnTimesSeperatedForSchedule, ifNumberIsCurrentDay, ifNumberIsEqualOrBeyondCurrentDay, convertToTimeAndDate, calculateSizeOfOverlayBasedOnCurrentTime } from '@/modules/dateLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { ScheduleContext } from '../schedule/ScheduleContext';
import { TimeboxContextProvider } from "./TimeboxContext";
import Overlay from './Overlay';
import ActiveOverlay from './ActiveOverlay';

export default function TimeBoxes(props) {

    const gridContainerRef = useRef(null);
    const headerContainerRef = useRef(null);
    const timeboxColumnRef = useRef(null);
    const [overlayDimensions, setOverlayDimensions] = useState(0);
    const [activeOverlayHeight, setActiveOverlayHeight] = useState(0);
    const dayToName = getDayNumbers();
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
        if (gridContainerRef.current && headerContainerRef.current && timeboxColumnRef.current) {
            const gridHeight = gridContainerRef.current.offsetHeight;
            const headerHeight = headerContainerRef.current.offsetHeight;
            const headerWidth = headerContainerRef.current.offsetWidth;
            const overlayHeight = gridHeight - headerHeight;
            const timeboxHeight = timeboxColumnRef.current.offsetHeight;
            setOverlayDimensions([headerWidth, overlayHeight, timeboxHeight]);
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
        <div ref={gridContainerRef} className="container-fluid mt-2 timeboxesGrid">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-1">
                </div>
                {dayToName.map((day, index) => (
                    <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col-1 '+ifNumberIsCurrentDay(index, 'currentDay', '')}>
                        <span className='timeboxHeadingText'>{day.name+" ("+day.date+"/"+day.month+")"}</span>
                        {ifNumberIsCurrentDay(index, true, false) && <ActiveOverlay width={overlayDimensions[0]} overlayHeight={activeOverlayHeight}></ActiveOverlay>}
                        {!ifNumberIsCurrentDay(index, true, false) && <Overlay dimensions={overlayDimensions} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)}></Overlay>}
                    </div>
                ))}
            </div>
            <TimeboxContextProvider>
            {listOfTimes.map(time => (
                <div key={time} className="row">
                    <div className="col-2"></div>
                    <div ref={timeboxColumnRef} className="col-1 timeCol">{time}</div>
                    {dayToName.map((day, index) => (
                        <TimeBox key={index} dayName={day.name} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)} schedule={schedule} time={time} date={day.date+"/"+day.month} data={timeBoxGrid.get(day.date+"/"+day.month)?.get(time)}></TimeBox>
                    ))}
                </div>))}
            </TimeboxContextProvider>
        </div>
    </>
    )
}