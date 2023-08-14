export default function NoSchedules() {
    return (
    <>
        <div className="text-center" id="noSchedulesCard">
            <h1>No schedules made yet...</h1>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createFirstScheduleModal">
                Add new schedule
            </button>
        </div>
        <div class="modal fade" id="createFirstScheduleModal" tabindex="-1" role="dialog" aria-labelledby="createFirstScheduleModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Schedule</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-dark">Create</button>
                </div>
                </div>
            </div>
            </div>
    </>)
}