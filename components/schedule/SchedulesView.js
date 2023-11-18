import SchedulesSidebar from "./SchedulesSidebar";
import '../../styles/viewschedules.scss';
import TimeBoxes from "../timebox/TimeBoxes";
import { ScheduleContextProvider } from "./ScheduleContext";

function SchedulesView(props) {
    return (
        <div className="container-fluid mt-2 h-100" id="schedulesViewContainer">
            <ScheduleContextProvider>
                <div className="row">
                    <div className="col-2">
                        <SchedulesSidebar data={props.data}></SchedulesSidebar>
                    </div>
                    <div className="col-10">
                        <TimeBoxes data={props.data}></TimeBoxes>
                    </div>
                </div>
            </ScheduleContextProvider>
        </div>
    )
} 

export default SchedulesView;