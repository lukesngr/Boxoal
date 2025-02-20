import dayjs from 'dayjs';
export function returnTimesSeperatedForSchedule(profile) {

    let listOfTimes = [];
    let wakeUpTimeSeperatedIntoHoursAndMins;
    let currentHour;
    let currentMinute;

    try {
        wakeUpTimeSeperatedIntoHoursAndMins = profile.wakeupTime.split(":").map(function(num) { return parseInt(num); });
        currentHour = wakeUpTimeSeperatedIntoHoursAndMins[0]; //hours and minutes start off at wakeup time
        currentMinute = wakeUpTimeSeperatedIntoHoursAndMins[1];

        if(currentMinute == undefined) {
            throw "Wakeup time provided to function is not in correct format";
        }else if(currentMinute > 60 || currentMinute < 0) { //do minutes for readability sake
            throw "Wakeup time must be between 0:00 and 24:00";
        }else if((currentHour >= 24 && currentMinute > 0) || currentHour < 0  ) {
            throw "Wakeup time must be between 0:00 and 24:00";
        }

    }catch(error) {
        if(error.name == 'TypeError') {
            console.log("Wakeup time provided to function is not a string");
        }else{
            console.log(error);
        }
        return [];
    }

    if(!Number.isInteger(profile.boxSizeNumber)) {
        profile.boxSizeNumber = Math.floor(profile.boxSizeNumber);
        console.log("Beware decimal passed as box size number, was ignored");
    }

    if(profile.boxSizeUnit == "min") { 
        
        while(currentHour < 24 && currentMinute < 60) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);  //push to list of times in format hh:mm 
            
            currentMinute += profile.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }

        }

        currentHour = 0;
        currentMinute = 0;

        while(currentHour < wakeUpTimeSeperatedIntoHoursAndMins[0] || currentMinute < wakeUpTimeSeperatedIntoHoursAndMins[1]) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);
            
            currentMinute += profile.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }

        }
    }else if(profile.boxSizeUnit == "hr") {
        let currentHour = wakeUpTimeSeperatedIntoHoursAndMins[0]; //hours  start off at wakeup time
        const currentMinute = wakeUpTimeSeperatedIntoHoursAndMins[1]; //minute doesn't change due to unit being hours
        
        while(currentHour < 24) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);  //push to list of times in format hh:mm 
            currentHour += profile.boxSizeNumber;
        }

        currentHour = 0;

        while(currentHour < wakeUpTimeSeperatedIntoHoursAndMins[0]) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);
            
            currentHour += profile.boxSizeNumber;
        }
    }

    return listOfTimes;
}

export function getDateWithSuffix(date) {
    if (date > 3 && date < 21) {
        return `${date}th`
    };

    switch (date % 10) {
      case 1: return `${date}st`;
      case 2: return `${date}nd`;
      case 3: return `${date}rd`;
      default: return `${date}th`;
    }
};

export function filterRecordingBasedOnDay(day) { //used closure first time doing so, so nice
    return function(obj) {
        let recordedStartTime = dayjs(obj.recordedStartTime);
        let monthNotBasedOnZeroAsFirst = recordedStartTime.month()+1;
        return monthNotBasedOnZeroAsFirst == day.month && (recordedStartTime.date()) == day.date;
    }
}

export function convertToDayjs(time, date) {
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let dateSeparated = date.split("/").map(function(num) { return parseInt(num); });
    let dayjsInstance = dayjs().hour(timeSeparated[0]).minute(timeSeparated[1]).date(dateSeparated[0]).month(dateSeparated[1]-1).second(0).millisecond(0);
    return dayjsInstance;
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

    if(hours == 0) {
        hours = "00";
    }

    if(minutes < 10 && minutes != "00") {
        minutes = "0"+minutes;
    }

    if(hours < 10 && hours != "00") {
        hours = "0"+hours;
    }

    return [hours+':'+minutes, date+'/'+month];
}

