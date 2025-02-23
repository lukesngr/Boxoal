import React, { useRef, useState, useContext, useEffect, useMemo, createContext } from 'react';
import { returnTimesSeperatedForSchedule } from '@/modules/timeLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import Overlay from '../overlay/Overlay';
import ActiveOverlay from '../overlay/ActiveOverlay';
import RecordingOverlay from '../overlay/RecordingOverlay';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';
import TimeboxHeading from './TimeboxHeading';
import { useSelector } from 'react-redux';
import { filterTimeboxesBasedOnWeekRange, getArrayOfDayDateDayNameAndMonthForHeaders, getCurrentDay, ifCurrentDay, ifEqualOrBeyondCurrentDay } from '@/modules/dateCode';
import useActiveOverlay from '@/hooks/useActiveOverlay';
import useOverlayDimensions from '@/hooks/useOverlayDimensions';
import { useScheduleSetter } from '@/hooks/useScheduleSetter';
import useTimeboxGridRedux from '@/hooks/useTimeboxGridRedux';

export const ScheduleDataContext = createContext();

export default function TimeBoxes(props) {

    const selectedDate = useSelector(state => state.selectedDate.value);
    const profile = useSelector(state => state.profile.value);
    let schedule = props.data[profile.scheduleIndex]; 
    const gridContainerRef = useRef(null);
    const headerContainerRef = useRef(null);
    const timeboxColumnRef = useRef(null);
    schedule.timeboxes = filterTimeboxesBasedOnWeekRange(schedule.timeboxes, selectedDate); //filter timeboxes based on week range
    const dayToName = getArrayOfDayDateDayNameAndMonthForHeaders(selectedDate); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(profile); //get times that go down each row
    let currentDay = getCurrentDay();

    useTimeboxGridRedux(schedule, selectedDate); //make a map for the timeboxes with another map inside it, makes lookup fast
    useScheduleSetter(schedule); //set schedule data to redux store (timeboxes, recordedTimeboxes, goals
    useOverlayDimensions(gridContainerRef, headerContainerRef, timeboxColumnRef, expanded);
    useActiveOverlay();
    useDaySelected(currentDay);

    return (
    <>
        <TimeboxHeading></TimeboxHeading>
        <div ref={gridContainerRef} className="container-fluid mt-2 timeboxesGrid">
                {/*Headers */}
                <div className="row">
                    <div className="col-1"></div>
                    
                    {dayToName.map((day, index) => (
                        <div ref={headerContainerRef} key={index} style={{padding: '0'}} className={'col '+ifCurrentDay(index, 'currentDay', '')}>
                            <span className='timeboxHeadingText'>{day.name}<br />{" ("+day.date+"/"+day.month+")"}</span>
                            {ifCurrentDay(index, true, false) ? (<>
                                <ActiveOverlay></ActiveOverlay>
                                <RecordingOverlay></RecordingOverlay>
                            </>) : (<Overlay active={ifEqualOrBeyondCurrentDay(index, true, false)}></Overlay>)}
                            <RecordedTimeBoxOverlay day={day}></RecordedTimeBoxOverlay>
                        </div>
                    ))}
                </div>
                
                {/* Timeboxes */}
                {listOfTimes.map(time => (
                    <div key={time} className="row">
                        <div ref={timeboxColumnRef} className="col-1 timeCol">{time}</div>
                        {dayToName.map((day, index) => (
                            <TimeBox key={index} index={index} day={day} time={time}></TimeBox>
                        ))}
                    </div>))}
        </div>
    </>
    )
    
}