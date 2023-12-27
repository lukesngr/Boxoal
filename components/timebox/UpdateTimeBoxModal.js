import UpdateTimeBoxForm from "./UpdateTimeBoxForm";
import BootstrapModal from "../base/BootstrapModal";
import '../../styles/createmodal.scss';

export default function UpdateTimeBoxModal(props) {
    return <BootstrapModal id="updateTimeBoxModal" title="Update TimeBox">
            <UpdateTimeBoxForm timebox={props.timebox}></UpdateTimeBoxForm>
    </BootstrapModal>
}