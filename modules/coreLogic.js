import { calculateRemainderTimeBetweenTwoDateTimes } from "./timeLogic";

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
    let [timeHours, timeMinutes] = timeSeparated;
    let [wakeupTimeHours, wakeupTimeMinutes] = wakeUpTimeSeparated;

    if(boxSizeUnit == "min") {
        const minutesInOneDay = 24 * 60; //idk why but this works //update this works cause I stuffed up 24 hour time
        let maxNumberOfBoxes = Math.floor(minutesInOneDay / boxSizeNumber);

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

    return calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
}

export function calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, originalOverlayHeight) {
    //could do much more math but choosing easy route
    let overlaysTotalHeight = calculateSizeOfOverlayBasedOnCurrentTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions);
    let recordingOverlayHeight = overlaysTotalHeight - originalOverlayHeight;
    return recordingOverlayHeight;
}


export function isRecordingButtonPresent(recordedBoxes, reoccuring, date, time) {
    if(recordedBoxes.length == 0) {
        return true;
    }else if(reoccuring != null) {
        if(reoccuring.reoccurFrequency == "daily") {
            let timeboxDateTime = convertToDateTime(time, date);
            let result = true
            recordedBoxes.forEach(element => {
                if(dayjs(timeboxDateTime).isSame(dayjs(element.recordedStartTime), 'date')) {
                    result = false;
                }
            });
            return result;
        }
    }
    return false;
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