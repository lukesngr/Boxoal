import { TimeboxContext } from './TimeboxContext';
import { useContext, useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '@/modules/dateLogic';

export default function RecordingOverlay(props) {
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);

    useEffect(() => {
        if(timeboxRecording != -1) {
            let recordingOverlayInterval = setInterval(() => {
                console.log(props.activeOverlayHeight);
                console.log(calculateSizeOfRecordingOverlay(props.schedule, props.overlayDimensions, props.activeOverlayHeight)+"px")
                setRecordingOverlayHeight(calculateSizeOfRecordingOverlay(props.schedule, props.overlayDimensions, props.activeOverlayHeight));
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
             style={{width: props.overlayDimensions[0]+"px", 
             height: recordingOverlayHeight,
            transform: `translate(-3px, ${props.activeOverlayHeight+3}px)`}}></div>}
        </>
    )
}