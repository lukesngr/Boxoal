import { useEffect, useState } from "react";
import useRecordedBoxes from "../../hooks/useRecordedBoxesForWeek";
import { useSelector } from "react-redux";

export default function RecordedTimeBoxOverlay(props) {
    const {headerWidth} = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);
    let displayedRecordings = displayedRecordings = recordedBoxesForWeek;
    let recordedBoxesForWeek = useRecordedBoxes(props.dayToName, recordedTimeboxes);

    return <div style={{position: 'absolute', zIndex: 999}}>{displayedRecordings.map((displayedRecording, index) => {
        let dayIndex = index;
        return (
        <div key={index}>
            {displayedRecording.length > 0 && displayedRecording.map((recordedBox, index) => (
            <div key={index} className="recordedTimeBox" style={{
                width: headerWidth+"px", 
                height: `${recordedBox.recordingBoxHeight}px`, 
                transform: `translate(${headerWidth*dayIndex}, ${recordedBox.marginToRecording+3}px)`}}>{recordedBox.title}</div>
            ))}
        </div>
        )
    })}</div>
}