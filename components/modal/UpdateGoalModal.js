import UpdateGoalForm from "../goal/UpdateGoalForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function UpdateGoalModal(props) {
    return <BootstrapModal id="updateGoalModal" title="Update Goal">
            <UpdateGoalForm goal={props.goal}></UpdateGoalForm>
    </BootstrapModal>
}