import PortalComponent from "./PortalComponent";

export default function BootstrapModal(props) {
    //added portal component here as most times it is in a portal component anyway
    let buttonTags = {
        'data-bs-toggle': 'modal',
        'data-bs-target': `#${props.id}`};

    return (
        <>
            {props.render && props.render(buttonTags)}
            <PortalComponent>
                <div className="modal fade" id={props.id} tabIndex="-1" role="dialog" aria-labelledby={props.id} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{props.title}</h5>
                                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </PortalComponent>
        </>
    )
}