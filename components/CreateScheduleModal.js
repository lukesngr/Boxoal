export default function CreateScheduleModal() {
    return (
        <div className="modal fade" id="createFirstScheduleModal" tabIndex="-1" role="dialog" aria-labelledby="createFirstScheduleModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Schedule</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-dark">Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}