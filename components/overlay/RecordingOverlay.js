import { useContext, useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '../../modules/overlayFunctions';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export default function RecordingOverlay(props) {
    const {recordingStartTime, timeboxID} = useSelector(state => state.timeboxRecording.value);
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);
    const [marginFromTop, setMarginFromTop] = useState(overlayDimensions.headerHeight+activeOverlayHeight); 
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);
    let currentDate = dayjs();
    let overlayDate = currentDate.date(props.day.date).month(props.day.month-1);
    console.log(activeOverlayHeight)

    function setRecordingOverlay() {
        const recordingOverlayArray = calculateSizeOfRecordingOverlay(
            wakeupTime, 
            boxSizeUnit, 
            boxSizeNumber, 
            overlayDimensions, 
            activeOverlayHeight, 
            props.day, 
            recordingStartTime
        );

        setRecordingOverlayHeight(recordingOverlayArray[0]);
        setMarginFromTop(recordingOverlayArray[1]);
        console.log(recordingOverlayArray[1]);
    }

    useEffect(() => {
        if(timeboxID != -1 && dayjs(recordingStartTime).isSameOrBefore(overlayDate) && overlayDate.isSameOrBefore(currentDate)) {
            setRecordingOverlay();
            let recordingOverlayInterval = setInterval(() => setRecordingOverlay(), 5000);
            return () => clearInterval(recordingOverlayInterval);
        }else{
            setRecordingOverlayHeight("0px");
        }
    }, [timeboxID]);
    console.log("RecordingOverlay.js: recordingOverlayHeight: ", recordingOverlayHeight, marginFromTop);

    return (
        <>
            <div className="recordingOverlay"
             style={{backgroundColor: 'red',
                opacity: 0.7,
                zIndex: 999,
                position: 'absolute',
                width: overlayDimensions.headerWidth+"px", 
             height: recordingOverlayHeight,
            transform: `translate(-3px, ${marginFromTop-3}px)`}}></div>
        </>
    )
}