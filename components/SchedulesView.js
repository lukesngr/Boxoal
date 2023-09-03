import SchedulesSidebar from "./SchedulesSidebar";
import '../styles/viewschedules.css';
import TimeBoxes from "./TimeBoxes";

function SchedulesView(props) {
    return (
        <div className="container-fluid mt-2 h-100" id="schedulesViewContainer">
            <div className="row">
                <div className="col-2">
                    <SchedulesSidebar data={props.data}></SchedulesSidebar>
                </div>
                <div className="col-10">
                    <TimeBoxes data={props.data}></TimeBoxes>
                </div>
            </div>
        </div>
    )
} 

export default SchedulesView;