export function returnTimesSeperatedForSchedule(schedule) {

    let listOfTimes = [];
    let wakeUpTimeSeperatedIntoHoursAndMins;
    let currentHour;
    let currentMinute;

    try {
        wakeUpTimeSeperatedIntoHoursAndMins = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });
        currentHour = wakeUpTimeSeperatedIntoHoursAndMins[0]; //hours and minutes start off at wakeup time
        currentMinute = wakeUpTimeSeperatedIntoHoursAndMins[1];

        if(currentMinute == undefined) {
            throw "Wakeup time provided to function is not in correct format";
        }
    }catch(error) {
        if(error.name == 'TypeError') {
            console.log("Wakeup time provided to function is not a string");
        }else{
            console.log(error);
        }
        return [];
    }

    if(schedule.boxSizeUnit == "min") { 
        
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
        const currentMinute = wakeUpTimeSeperatedIntoHoursAndMins[1]; //minute doesn't change due to unit being hours
        
        while(currentHour < 24) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);  //push to list of times in format hh:mm 
            currentHour += schedule.boxSizeNumber;
        }

        currentHour = 0;

        while(currentHour < wakeUpTimeSeperatedIntoHoursAndMins[0]) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);
            
            currentHour += schedule.boxSizeNumber;
        }
    }

    return listOfTimes;
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