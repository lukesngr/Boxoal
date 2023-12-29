import '../../styles/noschedules.scss'
import CreateScheduleModal from '../modal/CreateScheduleModal'

export default function NoSchedules() {
    return (
    <>
        <div className="text-center mt-3" id="noSchedulesCard">
            <h1>No schedules made yet...</h1>
            <CreateScheduleModal render={tags => ( <button type="button" {...tags} className="btn btn-primary">Add new schedule</button>)}></CreateScheduleModal>
        </div>
    </>)
}