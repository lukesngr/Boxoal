import dayjs from "dayjs";

export const dayToName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export function getArrayOfDayDateDayNameAndMonthForHeaders(todaysDate) {
    
    let result = [];

    for(let i = 0; i < 7; i++) {
        let currentDay = dayjs(todaysDate).day(i);
        result.push({day: currentDay.day(), month: currentDay.month()+1, name: dayToName[i], date: currentDay.date()}); 
    }

    return result;
}

export function alteredBinarySearchForTimeboxDate(timeboxes, selectedDate) {

    if(timeboxes.length == 0) {
        return 0;
    }

    let middle = timeboxes.length / 2;
    let middleStartTime = new Date(timeboxes[Math.floor(middle)].startTime);

    if(selectedDate.getTime() == middleStartTime.getTime() || timeboxes.length == 1) {
        return Math.floor(middle);
    }else if(selectedDate > middleStartTime) {
        return Math.floor(middle)+alteredBinarySearchForTimeboxDate(timeboxes.slice(middle), selectedDate);
    }else if(selectedDate < middleStartTime) {
        return alteredBinarySearchForTimeboxDate(timeboxes.slice(0, middle), selectedDate);
    }
}

export function filterTimeboxesBasedOnWeekRange(timeboxes, selectedDate) {
    if(timeboxes.length == 0) {
        return timeboxes;
    }
    let startOfWeek = dayjs(selectedDate).startOf('week').subtract(1, 'day').hour(0).minute(0).toDate();
    let endOfWeek = dayjs(selectedDate).endOf('week').hour(23).minute(59).toDate();
    let indexOfStartOfRange = alteredBinarySearchForTimeboxDate(timeboxes, startOfWeek);
    timeboxes = timeboxes.slice(indexOfStartOfRange); //do before to remove useless info
    let indexOfEndOfRange = alteredBinarySearchForTimeboxDate(timeboxes, endOfWeek);
    timeboxes = timeboxes.slice(0, indexOfEndOfRange+1);
    return timeboxes;
}

export function differenceInDates(date1, date2, wakeupTime) {
    let firstDate = dayjs(date1);
    let secondDate = dayjs(date2);
    let firstDateWithNoTime = firstDate.startOf('day');
    let secondDateWithNoTime = secondDate.startOf('day');
    let difference = firstDateWithNoTime.diff(secondDateWithNoTime, 'day');
    let cutoffFirstDate = firstDate.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]).second(0);
    let cutoffSecondDate = secondDate.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]).second(0);
    
    if(difference > 0) {
        if(firstDate.isBefore(cutoffFirstDate)) {
            console.log('how tf this running prolly some utc shit')
            difference -= 1;
        }else if(secondDate.isBefore(cutoffSecondDate)) {
            difference += 1;
        }
    }
    return difference;
}

export function reoccurringBoxOnOriginalDate(originalTime, date, time) {
    const original = dayjs(originalTime);
    const parsedDate = dayjs(date, 'DD/MM');
    const parsedTime = dayjs(time, 'HH:mm');
  
    const dayMatch = original.date() === parsedDate.date();
    const monthMatch = original.month() === parsedDate.month();
    const hourMatch = original.hour() === parsedTime.hour();
    const minuteMatch = original.minute() === parsedTime.minute();
  
  return dayMatch && monthMatch && hourMatch && minuteMatch;
}
