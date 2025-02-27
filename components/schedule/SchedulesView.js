import SchedulesSidebar from "../sidebar/SchedulesSidebar";
import '../../styles/viewschedules.scss';
import TimeBoxes from "../timebox/TimeBoxes";

function SchedulesView(props) {
    return (
        <div className="container-fluid mt-2 h-100 schedulesViewContainer">
            <div className="row ">
                <SchedulesSidebar data={props.data}></SchedulesSidebar>
                <div className="col mx-auto d-flex-inline justify-content-center align-items-center">
                    <TimeBoxes data={props.data}></TimeBoxes>
                </div>
            </div>
        </div>
    )
} 

export default SchedulesView;