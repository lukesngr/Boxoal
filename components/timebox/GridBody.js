import Timebox from "./Timebox"
export function GridBody({listOfTimes, dayToName, timeboxColumnRef}) {
    return (
        <>
            {listOfTimes.map(time => (
                <div key={time} className="row">
                    <div ref={timeboxColumnRef} className="col-1 timeCol">{time}</div>
                    {dayToName.map((day, index) => (
                        <Timebox key={index} day={day} time={time} index={index}></Timebox>
                    ))}
                </div>))
            }
        </>
    )
}