import SchedulesSidebar from "../sidebar/SchedulesSidebar";
import '../../styles/viewschedules.scss';
import TimeBoxes from "../timebox/TimeBoxes";
import Loading from "../base/Loading";

function SchedulesView({data, isLoading}) {
    return (
      <>
	{isLoading && (<Loading />)}
        <div className="container-fluid mt-2 h-100 schedulesViewContainer">
            <div className="row ">
                <SchedulesSidebar data={data}></SchedulesSidebar>
                <div className="col mx-auto d-flex-inline justify-content-center align-items-center">
                    <TimeBoxes data={data}></TimeBoxes>
                </div>
            </div>
        </div>
      </>
    )
} 

export default SchedulesView;
