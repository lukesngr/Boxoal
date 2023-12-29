export function getDayNumbers() {
    const dateObject = new Date();
    let month = dateObject.getMonth() + 1;
    let day = dateObject.getDay();
    let date = dateObject.getDate();
    let year = dateObject.getFullYear();
    let dayToName = [{day: 0, name: "Sun"}, {day: 1, name: "Mon"}, {day: 2, name: "Tue"}, {day: 3, name: "Wed"}, {day: 4, name: "Thur"},  {day: 5, name: "Fri"},  {day: 6, name: "Sat"}];
    let simpleArray = [0, 1, 2, 3, 4, 5, 6];

    let everythingInFrontOfCurrentDay = simpleArray.splice(simpleArray.indexOf(day)+1, simpleArray.length-1); //array of everything ahead of day 
    let dayStack = everythingInFrontOfCurrentDay.concat(simpleArray) //stack to perform calcs, concat of everything ahead of day and everything after it
    let currentDay = 0;

    while(dayStack.length > 0) {
        currentDay = dayStack.pop();
        let currentDate = date + (currentDay - day); //currentDate = date for today plus the distance day grabed from the stack is from today 

        if(currentDate < 1) { //this code deals with the use case that the calculation above goes into the negative
            let numberOfDaysInLastMonth = (new Date(year, month-2, 0)).getDate();
            currentDate = date + (currentDay - day) + numberOfDaysInLastMonth;
            dayToName[currentDay].month = month-1;
        }else if(currentDate > (new Date(year, month, 0)).getDate()) { //deals with the case that the current date overlaps what is possible in the month
            currentDate -= (new Date(year, month, 0)).getDate();
            dayToName[currentDay].month = month + 1;
        }else {
            dayToName[currentDay].month = month;
        }

        dayToName[currentDay].date = currentDate;
    }

    return dayToName;
}

export function returnTimesSeperatedForSchedule(schedule) {

    let listOfTimes = []
    let wakeUpTimeSeperatedIntoHoursAndMins = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });

    if(schedule.boxSizeUnit == "min") { 
        let currentHour = wakeUpTimeSeperatedIntoHoursAndMins[0]; //hours and minutes start off at wakeup time
        let currentMinute = wakeUpTimeSeperatedIntoHoursAndMins[1];
        
        while(currentHour < 24 && currentMinute < 60) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);  //push to list of times in format hh:mm 
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }

        }

        currentHour = 0;
        currentMinute = 0;

        while(currentHour < wakeUpTimeSeperatedIntoHoursAndMins[0] || currentMinute < wakeUpTimeSeperatedIntoHoursAndMins[1]) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }

        }
    }else if(schedule.boxSizeUnit == "hr") {
        let currentHour = wakeUpTimeSeperatedIntoHoursAndMins[0]; //hours  start off at wakeup time
        const minuteThatRemainsUnchanged = wakeUpTimeSeperatedIntoHoursAndMins[1]; //minute doesn't change due to unit being hours
        
        while(currentHour < 24) {
            listOfTimes.push(`${currentHour}:${minuteThatRemainsUnchanged < 10 ? '0' : ''}${minuteThatRemainsUnchanged}`);  //push to list of times in format hh:mm 
            currentHour += schedule.boxSizeNumber;
        }

        currentHour = 0;

        while(currentHour < wakeUpTimeSeperatedIntoHoursAndMins[0]) {
            listOfTimes.push(`${currentHour}:${minuteThatRemainsUnchanged < 10 ? '0' : ''}${minuteThatRemainsUnchanged}`);
            
            currentHour += schedule.boxSizeNumber;
        }
    }

    return listOfTimes;
}

export function convertToDateTime(time, date) {
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let dateSeparated = date.split("/").map(function(num) { return parseInt(num); });
    let datetime = new Date();
    datetime.setHours(timeSeparated[0]);
    datetime.setMinutes(timeSeparated[1]);
    datetime.setDate(dateSeparated[0]);
    datetime.setMonth(dateSeparated[1]-1);
    return datetime;
}

