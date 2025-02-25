import { useSelector } from "react-redux";
import { getPercentageOfBoxSizeFilled } from "@/modules/boxCalculations";

export default function NormalTimeBox(props) {
    const {boxSizeNumber, boxSizeUnit} = useSelector(state => state.profile.value);
    let percentageOfBoxSizeFilled = getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, new Date(props.data.startTime), new Date(props.data.endTime));
    console.log(percentageOfBoxSizeFilled);
    let calculatedHeight = `calc(${(Number(percentageOfBoxSizeFilled*100))}% + ${Number((percentageOfBoxSizeFilled-1)*2)}px)`
    return (
        <div style={{height: `${calculatedHeight}`, backgroundColor: props.data.color, zIndex: 999, position: 'relative'}} id="timeBox" data-testid="normalTimeBox">    
            <span className="timeboxText">{props.data.title}</span>
        </div>
    )
}