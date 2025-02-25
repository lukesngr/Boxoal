import React, { useRef, useState, useContext, useEffect, useMemo, createContext } from 'react';
import { returnTimesSeperatedForSchedule } from '@/modules/formatters';
import GridHeader from './GridHeader';
import '../../styles/timeboxes.scss';
import { getCurrentDay } from "../../modules/untestableFunctions";
import TimeboxHeading from './TimeboxHeading';
import { useSelector } from 'react-redux';
import { filterTimeboxesBasedOnWeekRange, getArrayOfDayDateDayNameAndMonthForHeaders, ifCurrentDay, ifEqualOrBeyondCurrentDay } from '@/modules/dateCode';
import useActiveOverlay from '@/hooks/useActiveOverlay';
import useOverlayDimensions from '@/hooks/useOverlayDimensions';
import { useScheduleSetter } from '@/hooks/useScheduleSetter';
import useTimeboxGridRedux from '@/hooks/useTimeboxGridRedux';
import { GridBody } from './GridBody';
import RecordedTimeBoxOverlay from './RecordedTimeBoxOverlay';

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
    useOverlayDimensions(gridContainerRef, headerContainerRef, timeboxColumnRef);
    useActiveOverlay();

    return (
    <>
        <TimeboxHeading data={props.data}></TimeboxHeading>
        <div ref={gridContainerRef} className="container-fluid mt-2 timeboxesGrid">
            <GridHeader headerContainerRef={headerContainerRef} dayToName={dayToName} currentDay={currentDay}></GridHeader>
            <GridBody timeboxColumnRef={timeboxColumnRef} listOfTimes={listOfTimes} dayToName={dayToName}></GridBody>
            <RecordedTimeBoxOverlay currentDay={currentDay} dayToName={dayToName}></RecordedTimeBoxOverlay>
        </div>
    </>
    )
    
}

{/*<TimeBox key={index} index={index} day={day} time={time}></TimeBox>*/}