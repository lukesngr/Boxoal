import { getDayNumbers, returnTimesSeperatedForSchedule } from '@/modules/dateLogic';
import '../styles/timeboxes.scss';
import TimeBox from './Timebox';

export default function TimeBoxes(props) {

    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    
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
                {dateToDay.map(time => (

                ))}
                <div className="col-1">
                    Sun {"("+dateToDay[0]+"/"+month+")"}
                </div>
                <div className="col-1">
                    Mon {"("+dateToDay.get(1)+"/"+month+")"}
                </div>
                <div className="col-1">
                    Tue {"("+dateToDay.get(2)+"/"+month+")"}
                </div>
                <div className="col-1">
                    Wed {"("+dateToDay.get(3)+"/"+month+")"}
                </div>
                <div className="col-1">
                    Thur {"("+dateToDay.get(4)+"/"+month+")"}
                </div>
                <div className="col-1">
                    Fri {"("+dateToDay.get(5)+"/"+month+")"}
                </div>
                <div className="col-1">
                    Sat {"("+dateToDay.get(6)+"/"+month+")"}
                </div>
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