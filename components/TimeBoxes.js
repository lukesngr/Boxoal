import { getDayNumbers, returnTimesSeperatedForSchedule } from '@/modules/dateLogic';
import '../styles/timeboxes.scss';
import TimeBox from './Timebox';

function ifNumberIsCurrentDay(number, identifier) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number == currentDay) {
        return identifier;
    }
    return "";
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
                        <div className={'col-1 '+ifNumberIsCurrentDay(index, 'currentDay')}>
                            {date.name+" ("+date.date+"/"+month+")"}
                        </div>
                ))}
            </div>
            {listOfTimes.map(time => (
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-1">{time}</div>
                    <TimeBox time={time} day="mon"></TimeBox>
                    <TimeBox time={time} day="tue"></TimeBox>
                    <TimeBox time={time} day="wed"></TimeBox>
                    <TimeBox time={time} day="thu"></TimeBox>
                    <TimeBox time={time} day="fri"></TimeBox>
                    <TimeBox time={time} day="sat"></TimeBox>
                    <TimeBox time={time} day="sun"></TimeBox>
                </div>))}
        </div>
    </>
    )
}