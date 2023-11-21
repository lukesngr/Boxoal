import { getDayNumbers, returnTimesSeperatedForSchedule, ifNumberIsCurrentDay, ifNumberIsEqualOrBeyondCurrentDay, convertToTimeAndDate} from '@/modules/dateLogic';
import '../../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { useContext, useEffect, useRef } from 'react';
import { ScheduleContext } from '../schedule/ScheduleContext';
import { TimeboxContextProvider } from "./TimeboxContext";
import Overlay from './Overlay';

export default function TimeBoxes(props) {

    const gridRef = useRef(null);
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

    //useEffect(() => {})

    return (
    <>
        <h1 className="viewHeading">This Week</h1>
        <div className="container-fluid mt-2 h-100 timeboxesGrid">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-1">
                </div>
                {dateToDay.map((date, index) => (
                    <div key={index} className={'col-1 '+ifNumberIsCurrentDay(index, 'currentDay', '')}>
                        <span className='timeboxHeadingText'>{date.name+" ("+date.date+"/"+month+")"}</span>
                        <Overlay active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)}></Overlay>
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