export function convertToTimeAndDate(input) {
    let datetime = new Date(input);
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let date = datetime.getDate();
    let month = datetime.getMonth()+1;

    if(minutes == 0) {
        minutes = "00";
    }

    return [hours+':'+minutes, date+'/'+month];
}

export function calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber, timeSeparated, wakeUpTimeSeparated) {
    
    if(boxSizeUnit == "min") {
        const minutesInOneDay = 24 * 60; //idk why but this works //update this works cause I stuffed up 24 hour time
        let maxNumberOfBoxes = Math.floor(minutesInOneDay / boxSizeNumber);
        let [timeHours, timeMinutes] = timeSeparated;
        let [wakeupTimeHours, wakeupTimeMinutes] = wakeUpTimeSeparated;


        //if time hours bigger than wakeup hour or time hours equals wakeup hours and time minutes bigger. basically if time ahead of wakeup
        if(timeHours > wakeupTimeHours || (timeHours == wakeupTimeHours && timeMinutes > wakeupTimeMinutes)) {  
            let boxesMadeUpOfHours = ((timeHours-wakeupTimeHours)*60) / boxSizeNumber;
            let boxesMadeUpOfMinutes = (timeMinutes-wakeupTimeMinutes) / boxSizeNumber;
            maxNumberOfBoxes -= boxesMadeUpOfHours;
            maxNumberOfBoxes -= boxesMadeUpOfMinutes;
        //if time hours smaller than wakeup hour or time hours equals wakeup hours and time minutes smaller. basically if time behind of wakeup
        }else if(timeHours < wakeupTimeHours || (timeHours == wakeupTimeHours && timeMinutes < wakeupTimeMinutes)){
            let boxesMadeUpOfHours = (timeHours*60) / boxSizeNumber; //from 00:00 to time hours
            let boxesMadeUpOfMinutes = timeMinutes / boxSizeNumber; //from 00:00 to time minutes
            boxesMadeUpOfHours += ((23-wakeupTimeHours)*60) / boxSizeNumber; //from wakeup time hours to 24:00
            boxesMadeUpOfHours += (wakeupTimeMinutes / boxSizeNumber);
            maxNumberOfBoxes -= boxesMadeUpOfHours;
            maxNumberOfBoxes -= boxesMadeUpOfMinutes;
        }
        return maxNumberOfBoxes;
    }else if(boxSizeUnit == "hr") {
        let maxNumberOfBoxes = Math.floor(24 / boxSizeNumber);
        let [timeHours, timeMinutes] = timeSeparated;
        let [wakeupTimeHours, wakeupTimeMinutes] = wakeUpTimeSeparated;

        if(timeHours > wakeupTimeHours) {  
            let boxesMadeUpOfHours = (timeHours-wakeupTimeHours) / boxSizeNumber;
            maxNumberOfBoxes -= boxesMadeUpOfHours;
        }else if(timeHours < wakeupTimeHours){
            let boxesMadeUpOfHours = timeHours / boxSizeNumber; //from 00:00 to time hours
            boxesMadeUpOfHours += (24-wakeupTimeHours) / boxSizeNumber; //from wakeup time hours to 24:00
            maxNumberOfBoxes -= boxesMadeUpOfHours;
        }
        return maxNumberOfBoxes;
    }
}

export function calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, boxSizeUnit, boxSizeNumber) {
    let numberOfBoxes = 0;
    if(boxSizeUnit == "min") {
        numberOfBoxes += Math.floor(((dateTime2.getHours() - dateTime1.getHours())*60) / boxSizeNumber);
        numberOfBoxes += Math.floor((dateTime2.getMinutes() - dateTime1.getMinutes()) / boxSizeNumber);
    }else if(boxSizeUnit == "hr") {
        numberOfBoxes += Math.floor((dateTime2.getHours() - dateTime1.getHours()) / boxSizeNumber);
    }

    return numberOfBoxes;
}

