import { useEffect, useState } from "react";
import { calculatePixelsFromTopOfGridBasedOnTime } from "@/modules/coreLogic";
import UpdateTimeBoxModal from "../modal/UpdateTimeBoxModal";
import PortalComponent from "../modal/PortalComponent";
import { useSelector } from "react-redux";

export default function RecordedTimeBoxOverlay(props) {
    const [recordedBoxes, setRecordedBoxes] = useState([]);
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);

    let data = recordedTimeboxes.filter(function(obj) {
        let recordedStartTime = new Date(obj.recordedStartTime);
        return (recordedStartTime.getMonth()+1) == props.day.month && (recordedStartTime.getDate()) == props.day.date;
    })

    useEffect(() => {
        setRecordedBoxes([]) //so deleted recordings don't get stuck
        if(data.length > 0) {
            let normalArrayFromState = [...recordedBoxes];
            data.forEach(element => {
                let fieldsForCalculation = [wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions];
                let marginFromTop = calculatePixelsFromTopOfGridBasedOnTime(...fieldsForCalculation, new Date(element.recordedStartTime));
                let heightForBox = calculatePixelsFromTopOfGridBasedOnTime(...fieldsForCalculation, new Date(element.recordedEndTime)) - marginFromTop;
                if(heightForBox < 30) {
                    heightForBox = 30;
                }//reasonable value which alllows it is visible
                let notEitherZero = !(marginFromTop == 0 || heightForBox == 0); //due to overlay dimensions not being set at right time
                if(notEitherZero && !normalArrayFromState.some(item => item.id === element.id)) {
                    normalArrayFromState.push({timeBox: element.timeBox, id: element.id, heightForBox, marginFromTop, title: element.timeBox.title});
                }
            });
            setRecordedBoxes(normalArrayFromState);
        }
    }, [recordedTimeboxes]);
    
    return <>{recordedBoxes.map((recordedBoxes) => (
        <>
        <PortalComponent>
            <UpdateTimeBoxModal timebox={recordedBoxes.timeBox}></UpdateTimeBoxModal>
        </PortalComponent>
        <div key={recordedBoxes} data-bs-toggle='modal' data-bs-target={"#updateTimeBoxModal"+recordedBoxes.timeBox.id } className="recordedTimeBox" style={{width: props.overlayDimensions[0]+"px", 
        height: `${recordedBoxes.heightForBox}px`, transform: `translate(-3px, ${recordedBoxes.marginFromTop+3}px)`}}>{recordedBoxes.title}</div>
        </>
    ))}</>
}