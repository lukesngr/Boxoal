import '../styles/timeboxes.css';

export default function TimeBoxes() {
    
    const dateObject = new Date();
    let month = dateObject.getMonth();
    let day = dateObject.getDay();
    let date = dateObject.getDate();
    let dateToDay = new Map();
    
    let simpleArray = [0, 1, 2, 3, 4, 5, 6];

    let everythingInFrontOfCurrentDay = simpleArray.splice(simpleArray.indexOf(day)+1, simpleArray.length-1);
    let dayStack = everythingInFrontOfCurrentDay.concat(simpleArray)
    let currentDay = 0;

    while(dayStack.length > 0) {
        currentDay = dayStack.pop();
        let currentDate = (currentDay - day)+date;
        dateToDay.set(currentDay, currentDate);
    }

    return (
    <>
        <h1 class="viewHeading">This Week</h1>
        <div className="container-fluid mt-2 h-100 timeboxesGrid">
            <div className="row">
                <div className="col-2">
                </div>
                <div className="col-1">
                </div>
                <div className="col-1">
                    Sun {"("+dateToDay.get(0)+"/"+month+")"}
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
        </div>
    </>
    )
}