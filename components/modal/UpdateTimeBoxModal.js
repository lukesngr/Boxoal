import UpdateTimeBoxForm from "../form/UpdateTimeBoxForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function UpdateTimeBoxModal(props) {
    return <BootstrapModal id="updateTimeBoxModal" title="Update TimeBox">
            <UpdateTimeBoxForm timebox={props.timebox}></UpdateTimeBoxForm>
    </BootstrapModal>
}