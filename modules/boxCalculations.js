import { useSelector } from "react-redux";
import { convertToDayjs } from "./formatters";
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
var utc = require('dayjs/plugin/utc');
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
import dayjs from "dayjs";
import { timeboxGrid } from "@/redux/timeboxGrid";

var hoursConversionDivisor = 3600000;

export function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

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

        if(!Number.isInteger(maxNumberOfBoxes)) {
            console.log("Minutes aren't divisible by boxSizeNumber, just gonna ignore");
            maxNumberOfBoxes = Math.round(maxNumberOfBoxes);
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

export function calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, boxSizeNumber) {
    let numberOfBoxes = 0;
    const minuteConversionDivisor = 60000;
    const hoursConversionDivisor = 3600000;

    if(boxSizeUnit == "min") {
        numberOfBoxes += Math.floor(((time2.valueOf() - time1.valueOf()) / minuteConversionDivisor) / boxSizeNumber);
    }else if(boxSizeUnit == "hr") {
        numberOfBoxes += Math.floor(((time2.valueOf() - time1.valueOf()) / hoursConversionDivisor) / boxSizeNumber);
    }

    if(time1 > time2) {
        return -numberOfBoxes;
    }else{
        return numberOfBoxes;
    }
}

export function calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, boxSizeNumber) {
    let remainderTime = 0;
    const minuteConversionDivisor = 60000;
    const hoursConversionDivisor = 3600000;

    if(boxSizeUnit == "min") {
        remainderTime += Math.round(((time2.valueOf() - time1.valueOf()) / minuteConversionDivisor) % boxSizeNumber);
    }else if(boxSizeUnit == "hr") {
        remainderTime += ((time2.valueOf() - time1.valueOf()) / hoursConversionDivisor) % boxSizeNumber;
    }

    return remainderTime;

}

export function calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxGrid, time, date) {
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let wakeUpTimeSeparated = wakeupTime.split(":").map(function(num) { return parseInt(num); });
    let currentTime = convertToDayjs(time, date);
    let maxNumberOfBoxes = 0;
    
    if(Object.hasOwn(timeboxGrid, date)) {
        let times = Object.keys(timeboxGrid[date]);
        for(let i = 0; i < times.length; i++) { //for each time box
            let [gridTimeboxTimeHours, gridTimeboxTimeMinutes] = times[i].split(":").map(function(num) { return parseInt(num); });
            if(timeSeparated[0] < gridTimeboxTimeHours || (timeSeparated[0] == gridTimeboxTimeHours && timeSeparated[1] < gridTimeboxTimeMinutes)) {
                maxNumberOfBoxes = calculateBoxesBetweenTwoTimes(currentTime, convertToDayjs(times[i], date), boxSizeUnit, boxSizeNumber);
                break;
            }
        }
    }

    if(maxNumberOfBoxes <= 0) {
        
        maxNumberOfBoxes = calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber, timeSeparated, wakeUpTimeSeparated);
    }

    return maxNumberOfBoxes;
}

export function addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes, date) {
    let [timeHours, timeMinutes] = time.split(":").map(function(num) { return parseInt(num); });
    let [day, month] = date.split("/").map(function(num) { return parseInt(num); });
    let endHours = timeHours;
    let endMinutes = timeMinutes;

    if(boxSizeUnit == "min") {
        endMinutes += boxSizeNumber*numberOfBoxes;

        if(endMinutes >= 60) {
            endHours += Math.floor(endMinutes / 60); 
            endMinutes = endMinutes % 60;

            if(endHours > 23) {
                day += Math.floor(endHours / 24);
                endHours = endHours % 24;
            }
        }
    }else if(boxSizeUnit == "hr") {
        endHours += numberOfBoxes * boxSizeNumber;
        if(endHours >= 24) {
            endHours = endHours - 24;
            day += 1;
        }
    }

    return [`${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`, `${day}/${month}`];
}

