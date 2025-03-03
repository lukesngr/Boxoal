import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { calculatePixelsFromTopOfGridBasedOnTime } from "../modules/overlayFunctions";
import { filterRecordingBasedOnDay } from "../modules/formatters";

export default function useRecordedBoxesForWeek(dayToName, recordedTimeboxes) {
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);

    let recordingBoxesForWeek = [];

    for(let day of dayToName) {
        let filteredRecordings = recordedTimeboxes.filter(filterRecordingBasedOnDay(day));
        let recordingBoxesForDay = [];
        if(filteredRecordings.length > 0) {
            filteredRecordings.forEach(element => {
                let pixelsToRecordingStart = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, dayjs(element.recordedStartTime));
                let pixelsToRecordingEnd = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, dayjs(element.recordedEndTime)); 
                let marginToRecording = pixelsToRecordingStart;
                let recordingBoxHeight = pixelsToRecordingEnd-marginToRecording;
                let availableSpace = (overlayDimensions.overlayHeight-marginToRecording);
                let biggerThanAvailableSpace = recordingBoxHeight > availableSpace;

                //error handling
                if(recordingBoxHeight < overlayDimensions.timeboxHeight) {
                    recordingBoxHeight = overlayDimensions.timeboxHeight;
                }else if(biggerThanAvailableSpace) { 
                    recordingBoxHeight = availableSpace;
                }

                let eitherIsNotZero = !(marginToRecording == 0 || recordingBoxHeight == 0); //due to overlay dimensions not being set at right time
                let notAlreadyInCache = !recordingBoxesForDay.some(item => item.id === element.id); //if not already in cache

                if(eitherIsNotZero && notAlreadyInCache) { //if not already in malleableBoxes push it to it
                    recordingBoxesForDay.push({timeBox: element.timeBox, id: element.id, recordingBoxHeight, marginToRecording, title: element.timeBox.title});
                }
            });
        }
        recordingBoxesForWeek.push(recordingBoxesForDay); 
    } 
    return recordingBoxesForWeek;
}