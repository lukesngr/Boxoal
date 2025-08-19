import dayjs from "dayjs";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Icon } from "@mui/material";

export function GoalTreeTimeboxes(props) {
    let{goal} = props;
    return <div className="goalTreeTimeboxesContainer">
            <div className="twoComponentsInLine">
                <div className="goalTimeboxesCard" style={goal.state == "waiting" ? {backgroundColor: '#403D3D'} : {}}>
                    <span className="goalCardTitle">{goal.title}</span>
                    <span className="goalCardUndertext">{dayjs(goal.targetDate).format('D MMM')}</span>
                    {goal.state == "completed" && <span style={{color: '#4FF38E'}} className="goalCardUndertext">Completed</span>}
                    {goal.state == "failed" && <span style={{color: '#FF0606'}} className="goalCardUndertext">Failed</span>}
                    {goal.state == "active" && <span  className="goalCardUndertext">{goal.percentageCompleted}%</span>}
                </div>
                <div className="diagramArrows">
                    <svg viewBox="0 0 150 100">
                        <line x1={0} y1={50} x2={145} y2={50} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                        <line x1={145} y1={50} x2={145} y2={100} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                    </svg>
                    {goal.timeboxes.map((timebox, index) => (
                    <svg key={index} viewBox="0 0 150 50">
                        <line x1={145} y1={0} x2={145} y2={50} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                        <line x1={143} y1={48} x2={250} y2={48} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                    </svg>
                    ))}
                </div>
                <div>
                {goal.timeboxes.map((timebox) => {
                    let isFailed = dayjs().isAfter(dayjs(timebox.endTime)) && timebox.recordedTimeBoxes.length == 0;
                    console.log(timebox, isFailed)
                    return (
                    <div className="goalTimeboxCard">
                        <span className="goalTimeboxTitle"><AccessTimeIcon></AccessTimeIcon>{timebox.title}</span>
                        {isFailed && <span className="goalTimeboxFailed">Failed</span>}
                    </div>
                    )
                })}
                </div>
            </div>
            
        </div>
}