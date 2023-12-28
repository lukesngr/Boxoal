import { TimeboxContext } from '../timebox/TimeboxContext';
import { useContext, useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '@/modules/dateLogic';

export default function RecordingOverlay(props) {
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);
    const {schedule, activeOverlayHeight, overlayDimensions} = props;

    useEffect(() => {
        if(timeboxRecording != -1) {
            let recordingOverlayInterval = setInterval(() => {
                setRecordingOverlayHeight(calculateSizeOfRecordingOverlay(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions, activeOverlayHeight));
            }, 5000);
        
            return () => {
                clearInterval(recordingOverlayInterval);
            };
        }else{
            setRecordingOverlayHeight("0px");
        }
    }, [timeboxRecording])

    return (
        <>
            {timeboxRecording != -1 && <div className="recordingOverlay"
             style={{width: overlayDimensions[0]+"px", 
             height: recordingOverlayHeight,
            transform: `translate(-3px, ${activeOverlayHeight+3}px)`}}></div>}
        </>
    )
}