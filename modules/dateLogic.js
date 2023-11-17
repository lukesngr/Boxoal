export function getDayNumbers() {
    const dateObject = new Date();
    let month = dateObject.getMonth();
    let day = dateObject.getDay();
    let date = dateObject.getDate();
    let dateToDay = [{date: 0, name: "Sun"}, {date: 1, name: "Mon"}, {date: 2, name: "Tue"}, {date: 3, name: "Wed"}, {date: 4, name: "Thur"},  {date: 5, name: "Fri"},  {date: 6, name: "Sat"}];
    let simpleArray = [0, 1, 2, 3, 4, 5, 6];

    let everythingInFrontOfCurrentDay = simpleArray.splice(simpleArray.indexOf(day)+1, simpleArray.length-1);
    let dayStack = everythingInFrontOfCurrentDay.concat(simpleArray)
    let currentDay = 0;

    while(dayStack.length > 0) {
        currentDay = dayStack.pop();
        let currentDate = (currentDay - day)+date;
        dateToDay[currentDay].date = currentDate;
    }

    return {month, dateToDay};
}

export function returnTimesSeperatedForSchedule(schedule) {

    let listOfTimes = []
    let wakeUpTimeSeperated = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });

    if(schedule.boxSizeUnit == "min") { 
        let currentHour = wakeUpTimeSeperated[0];
        let currentMinute = wakeUpTimeSeperated[1];
        
        while(currentHour < 25 && currentMinute < 60) {
            if(currentMinute < 10) {
                listOfTimes.push(currentHour+":0"+currentMinute);
            }else{
                listOfTimes.push(currentHour+":"+currentMinute);
            }
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }
        }

        currentHour = 0;
        currentMinute = 0;

        while(currentHour < wakeUpTimeSeperated[0] | currentMinute < wakeUpTimeSeperated[1]) {
            if(currentMinute < 10) {
                listOfTimes.push(currentHour+":0"+currentMinute);
            }else{
                listOfTimes.push(currentHour+":"+currentMinute);
            }
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }
        }
    }

    return listOfTimes;
}

export function calculateMaxNumberOfBoxes(schedule, time) {
    let wakeUpTimeSeparated = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    
    if(schedule.boxSizeUnit == "min") {
        const minutesInOneDay = 25 * 60; //idk why but this works
        let maxNumberOfBoxes = Math.floor(minutesInOneDay / schedule.boxSizeNumber);
        
        if(timeSeparated[0] > wakeUpTimeSeparated[0] || (timeSeparated[0] == wakeUpTimeSeparated[0] && timeSeparated[1] > wakeUpTimeSeparated[1])) {
            maxNumberOfBoxes -= ((timeSeparated[0]-wakeUpTimeSeparated[0])*60) / schedule.boxSizeNumber;
            maxNumberOfBoxes -= (timeSeparated[1]-wakeUpTimeSeparated[1]) / schedule.boxSizeNumber;
        }else if(timeSeparated[0] < wakeUpTimeSeparated[0] || (timeSeparated[0] == wakeUpTimeSeparated[0] && timeSeparated[1] < wakeUpTimeSeparated[1])){
            maxNumberOfBoxes -= ((timeSeparated[0]-wakeUpTimeSeparated[0])*60) / schedule.boxSizeNumber;
            maxNumberOfBoxes -= (timeSeparated[1]-wakeUpTimeSeparated[1]) / schedule.boxSizeNumber;
        }else{
            console.log(wakeUpTimeSeparated);
            console.log(timeSeparated);
        }
        return maxNumberOfBoxes;
    }
}

export default function ifNumberIsCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number == currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export default function ifNumberIsEqualOrBeyondCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number >= currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}