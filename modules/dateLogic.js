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

    month += 1;

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

function calculateMaxNumberOfBoxesIfScheduleEmpty(schedule, timeSeparated, wakeUpTimeSeparated) {
    
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
        }
        return maxNumberOfBoxes;
    }
}

export function convertToDateTime(time, date) {
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let dateSeparated = date.split("/").map(function(num) { return parseInt(num); });
    let datetime = new Date();
    datetime.setHours(timeSeparated[0]);
    datetime.setMinutes(timeSeparated[1]);
    datetime.setDate(dateSeparated[0]);
    datetime.setMonth(dateSeparated[1]);
    return datetime;
}

export function convertToTimeAndDate(input) {
    let datetime = new Date(input);
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let date = datetime.getDate();
    let month = datetime.getMonth();

    if(minutes == 0) {
        minutes = "00";
    }

    return [hours+':'+minutes, date+'/'+month];
}

function calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, schedule) {
    let numberOfBoxes = 0;
    if(schedule.boxSizeUnit == "min") {
        numberOfBoxes += Math.round(((dateTime2.getHours() - dateTime1.getHours())*60) / schedule.boxSizeNumber);
        numberOfBoxes += Math.round((dateTime2.getMinutes() - dateTime1.getMinutes()) / schedule.boxSizeNumber);
    }

    return numberOfBoxes;
}

export function calculateMaxNumberOfBoxes(schedule, time, date) {
    let wakeUpTimeSeparated = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let currentDateTime = convertToDateTime(time, date);
    let maxNumberOfBoxes = 0;

    for(let i = 0; i < schedule.timeboxes.length; i++) {
        if(currentDateTime < new Date(schedule.timeboxes[i].startTime)) {
            maxNumberOfBoxes = calculateBoxesBetweenTwoDateTimes(currentDateTime, new Date(schedule.timeboxes[i].startTime), schedule);
            i = schedule.timeboxes.length;
        }else{
            i++;
        }
    }

    if(maxNumberOfBoxes == 0) {
        maxNumberOfBoxes = calculateMaxNumberOfBoxesIfScheduleEmpty(schedule, timeSeparated, wakeUpTimeSeparated);
    }

    return maxNumberOfBoxes;
}

export function ifNumberIsCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number == currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export function ifNumberIsEqualOrBeyondCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number >= currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export function addBoxesToTime(schedule, time, numberOfBoxes) {
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let endHours = 0;
    let endMinutes = 0;

    if(schedule.boxSizeUnit == "min") {
        endHours = Math.round(numberOfBoxes*schedule.boxSizeNumber / 60);
        endMinutes = Math.round(numberOfBoxes*schedule.boxSizeNumber % 60);
        endHours += timeSeparated[0];
        endMinutes += timeSeparated[1];
        if(endMinutes / 60 >= 1) {
            endHours += Math.round(endMinutes / 60);
            endMinutes -= Math.round(endMinutes / 60) * 60;
        }
        return endHours+":"+endMinutes;
    }
}

