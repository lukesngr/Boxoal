import { getDayNumbers, returnTimesSeperatedForSchedule, calculateMaxNumberOfBoxes, ifNumberIsCurrentDay, ifNumberIsEqualOrBeyondCurrentDay } from '@/modules/dateLogic';
import '../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { useContext } from 'react';
import { ScheduleContext } from '../schedule/ScheduleContext';

export default function TimeBoxes(props) {

    const {month, dateToDay} = getDayNumbers();
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);
    const listOfTimes = returnTimesSeperatedForSchedule(props.data.data[selectedSchedule]);

    let timeBoxGrid = new Map();

    props.data.data[selectedSchedule].timeboxes.forEach(function (element) {
      
        if (!timeBoxGrid.has(element.date)) {
          timeBoxGrid.set(element.date, new Map());
        }
      
        timeBoxGrid.get(element.date).set(element.time, element);
    });

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
                        {date.name+" ("+date.date+"/"+month+")"}
                    </div>
                ))}
            </div>
            {listOfTimes.map(time => (
                <div key={time} className="row">
                    <div className="col-2"></div>
                    <div className="col-1">{time}</div>
                    {dateToDay.map((date, index) => (
                        <TimeBox key={date.name+time} maxNumberOfBoxes={calculateMaxNumberOfBoxes(props.data.data[selectedSchedule], time)} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)} time={time} date={date.date+"/"+month} data={timeBoxGrid.get(time)?.get(date.date)}></TimeBox>
                    ))}
                </div>))}
        </div>
    </>
    )
}