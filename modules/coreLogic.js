import { convertToDayjs, convertToTimeAndDate } from "./formatters";

import dayjs from "dayjs";
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
var utc = require('dayjs/plugin/utc')
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)




export function thereIsNoRecording(recordedBox,) {
    if(recordedBox == null) {
        return true;
    }else {
     return false;
    }
}

export function generateTimeBoxGrid(schedule, selectedDate) {
    let timeBoxGrid = {};

    schedule.timeboxes.forEach(function (element) { //for each timebox
        const [time, date] = convertToTimeAndDate(element.startTime); //convert the datetime to a time and date e.g. format hh:mm dd/mm
        if(element.reoccuring != null) {
            let startOfDayRange = element.reoccuring.startOfDayRange < element.reoccuring.endOfDayRange ? element.reoccuring.startOfDayRange : element.reoccuring.endOfDayRange;
            let endOfDayRange = element.reoccuring.startOfDayRange < element.reoccuring.endOfDayRange ? element.reoccuring.endOfDayRange : element.reoccuring.startOfDayRange;
             while(startOfDayRange <= endOfDayRange) {
                let currentDate = dayjs(selectedDate).day(startOfDayRange).format('D/M');
                if (!Object.hasOwn(timeBoxGrid, currentDate)) { timeBoxGrid[currentDate] = {}; } //if date key not in map than set empty map to date key
		if(!Object.hasOwn(timeBoxGrid[currentDate], time)) {
                	timeBoxGrid[currentDate][time] = element; //lookup date key and set the map inside it to key of time with value of the element itself
		}
                startOfDayRange++;
            }
        }else{
            if(!Object.hasOwn(timeBoxGrid, date)) { timeBoxGrid[date] = {}; } //if date key not in map than set empty map to date key
            timeBoxGrid[date][time] = element; //lookup date key and set the map inside it to key of time with value of the element itself
        }
    });

    return timeBoxGrid
}



export function goToDay(dispatch, daySelected, direction) {
    if(direction == 'left') {
        if(daySelected > 0) {
            dispatch({type: 'daySelected/set', payload: daySelected-1});
        }else if(daySelected == 0) {
            dispatch({type: 'daySelected/set', payload: 6});
        }
    }else if(direction == 'right') {
        if(daySelected < 6) {
            dispatch({type: 'daySelected/set', payload: daySelected+1});
        }else if(daySelected == 6) {
            dispatch({type: 'daySelected/set', payload: 0});
        }
    }
}

export function calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime) {
    const minuteConversionDivisor = 60000;
    let timeboxDuration = (new Date(timeboxData.endTime) - new Date(timeboxData.startTime)) / minuteConversionDivisor;
    let differenceBetweenStartTimes = Math.abs(recordedStartTime - new Date(timeboxData.startTime)) / minuteConversionDivisor;
    let firstPoint = 0;
    let slightlyMoreThanTimeboxDuration = timeboxDuration*1.3;
    if(differenceBetweenStartTimes >= slightlyMoreThanTimeboxDuration) {
        firstPoint = timeboxDuration / differenceBetweenStartTimes;
    }else if(differenceBetweenStartTimes < slightlyMoreThanTimeboxDuration) {
        let gradient = ((1/1.3)-1) / slightlyMoreThanTimeboxDuration; //using y=mx+c, using graphs for this logic as it makes calculating points based on certain values be linear
        firstPoint = gradient*differenceBetweenStartTimes + 1;
    }

    let recordingDuration = (recordedEndTime - recordedStartTime) / minuteConversionDivisor;
    let secondPoint = 1;

    if(recordingDuration > timeboxDuration) {
        secondPoint = timeboxDuration / recordingDuration;
    }
    return firstPoint + secondPoint;

}


export function getMaxNumberOfGoals(goalsCompleted) {
    if(goalsCompleted == 0) {
        return 1;
    }else if(goalsCompleted >= 1 && goalsCompleted < 6) {
        return 2;
    }else if(goalsCompleted >= 6 && goalsCompleted < 12) {
        return 3;
    }else if(goalsCompleted >= 12 && goalsCompleted < 24) {
        return 4;
    }else if(goalsCompleted >= 24) {
        return 100000000000; //whoever hits this is a god
    }
}

export function getHighestDenominatorUpTo(x, upTo) {
    if(x <= upTo) {
        return x;
    }else{
        for(let i = upTo; i > 0; i--) {
            if(x % i == 0) {
                return i;
            }
        }
    }
}

export function getLinesBetweenPoints(pointsArray, overallSizeOfPoint) {
    let goalX = 600;
    let goalY = 65;
    let linesArray = [];
    for (let i = 0; i < pointsArray.length; i++) {
        if(i+1 > (pointsArray.length - 1)) {
            if(pointsArray[i].x != goalX) {
                linesArray.push({
                    x1: pointsArray[i].x + (overallSizeOfPoint / 2),
                    y1: pointsArray[i].y + (overallSizeOfPoint / 2),
                    x2: goalX,
                    y2: goalY + (12 / 2)
                });
            }else{
                linesArray.push({
                    x1: pointsArray[i].x + (overallSizeOfPoint / 2),
                    y1: pointsArray[i].y + (overallSizeOfPoint / 2),
                    x2: goalX + (12 / 2),
                    y2: goalY + 12
                });
            }
        }else{
            linesArray.push({
                x1: pointsArray[i].x + (overallSizeOfPoint / 2),
                y1: pointsArray[i].y + (overallSizeOfPoint / 2),
                x2: pointsArray[i + 1].x + (overallSizeOfPoint / 2),
                y2: pointsArray[i + 1].y + (overallSizeOfPoint / 2)
            });
        }
    }
    return linesArray;
}

export function getOverallSizeOfPoint(xPerPoint, yPerPoint) {
    let calculatedSize = Math.min(xPerPoint, yPerPoint) * 0.9;
    if(calculatedSize < 12) {
        return calculatedSize;
    }else{
        return 12;
    }
}