export function getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, startTime, endTime) {
    const minuteConversionDivisor = 60000;
    let minutesOfTimeBox = (endTime.valueOf() - startTime.valueOf()) / minuteConversionDivisor;
    let percentageOfBoxSizeFilled =  0;

    if(boxSizeUnit == "min") {
        percentageOfBoxSizeFilled = minutesOfTimeBox / boxSizeNumber;
    }else if(boxSizeUnit == "hr") {
        percentageOfBoxSizeFilled = minutesOfTimeBox / (boxSizeNumber * 60);
    }
    return percentageOfBoxSizeFilled;
}

export function getBoxesInsideTimeboxSpace(timeGridFilteredByDate, boxSizeUnit, boxSizeNumber, timeboxTime) {
    let timeGridTimesAsArray = Object.keys(timeGridFilteredByDate);
    let [endTime, endDate] = addBoxesToTime(boxSizeUnit, boxSizeNumber, timeboxTime, 1, '1/1'); //can see the benefits of typescript like wtf do these parameters do, need to check my code
    let filteredTimes = [];
    let i = 0;

    for(i = 0; i < timeGridTimesAsArray.length; i++) {
        let timeboxTimeAsDayJS = convertToDayjs(timeboxTime, '1/1');
        let currentTimegridTime = convertToDayjs(timeGridTimesAsArray[i], '1/1');
        let endOfTimeboxSpace = convertToDayjs(endTime, endDate);
        if(currentTimegridTime.isSameOrAfter(timeboxTimeAsDayJS, 'minute') && currentTimegridTime.isBefore(endOfTimeboxSpace, 'minute')) {
            filteredTimes.push(timeGridTimesAsArray[i]);
        }
    }

    return filteredTimes;
}

export function getMarginFromTopOfTimebox(boxSizeUnit, boxSizeNumber, timeboxTime, startOfTimeboxTime, timeboxHeight) {
    let minutesBetweenTimes = convertToDayjs(startOfTimeboxTime, '1/1').diff(convertToDayjs(timeboxTime, '1/1'), 'minute');
    let marginFromTop = 0;

    if(boxSizeUnit == "min") {
        marginFromTop = (minutesBetweenTimes / boxSizeNumber) * timeboxHeight;
    }else if(boxSizeUnit == "hr") {
        marginFromTop = (minutesBetweenTimes / (boxSizeNumber * 60)) * timeboxHeight;
    }

    return marginFromTop;
}

export function findSmallestTimeBoxLengthInSpace(timeboxGridFilteredByDate, timeboxesInSpace) {
    let smallestTimeboxLength = 1000000;
    const minuteConversionDivisor = 60000;

    for(let i = 0; i < timeboxesInSpace.length; i++) {
        let timeboxTime = timeboxesInSpace[i];
        let timebox = timeboxGridFilteredByDate[timeboxTime];

        let currentTimeboxLength = (new Date(timebox.endTime) - new Date(timebox.startTime)) / minuteConversionDivisor;
        if(currentTimeboxLength < smallestTimeboxLength) {
            smallestTimeboxLength = currentTimeboxLength;
        }
    }

    

    return smallestTimeboxLength;
} 

