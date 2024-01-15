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