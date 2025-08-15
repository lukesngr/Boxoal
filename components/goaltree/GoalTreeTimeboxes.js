import dayjs from "dayjs";
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
                <svg viewBox="0 0 150 100">
                    <line x1={0} y1={50} x2={145} y2={50} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                    <line x1={145} y1={50} x2={145} y2={100} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                </svg>
            </div>
        </div>
}