import { TimeboxContext } from './TimeboxContext';
import { useContext } from 'react';

export default function RecordingOverlay(props) {
    const {addTimeBoxDialogOpen, setAddTimeBoxDialogOpen, listOfColors, timeboxRecording, setTimeBoxRecording} = useContext(TimeboxContext);

    return (
        <>
            {timeboxRecording != -1 && <div className="recordingOverlay"
             style={{width: props.width+"px", height: props.overlayHeight+"px", transform: `translate('-3px', ${props.activeOverlayHeight}px)`}}></div>}
        </>
    )
}