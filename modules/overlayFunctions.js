import { calculateBoxesBetweenTwoTimes, calculateRemainderTimeBetweenTwoTimes } from "./boxCalculations";
import dayjs from "dayjs";

export function calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, time) {

    if(overlayDimensions.headerWidth == 0 ) { //hasn't been set yet
        return 0;
    }

    const pixelsPerBox = overlayDimensions.timeboxHeight;

    let wakeupDateTime = time.hour(wakeupTime.split(":")[0]).minute(wakeupTime.split(":")[1]);

    if(time.isBefore(wakeupDateTime)) {
        wakeupDateTime = wakeupDateTime.subtract(1, 'day');
    }

    let boxesBetween = calculateBoxesBetweenTwoTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);
    let remainderTime = calculateRemainderTimeBetweenTwoTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);

    if(remainderTime < 0) { //if negative remainder e.g. time is behind number of boxes
        remainderTime = boxSizeNumber + remainderTime; //if remainder is negative then u need to get the minutes that are left
    }
    
    const justBoxesHeight = pixelsPerBox * boxesBetween;
    const inBetweenHeight = (pixelsPerBox / boxSizeNumber) * remainderTime;

    return justBoxesHeight+inBetweenHeight;
}

export function calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions) {
    const currentDate = dayjs();

    return calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
}

export function calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, originalOverlayHeight, day, recordedStartTime) {
    //could do much more math but choosing easy route
    const currentDate = dayjs();
    let recordedStartDate = dayjs(recordedStartTime);
    console.log(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, originalOverlayHeight, day, recordedStartTime)
    if(recordedStartDate.isBefore(currentDate, 'date')) {
        if(day.date < currentDate.date()) {
            return [overlayDimensions.overlayHeight, overlayDimensions.headerHeight];
        }else if(day.date == currentDate.date()) {
            let overlayTotalHeight = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate)
            return [overlayTotalHeight, overlayDimensions.headerHeight];
        }else if(day.date > currentDate.date()){
            return [0, 0];
        }
    }else if(recordedStartDate.isSame(currentDate, 'date')) {
        let overlaysTotalHeight = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
        let recordingOverlayHeight = overlaysTotalHeight - originalOverlayHeight;
        return [recordingOverlayHeight, originalOverlayHeight+overlayDimensions.headerHeight];
    }
}