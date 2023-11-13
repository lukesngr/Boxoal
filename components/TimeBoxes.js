import { getDayNumbers, returnTimesSeperatedForSchedule } from '@/modules/dateLogic';
import '../styles/timeboxes.scss';
import TimeBox from './Timebox';
import { useContext } from 'react';
import { ScheduleContext } from './ScheduleContext';

function ifNumberIsCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number == currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

function ifNumberIsEqualOrBeyondCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number >= currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export default function TimeBoxes(props) {

    const {month, dateToDay} = getDayNumbers();
    const listOfTimes = returnTimesSeperatedForSchedule(props.data.data[0]);
    const {selectedSchedule, setSelectedSchedule} = useContext(ScheduleContext);

    let timeBoxGrid = new Map();

    props.data.data[selectedSchedule].timeboxes.forEach(function (element) {
        const dateObject = new Date(element.startTime);
        const day = dateObject.getDate();
        const hour = dateObject.getHours();
        const minutes = dateObject.getMinutes();
      
        const dateKey = day;
        const timeKey = `${hour}:${minutes}`;
      
        if (!timeBoxGrid.has(dateKey)) {
          timeBoxGrid.set(dateKey, new Map());
        }
      
        timeBoxGrid.get(dateKey).set(timeKey, element);
    });

    console.log(dateToDay);

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
                        <TimeBox key={date.name+time} active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)} time={time} day={date.name} data={timeBoxGrid.get(time)?.get(date.date)}></TimeBox>
                    ))}
                </div>))}
        </div>
    </>
    )
}