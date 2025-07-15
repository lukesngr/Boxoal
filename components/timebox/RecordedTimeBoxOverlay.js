import { useEffect, useState } from "react";
import useRecordedBoxes from "../../hooks/useRecordedBoxesForWeek";
import { useSelector } from "react-redux";

export default function RecordedTimeBoxOverlay(props) {
    const {headerWidth, timeboxColWidth} = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);
    const recordedBoxesForWeek = useRecordedBoxes(props.dayToName, recordedTimeboxes);

    return <div style={{position: 'absolute', zIndex: 999}}>{recordedBoxesForWeek.map((recordedBoxesForDay, index) => {
        const dayIndex = index;
        return (
        <div key={index}>
            {recordedBoxesForDay.length > 0 && recordedBoxesForDay.map((recordedBox, index) => {
                return (
            <div key={index} className="recordedTimeBox" style={{
                width: headerWidth+"px", 
                height: `${Number(recordedBox.recordingBoxHeight)}px`, 
                transform: `translate(${(headerWidth*dayIndex+timeboxColWidth)-14}px, ${Number(recordedBox.marginToRecording)}px)`}}>{recordedBox.title}</div>
            )})}
        </div>
        )
    })}</div>
}