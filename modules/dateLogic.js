export function getDayNumbers() {
    const dateObject = new Date();
    let month = dateObject.getMonth();
    let day = dateObject.getDay();
    let date = dateObject.getDate();
    let dateToDay = new Map();
    let simpleArray = [0, 1, 2, 3, 4, 5, 6];

    let everythingInFrontOfCurrentDay = simpleArray.splice(simpleArray.indexOf(day)+1, simpleArray.length-1);
    let dayStack = everythingInFrontOfCurrentDay.concat(simpleArray)
    let currentDay = 0;

    while(dayStack.length > 0) {
        currentDay = dayStack.pop();
        let currentDate = (currentDay - day)+date;
        dateToDay.set(currentDay, currentDate);
    }

    return {month, dateToDay};
}

export function returnTimesSeperatedForSchedule(schedule) {

    let listOfTimes = []
    let wakeUpTimeSeperated = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });

    if(schedule.boxSizeUnit == "min") { 
        let currentHour = wakeUpTimeSeperated[0];
        let currentMinute = wakeUpTimeSeperated[1];
        
        while(currentHour < 25 && currentMinute < 60) {
            if(currentMinute < 10) {
                listOfTimes.push(currentHour+":0"+currentMinute);
            }else{
                listOfTimes.push(currentHour+":"+currentMinute);
            }
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }
        }

        currentHour = 0;
        currentMinute = 0;

        while(currentHour < wakeUpTimeSeperated[0] | currentMinute < wakeUpTimeSeperated[1]) {
            if(currentMinute < 10) {
                listOfTimes.push(currentHour+":0"+currentMinute);
            }else{
                listOfTimes.push(currentHour+":"+currentMinute);
            }
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }
        }
    }
}