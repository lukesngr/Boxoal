import CreateAreaForm from "./CreateAreaForm";
import BootstrapModal from "../base/BootstrapModal";

export default function CreateGoalModal(props) {
    return <BootstrapModal id="createGoalModal" title="New Goal">
            <CreateAreaForm id={props.id}></CreateAreaForm>
    </BootstrapModal>
}