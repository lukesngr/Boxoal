import React, { useRef, createContext } from 'react';
import { returnTimesSeperatedForSchedule } from '@/modules/formatters';
import GridHeader from './GridHeader';
import '../../styles/timeboxes.scss';
import { getCurrentDay } from "../../modules/untestableFunctions";
import TimeboxHeading from './TimeboxHeading';
import { useSelector } from 'react-redux';
import { getArrayOfDayDateDayNameAndMonthForHeaders } from '@/modules/dateCode';
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
    const schedule = props.data[profile.scheduleIndex]; 
    const gridContainerRef = useRef(null);
    const headerContainerRef = useRef(null);
    const timeboxColumnRef = useRef(null);
    const dayToName = getArrayOfDayDateDayNameAndMonthForHeaders(selectedDate); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(profile); //get times that go down each row
    const currentDay = getCurrentDay();

    useTimeboxGridRedux(schedule, selectedDate); //make a map for the timeboxes with another map inside it, makes lookup fast
    useScheduleSetter(schedule); //set schedule data to redux store (timeboxes, recordedTimeboxes, goals
    useOverlayDimensions(gridContainerRef, headerContainerRef, timeboxColumnRef);
    useActiveOverlay();
    useGoalLimits(schedule.goals);

    return (
    <>
        <TimeboxHeading data={props.data}></TimeboxHeading>
        <div ref={gridContainerRef} className="container-fluid mt-2 timeboxesGrid">
            <GridHeader headerContainerRef={headerContainerRef} dayToName={dayToName} currentDay={currentDay}></GridHeader>
            <RecordedTimeBoxOverlay currentDay={currentDay} dayToName={dayToName}></RecordedTimeBoxOverlay>
            <GridBody timeboxColumnRef={timeboxColumnRef} listOfTimes={listOfTimes} dayToName={dayToName}></GridBody>
        </div>
    </>
    )
    
}

{/*<TimeBox key={index} index={index} day={day} time={time}></TimeBox>*/}