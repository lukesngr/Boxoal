import CreateGoalForm from "../form/CreateGoalForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function CreateGoalModal(props) {
    return <BootstrapModal render={props.render} id="createGoalModal" title="New Goal">
            <CreateGoalForm id={props.id}></CreateGoalForm>
    </BootstrapModal>
}