export function getStatistics(recordedTimeboxes, timeboxes, wakeupTime) {
    let reschedules = 0;
    let minutesOverBy = 0;
    let averageTimeStartedOffBy = 0;
    let timeboxesThatMatchPredictedStart = 0;
    let timeboxesThatMatchCorrectTime = 0;
    let today = dayjs()
    let startOfThisWeekDate = dayjs().day(0);
    let endOfThisWeekDate = dayjs().day(0);
    let startOfThisWeek = convertToDayjs(wakeupTime, (startOfThisWeekDate.date()+1)+'/'+(startOfThisWeekDate.month()+1));
    let endOfThisWeek = convertToDayjs(wakeupTime, (endOfThisWeekDate.date()+1)+'/'+(endOfThisWeekDate.month()+1))
    let nextDayWakeup = convertToDayjs(wakeupTime, (today.date()+1)+'/'+(today.month()+1));
    let hoursLeftThisWeek = 144;

    for(let i = 0; i < recordedTimeboxes.length; i++) {
        let recordedTimebox = recordedTimeboxes[i];
        let recordedTimeboxStartTime = new Date(recordedTimebox.recordedStartTime);
        let recordedTimeboxEndTime = new Date(recordedTimebox.recordedEndTime);
        let timeboxStartTime = new Date(recordedTimebox.timeBox.startTime);
        let timeboxEndTime = new Date(recordedTimebox.timeBox.endTime);
        
        //reschedule rate
        if(recordedTimeboxStartTime.getDate() != timeboxStartTime.getDate()) {
            reschedules++;
        }

        ///average minutes over by
        let currentMinutesOverBy = ((recordedTimeboxEndTime - recordedTimeboxStartTime) - (timeboxEndTime - timeboxStartTime));
        if(currentMinutesOverBy == 0) {
            timeboxesThatMatchCorrectTime++;
        }
        minutesOverBy += currentMinutesOverBy;
        
        //time started accuracy
        let timeStartedAccuracyForTimebox = Math.abs(recordedTimeboxStartTime.getMinutes() - timeboxStartTime.getMinutes());
        timeStartedAccuracyForTimebox += (Math.abs(recordedTimeboxStartTime.getHours() - timeboxStartTime.getHours()))*60;
        if(timeStartedAccuracyForTimebox == 0) {
            timeboxesThatMatchPredictedStart++;
        }
        averageTimeStartedOffBy += timeStartedAccuracyForTimebox;
    }


    minutesOverBy = minutesOverBy / 60000;
    let averageTimeOverBy = minutesOverBy / recordedTimeboxes.length;
    let percentageRescheduled = reschedules / recordedTimeboxes.length;
    averageTimeStartedOffBy = averageTimeStartedOffBy / recordedTimeboxes.length;
    let percentagePredictedStart = timeboxesThatMatchPredictedStart / recordedTimeboxes.length;
    let percentageCorrectTime = timeboxesThatMatchCorrectTime / recordedTimeboxes.length;
    if(recordedTimeboxes.length == 0) {
        averageTimeOverBy = 0;
        averageTimeStartedOffBy = 0;
        percentagePredictedStart = 0;
        percentageCorrectTime = 0;
        percentageRescheduled = 0;
    }

    for(let timebox of timeboxes) {

        let isInWeek = dayjs(timebox.startTime).isSameOrAfter(startOfThisWeek, 'date') && dayjs(timebox.startTime).isBefore(endOfThisWeek);
        let isReoccuring = timebox.reoccuring != null;
        if(timebox.isTimeblock && isInWeek) {
            hoursLeftThisWeek -= ((new Date(timebox.endTime) - new Date(timebox.startTime)) / hoursConversionDivisor)
        }else if(timebox.isTimeblock && isReoccuring) {
            if(timebox.reoccuring.endOfDayRange == timebox.reoccuring.startOfDayRange) {
                hoursLeftThisWeek -= (((new Date(timebox.endTime) - new Date(timebox.startTime))*1) / hoursConversionDivisor);
            }else {
                hoursLeftThisWeek -= (((new Date(timebox.endTime) - new Date(timebox.startTime))*(timebox.reoccuring.endOfDayRange - timebox.reoccuring.startOfDayRange)) / hoursConversionDivisor);
            }
             
        }  
    }

    hoursLeftThisWeek = Math.round(hoursLeftThisWeek)

    return {averageTimeOverBy, averageTimeStartedOffBy, percentagePredictedStart, percentageCorrectTime, percentageRescheduled, hoursLeftThisWeek};
}

export function getAverageTimeOverAndOffBy(timebox) {
    let recordedTimeboxStartTime = new Date(timebox.recordedTimeBoxes[0].recordedStartTime);
    let recordedTimeboxEndTime = new Date(timebox.recordedTimeBoxes[0].recordedEndTime);
    let timeboxStartTime = new Date(timebox.startTime);
    let timeboxEndTime = new Date(timebox.endTime);
    let minutesOverBy = ((recordedTimeboxEndTime - recordedTimeboxStartTime) - (timeboxEndTime - timeboxStartTime));
    let timeStartedAccuracyForTimebox = recordedTimeboxStartTime.getMinutes() - timeboxStartTime.getMinutes();
    timeStartedAccuracyForTimebox += (recordedTimeboxStartTime.getHours() - timeboxStartTime.getHours())*60;
    minutesOverBy = minutesOverBy / 60000;
    return {minutesOverBy, timeStartedAccuracyForTimebox};
}