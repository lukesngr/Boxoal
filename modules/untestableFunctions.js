import dayjs from "dayjs";
import { useSelector } from "react-redux";

export function getCurrentDay() {
    const {wakeupTime} = useSelector(state => state.profile.value);
    const dateObject = dayjs();
    let currentDay = dateObject.day();
    let cutOffDateTime = dateObject.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]);

    if(dateObject.isBefore(cutOffDateTime)) {
        return currentDay-1;
    }else{
        return currentDay;
    }
}

export function getCurrentDate() {
    const {wakeupTime} = useSelector(state => state.profile.value);
    const dateObject = dayjs();
    let cutOffDateTime = dateObject.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]);

    if(dateObject.isBefore(cutOffDateTime)) {
        return dateObject.subtract(1, 'day');
    }else{
        return dateObject.date();
    }
}


export function ifCurrentDay(number, returnIfTrue, returnIfFalse) {
    const {wakeupTime} = useSelector(state => state.profile.value);
    const dateObject = dayjs();
    let currentDay = dateObject.day();
    let cutOffDateTime = dateObject.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]);

    if(typeof number !== 'number') { 
        console.log("Non-number datatype given to comparison function");
        return returnIfFalse;
    }

    if(number == currentDay &&  cutOffDateTime.isSameOrBefore(dateObject)) {
        return returnIfTrue;
    }else if((number+1) == currentDay && dateObject.isBefore(cutOffDateTime)) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export function ifEqualOrBeyondCurrentDay(number, returnIfTrue, returnIfFalse) {
    const {wakeupTime} = useSelector(state => state.profile.value);
    const dateObject = dayjs();
    let currentDay = dateObject.day();
    let cutOffDateTime = dateObject.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]);

    if(typeof number !== 'number') { 
        console.log("Non-number datatype given to comparison function");
        return returnIfFalse;
    }
    
    if(number >= currentDay && cutOffDateTime.isSameOrBefore(dateObject)) {
        return returnIfTrue;
    }else if((number+1) >= currentDay && dateObject.isBefore(cutOffDateTime)) {
        return returnIfTrue;
    }
    return returnIfFalse;
}