import dayjs from "dayjs";
export function GoalTreeTimeboxes(props) {
    let{goal} = props;
    return <div className="container">
            <div className="row">
                <div className="goalCard col-6" onClick={() => setGoalTreeGoalView({open: true, goal})} style={goal.state == "waiting" ? {backgroundColor: '#403D3D'} : {}}>
                    <span className="goalCardTitle">{goal.title}</span>
                    <span className="goalCardUndertext">{dayjs(goal.targetDate).format('D MMM')}</span>
                    {goal.state == "completed" && <span style={{color: '#4FF38E'}} className="goalCardUndertext">Completed</span>}
                    {goal.state == "failed" && <span style={{color: '#FF0606'}} className="goalCardUndertext">Failed</span>}
                    {goal.state == "active" && <span  className="goalCardUndertext">{goal.percentageCompleted}%</span>}
                </div>
            </div>
        </div>
}