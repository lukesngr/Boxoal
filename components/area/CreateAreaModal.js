import CreateAreaForm from "./CreateAreaForm";
import BootstrapModal from "../base/BootstrapModal";

export default function CreateAreaModal(props) {
    return <BootstrapModal id="createAreaModal" title="New Area">
            <CreateAreaForm id={props.id}></CreateAreaForm>
    </BootstrapModal>
}