import dayjs from "dayjs";
export function GoalTreeTimeboxes(props) {
    let{goal} = props;
    return <div className="container">
            <div className="row">
                <div className="col-3">
                    <div className="goalCard" style={goal.state == "waiting" ? {backgroundColor: '#403D3D'} : {}}>
                        <span className="goalCardTitle">{goal.title}</span>
                        <span className="goalCardUndertext">{dayjs(goal.targetDate).format('D MMM')}</span>
                        {goal.state == "completed" && <span style={{color: '#4FF38E'}} className="goalCardUndertext">Completed</span>}
                        {goal.state == "failed" && <span style={{color: '#FF0606'}} className="goalCardUndertext">Failed</span>}
                        {goal.state == "active" && <span  className="goalCardUndertext">{goal.percentageCompleted}%</span>}
                    </div>
                </div>
                <div className="col-1">
                    <svg width={121} height={178} viewBox="0 0 178 121">
                        <line x1={173} y1={0} x2={173} y2={121} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                        <line x1={0} y1={0} x2={173} y2={0} style={{stroke:  "#875F9A", strokeWidth: 5}}></line>
                    </svg>
                </div>
            </div>
        </div>
}