import { getDayNumbers, returnTimesSeperatedForSchedule } from '@/modules/dateLogic';
import '../styles/timeboxes.scss';
import TimeBox from './Timebox';

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

    return (
    <>
        <h1 class="viewHeading">This Week</h1>
        <div className="container-fluid mt-2 h-100 timeboxesGrid">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-1">
                </div>
                {dateToDay.map((date, index) => (
                    <div className={'col-1 '+ifNumberIsCurrentDay(index, 'currentDay', '')}>
                        {date.name+" ("+date.date+"/"+month+")"}
                    </div>
                ))}
            </div>
            {listOfTimes.map(time => (
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-1">{time}</div>
                    {dateToDay.map((date, index) => (
                        <TimeBox active={ifNumberIsEqualOrBeyondCurrentDay(index, true, false)} time={time} day={date.name}></TimeBox>
                    ))}
                </div>))}
        </div>
    </>
    )
}