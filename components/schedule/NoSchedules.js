import '../../styles/noschedules.scss'
import CreateScheduleModal from '../modal/CreateScheduleModal'

export default function NoSchedules() {
    return (
    <>
        <div className="text-center mt-3" id="noSchedulesCard">
            <h1>No schedules made yet...</h1>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createScheduleModal">
                Add new schedule
            </button>
        </div>
        
    </>)
}