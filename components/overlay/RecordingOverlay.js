import { useContext, useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '@/modules/coreLogic';
import { TimeboxRecordingContext } from '../timebox/TimeboxRecordingContext';
import { useSelector } from 'react-redux';

export default function RecordingOverlay(props) {
    const [timeboxRecording, setTimeBoxRecording] = useContext(TimeboxRecordingContext);
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);
    const {activeOverlayHeight, overlayDimensions} = props;
    const schedule = useSelector(state => state.scheduleEssentials.value);

    useEffect(() => {
        if(timeboxRecording[0] != -1) {
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