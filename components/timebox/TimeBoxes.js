import React, { useRef, useState, useContext, useEffect } from 'react';
import { getDayNumbers, returnTimesSeperatedForSchedule, ifCurrentDay, ifEqualOrBeyondCurrentDay,
     convertToTimeAndDate, calculateSizeOfOverlayBasedOnCurrentTime, calculateSizeOfRecordingOverlay } from '@/modules/dateLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { ScheduleContext } from '../schedule/ScheduleContext';
import { TimeboxContextProvider } from "./TimeboxContext";
import Overlay from './Overlay';
import ActiveOverlay from './ActiveOverlay';
import RecordingOverlay from './RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';

export default function TimeBoxes(props) {

    const gridContainerRef = useRef(null);
    const headerContainerRef = useRef(null);
    const timeboxColumnRef = useRef(null);
    const activeOverlayInterval = useRef(null);

    const [overlayDimensions, setOverlayDimensions] = useState(0);
    const [activeOverlayHeight, setActiveOverlayHeight] = useState(0);
 
    //get schedule that is selected in sidebar and assign it to schedule variable
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);
    let schedule = props.data.data[selectedSchedule];

    const dayToName = getDayNumbers(); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(schedule); //get times that go down each row
    
    //make a map for the timeboxes with a map inside it
    //this allows fast lookup based on date than time first
    //potential for further optimization by narrowing down to only the timeboxes this week
    let timeBoxGrid = new Map();
    schedule.timeboxes.forEach(function (element) { //for each timebox
        const [time, date] = convertToTimeAndDate(element.startTime); //convert the datetime to a time and date e.g. format hh:mm dd/mm
        if (!timeBoxGrid.has(date)) { timeBoxGrid.set(date, new Map()); } //if date key not in map than set empty map to date key
        timeBoxGrid.get(date).set(time, element); //lookup date key and set the map inside it to key of time with value of the element itself
    });
   
    function calculateOverlayDimensions() {
        if (gridContainerRef.current && headerContainerRef.current && timeboxColumnRef.current) { //if ref working
            const gridHeight = gridContainerRef.current.offsetHeight; //get height of grid
            const headerHeight = headerContainerRef.current.offsetHeight; //get height of headers

            const headerWidth = headerContainerRef.current.offsetWidth; //get width of headers
            const overlayHeight = gridHeight - headerHeight; //overlay is under headers but goes till end of grid
            const timeboxHeight = timeboxColumnRef.current.getBoundingClientRect().height; //decimal for a bit more accuracy as this for active overlay

            setOverlayDimensions([headerWidth, overlayHeight, timeboxHeight]);
        }
    };

    function pauseActiveOverlay() {
        clearInterval(activeOverlayInterval.current);
    }

    function resumeActiveOverlay() {
        activeOverlayInterval.current = setInterval(() => {
            setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule, overlayDimensions));
        }, 5000);
    }

    //when page first loads calculate overlay dimensions and set timer for every 5 seconds to recalculate active overlay height
    useEffect(() => {
        calculateOverlayDimensions();
        window.addEventListener('resize', calculateOverlayDimensions);
    
        return () => {
            clearInterval(activeOverlayInterval.current);
            window.removeEventListener('resize', calculateOverlayDimensions);
        };
    }, []);

    //if schedule changes recalculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
    }, [selectedSchedule]);

    //how many useeffects do I need I hate react sometimes
    useEffect(() => {
        setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule, overlayDimensions));
        activeOverlayInterval.current = setInterval(() => {
            setActiveOverlayHeight(calculateSizeOfOverlayBasedOnCurrentTime(schedule, overlayDimensions));
        }, 5000); //don't why but this fixed bug
        
        return () => {
            clearInterval(activeOverlayInterval.current);
        };
    }, [overlayDimensions])

   

    return (
    <>
        <h1 className="viewHeading">This Week</h1>
        <div ref={gridContainerRef} className="container-fluid mt-2 timeboxesGrid">
            <TimeboxContextProvider>

                {/*Headers */}
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-1"></div>
                    {dayToName.map((day, index) => (
                        <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col-1 '+ifCurrentDay(index, 'currentDay', '')}>
                            <span className='timeboxHeadingText'>{day.name+" ("+day.date+"/"+day.month+")"}</span>
                            {ifCurrentDay(index, true, false) && <>
                                <ActiveOverlay width={overlayDimensions[0]} overlayHeight={activeOverlayHeight}></ActiveOverlay>
                                <RecordingOverlay overlayDimensions={overlayDimensions} schedule={schedule} 
                                activeOverlayHeight={activeOverlayHeight}></RecordingOverlay>
                            </>}
                            {!ifCurrentDay(index, true, false) && <Overlay dimensions={overlayDimensions} active={ifEqualOrBeyondCurrentDay(index, true, false)}></Overlay>}
                            <RecordedTimeBoxOverlay data={schedule.recordedTimeboxes.filter(function(obj){
                                let recordedStartTime = new Date(obj.recordedStartTime);
                                return (recordedStartTime.getMonth()+1) == day.month && (recordedStartTime.getDate()) == day.date;
                            })} overlayDimensions={overlayDimensions} schedule={schedule}></RecordedTimeBoxOverlay>
                        </div>
                    ))}
                </div>
                
                {/* Timeboxes */}
                {listOfTimes.map(time => (
                    <div key={time} className="row">
                        <div className="col-2"></div>
                        <div ref={timeboxColumnRef} className="col-1 timeCol">{time}</div>
                        {dayToName.map((day, index) => (
                            <TimeBox key={index} dayName={day.name} active={ifEqualOrBeyondCurrentDay(index, true, false)}
                             schedule={schedule} time={time} date={day.date+"/"+day.month} data={timeBoxGrid.get(day.date+"/"+day.month)?.get(time)}
                             overlayFuncs={[pauseActiveOverlay, resumeActiveOverlay]}></TimeBox>
                        ))}
                    </div>))}
            </TimeboxContextProvider>
        </div>
    </>
    )
    
}