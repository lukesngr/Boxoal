import { useSelector } from "react-redux";
export function GridBody({listOfTimes, dayToName, timeboxColumnRef}) {
    const onDayView = useSelector(state => state.onDayView.value);
    const daySelected = useSelector(state => state.daySelected.value);
    let dayToNameModified = onDayView ? [dayToName[daySelected]] : dayToName;
    return (
        <>
            {listOfTimes.map(time => (
                <div key={time} className="row">
                    <div ref={timeboxColumnRef} className="col-1 timeCol">{time}</div>
                    {dayToNameModified.map((day, index) => (
                        <></>
                    ))}
                </div>))
            }
        </>
    )
}