import dayjs from "dayjs";

export function getArrayOfDayDateDayNameAndMonthForHeaders(todaysDate) {
    let dayToName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
    let result = [];

    for(let i = 0; i < 7; i++) {
        let currentDay = dayjs(todaysDate).day(i);
        result.push({day: currentDay.day(), month: currentDay.month()+1, name: dayToName[i], date: currentDay.date()}); 
    }

    return result;
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



