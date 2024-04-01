import React, { useRef, useState, useContext, useEffect, useMemo, createContext } from 'react';
import { returnTimesSeperatedForSchedule } from '@/modules/timeLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { ScheduleContext } from '../schedule/ScheduleContext';
import { TimeboxContextProvider, TimeboxDialogContextProvider } from "./TimeboxDialogContext";
import Overlay from '../overlay/Overlay';
import ActiveOverlay from '../overlay/ActiveOverlay';
import RecordingOverlay from '../overlay/RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';
import TimeboxHeading from './TimeboxHeading';
import { ifCurrentDay, ifEqualOrBeyondCurrentDay, getArrayOfDayDateDayNameAndMonthForHeaders } from '@/modules/dateLogic';
import { TimeboxRecordingContextProvider } from './TimeboxRecordingContext';
import useActiveOverlay from '@/hooks/useActiveOverlay';
import useOverlayDimensions from '@/hooks/useOverlayDimensions';
import { useDispatch } from 'react-redux';
import { useScheduleSetter } from '@/hooks/useScheduleSetter';

export const ScheduleDataContext = createContext();

export default function TimeBoxes(props) {

    const gridContainerRef = useRef(null);
    const headerContainerRef = useRef(null);
    const timeboxColumnRef = useRef(null);
 
    //get schedule that is selected in sidebar and assign it to schedule variable
    const {selectedSchedule, setSelectedSchedule, expanded, setExpanded, selectedDate, setSelectedDate} = useContext(ScheduleContext);
    let schedule = props.data.data[selectedSchedule];
    
    
    const dayToName = getArrayOfDayDateDayNameAndMonthForHeaders(selectedDate.toDate()); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(schedule); //get times that go down each row
    
    //make a map for the timeboxes with a map inside it
    //this allows fast lookup based on date than time first

    
    

    useScheduleSetter(schedule); //set schedule data to redux store (timeboxes, recordedTimeboxes, goals
    useOverlayDimensions(gridContainerRef, headerContainerRef, timeboxColumnRef, selectedSchedule, expanded);
    useActiveOverlay(schedule);
    
    

    return (
    <>
        <TimeboxHeading expanded={expanded} setExpanded={setExpanded} selectedDate={selectedDate} setSelectedDate={setSelectedDate}></TimeboxHeading>
        <div ref={gridContainerRef} className="container-fluid mt-2 timeboxesGrid">
            <TimeboxRecordingContextProvider>
                {/*Headers */}
                <div className="row">
                    <div className="col-1"></div>
                    
                    {dayToName.map((day, index) => (
                        <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col '+ifCurrentDay(index, 'currentDay', '')}>
                            <span className='timeboxHeadingText'>{day.name}<br />{" ("+day.date+"/"+day.month+")"}</span>
                            {ifCurrentDay(index, true, false) && <>
                                <ActiveOverlay></ActiveOverlay>
                                <RecordingOverlay></RecordingOverlay>
                            </>}
                            {!ifCurrentDay(index, true, false) && <Overlay active={ifEqualOrBeyondCurrentDay(index, true, false)}></Overlay>}
                            <RecordedTimeBoxOverlay day={day}></RecordedTimeBoxOverlay>
                        </div>
                    ))}
                </div>
                
                {/* Timeboxes */}
                <TimeboxDialogContextProvider>
                {listOfTimes.map(time => (
                    <div key={time} className="row">
                        <div ref={timeboxColumnRef} className="col-1 timeCol">{time}</div>
                        {dayToName.map((day, index) => (
                            <TimeBox key={index} index={index} day={day} time={time} 
                            data={timeBoxGrid.get(day.date+"/"+day.month)?.get(time)}></TimeBox>
                        ))}
                    </div>))}
                </TimeboxDialogContextProvider>
            </TimeboxRecordingContextProvider>
        </div>
    </>
    )
    
}