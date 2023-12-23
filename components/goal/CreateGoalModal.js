import CreateGoalForm from "./CreateGoalForm";
import BootstrapModal from "../base/BootstrapModal";
import '../../styles/createmodal.scss';

export default function CreateGoalModal(props) {
    return <BootstrapModal id="createGoalModal" title="New Goal">
            <CreateGoalForm id={props.id}></CreateGoalForm>
    </BootstrapModal>
}