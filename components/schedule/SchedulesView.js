import SchedulesSidebar from "./SchedulesSidebar";
import '../../styles/viewschedules.scss';
import TimeBoxes from "../timebox/TimeBoxes";
import { ScheduleContextProvider } from "./ScheduleContext";

function SchedulesView(props) {
    return (
        <div className="container-fluid mt-2 h-100 schedulesViewContainer">
            <ScheduleContextProvider>
                <div className="row ">
                    <SchedulesSidebar data={props.data}></SchedulesSidebar>
                    <div className="col mx-auto d-flex-inline justify-content-center align-items-center">
                        <TimeBoxes data={props.data}></TimeBoxes>
                    </div>
                </div>
            </ScheduleContextProvider>
        </div>
    )
} 

export default SchedulesView;