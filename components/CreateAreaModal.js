import CreateAreaForm from "./CreateAreaForm";

export default function CreateAreaModal(props) {
    return (
        <div className="modal fade" id="createAreaModal" tabIndex="-1" role="dialog" aria-labelledby="createAreaModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Area</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <CreateAreaForm id={props.id}></CreateAreaForm>
                    </div>
                </div>
            </div>
        </div>
    )
}