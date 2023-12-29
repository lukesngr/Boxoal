import UpdateGoalForm from "../form/UpdateGoalForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function UpdateGoalModal(props) {
    return <BootstrapModal render={props.render} id="updateGoalModal" title="Update Goal">
            <UpdateGoalForm goal={props.goal}></UpdateGoalForm>
    </BootstrapModal>
}