export function calculateRemainderTimeBetweenTwoDateTimes(dateTime1, dateTime2, boxSizeUnit, boxSizeNumber) {
    let remainderTime = 0;
    if(boxSizeUnit == "min") {
        remainderTime += ((dateTime2.getHours() - dateTime1.getHours())*60) % boxSizeNumber;
        remainderTime += (dateTime2.getMinutes() - dateTime1.getMinutes()) % boxSizeNumber;
    }else if(boxSizeUnit == "hr") {
        remainderTime += (dateTime2.getHours() - dateTime1.getHours()) / boxSizeNumber;
    }

    return remainderTime;
}

export function calculateMaxNumberOfBoxes(schedule, time, date) {
    let wakeUpTimeSeparated = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let currentDateTime = convertToDateTime(time, date);
    let maxNumberOfBoxes = 0;

    for(let i = 0; i < schedule.timeboxes.length; i++) { //for each time box
        let timeboxStartTimeInDateTime = new Date(schedule.timeboxes[i].startTime);

        if(currentDateTime < timeboxStartTimeInDateTime) { //if timebox occurs after the time of a timebox
            maxNumberOfBoxes = calculateBoxesBetweenTwoDateTimes(currentDateTime, timeboxStartTimeInDateTime, schedule.boxSizeUnit, schedule.boxSizeNumber);
            i = schedule.timeboxes.length;
        }else{
            i++;
        }
    }

    if(maxNumberOfBoxes <= 0) {
        maxNumberOfBoxes = calculateMaxNumberOfBoxesAfterTimeIfEmpty(schedule.boxSizeUnit, schedule.boxSizeNumber, timeSeparated, wakeUpTimeSeparated);
    }

    return maxNumberOfBoxes;
}

export function ifCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number == currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export function ifEqualOrBeyondCurrentDay(number, returnIfTrue, returnIfFalse) {
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    if(number >= currentDay) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export function addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes) {
    let [timeHours, timeMinutes] = time.split(":").map(function(num) { return parseInt(num); });
    let endHours = timeHours;
    let endMinutes = timeMinutes;

    if(boxSizeUnit == "min") {
        for(let i = 0; i < numberOfBoxes; i++) {
            endMinutes += boxSizeNumber;

            if(endMinutes >= 60) {
                if(endHours == 23) {
                    endHours = 0;
                }else{
                    endHours += 1;
                }
                endMinutes -= 60;
            }
        }
    }else if(boxSizeUnit == "hr") {
        endHours += numberOfBoxes * boxSizeNumber;
        if(endHours > 24) {
            endHours = endHours - 24;
        }
    }

    return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`;
}

export function calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, time) {

    let wakeupDateTime = convertToDateTime(wakeupTime, time.getDate()+"/"+time.getMonth());

    let boxesBetween = calculateBoxesBetweenTwoDateTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);
    let remainderTime = calculateRemainderTimeBetweenTwoDateTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);

    if(remainderTime < 0) {
        remainderTime = boxSizeNumber + remainderTime; 
    }

    const pixelsPerBox = overlayDimensions[2];
    const justBoxesHeight = pixelsPerBox * boxesBetween;
    const inBetweenHeight = (pixelsPerBox / boxSizeNumber) * remainderTime;

    if(overlayDimensions == 0 ) { //hasn't been set yet
        return 0;
    }
    return justBoxesHeight+inBetweenHeight;
}

export function calculateSizeOfOverlayBasedOnCurrentTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions) {
    const currentDate = new Date();
    currentDate.setHours(8);
    currentDate.setMinutes(25);

    return calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
}

export function calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, originalOverlayHeight) {
    //could do much more math but choosing easy route
    let overlaysTotalHeight = calculateSizeOfOverlayBasedOnCurrentTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions);
    let recordingOverlayHeight = overlaysTotalHeight - originalOverlayHeight;
    return recordingOverlayHeight;
}
