import { useSelector } from "react-redux";
import { getPercentageOfBoxSizeFilled } from "@/modules/boxCalculations";

export default function NormalTimeBox(props) {
    const {boxSizeNumber, boxSizeUnit} = useSelector(state => state.profile.value);
    let percentageOfBoxSizeFilled = getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, new Date(props.data.startTime), new Date(props.data.endTime));
    let height = Number(percentageOfBoxSizeFilled*100);
    return (
        <div style={{height: `${height}%`, backgroundColor: props.data.color}} id="timeBox" data-testid="normalTimeBox">    
            <span className="timeboxText">{props.data.title}</span>
        </div>
    )
}